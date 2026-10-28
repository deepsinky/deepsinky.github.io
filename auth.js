/* DeepSINKY auth router: email+password and Google sign-in, JWT sessions.
   Mount it in your existing server:  app.use("/auth", require("./auth"));            */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
if (!JWT_SECRET || JWT_SECRET.length < 24) {
  throw new Error("Set JWT_SECRET (at least 24 random characters) in the environment.");
}
const google = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

/* ---------- tiny JSON user store (swap for a real DB in production) ---------- */
const DB_FILE = process.env.AUTH_DB || path.join(__dirname, "users.json");
let db = { users: {} };
try { db = JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch (e) { /* first run */ }
function persist() {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DB_FILE);
}
const byEmail = (e) => db.users[e] || null;
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, picture: u.picture || null });
const sign = (u) => jwt.sign({ sub: u.id, email: u.email }, JWT_SECRET, { expiresIn: "30d" });

/* ---------- helpers ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normEmail = (v) => String(v || "").trim().toLowerCase().slice(0, 254);
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

const hits = new Map(); // simple in-memory rate limit: 20 attempts / 10 min / IP
function limited(req, res, next) {
  const ip = (req.headers["x-forwarded-for"] || req.ip || "").toString().split(",")[0].trim();
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (arr.length >= 20) return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
  arr.push(now); hits.set(ip, arr);
  next();
}
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (!v.some((t) => now - t < 600000)) hits.delete(k); }, 600000).unref();

function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!m) return res.status(401).json({ error: "Not signed in" });
  try {
    const p = jwt.verify(m[1], JWT_SECRET);
    const u = Object.values(db.users).find((x) => x.id === p.sub);
    if (!u) return res.status(401).json({ error: "Account not found" });
    req.user = u; next();
  } catch (e) { res.status(401).json({ error: "Session expired. Please log in again." }); }
}

/* ---------- routes ---------- */
const router = express.Router();
router.use(express.json({ limit: "20kb" }));

router.get("/config", (req, res) => res.json({ google: !!GOOGLE_CLIENT_ID }));

router.post("/check", limited, (req, res) => {
  const email = normEmail(req.body.email);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Enter a valid email address" });
  const u = byEmail(email);
  res.json({ exists: !!u, hasPassword: !!(u && u.passwordHash) });
});

router.post("/signup", limited, async (req, res) => {
  const email = normEmail(req.body.email);
  const name = String(req.body.name || "").trim().slice(0, 80);
  const password = String(req.body.password || "");
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Enter a valid email address" });
  if (!name) return res.status(400).json({ error: "Enter your name" });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: "Password must be 8 to 128 characters" });
  if (byEmail(email)) return res.status(409).json({ error: "An account with this email already exists. Log in instead." });
  const u = { id: crypto.randomUUID(), email, name, passwordHash: await bcrypt.hash(password, 12), created: Date.now() };
  db.users[email] = u; persist();
  res.json({ token: sign(u), user: publicUser(u) });
});

router.post("/login", limited, async (req, res) => {
  const email = normEmail(req.body.email);
  const password = String(req.body.password || "");
  const u = byEmail(email);
  const ok = await bcrypt.compare(password, (u && u.passwordHash) || DUMMY_HASH);
  if (!u || !u.passwordHash || !ok) {
    if (u && !u.passwordHash) return res.status(401).json({ error: "This account uses Google sign-in. Tap Continue with Google." });
    return res.status(401).json({ error: "Incorrect email or password." });
  }
  res.json({ token: sign(u), user: publicUser(u) });
});

router.post("/google", limited, async (req, res) => {
  if (!google) return res.status(503).json({ error: "Google sign-in isn't configured on the server." });
  try {
    const ticket = await google.verifyIdToken({ idToken: String(req.body.credential || ""), audience: GOOGLE_CLIENT_ID });
    const p = ticket.getPayload();
    if (!p || !p.email || !p.email_verified) return res.status(401).json({ error: "Google account email isn't verified." });
    const email = normEmail(p.email);
    let u = byEmail(email);
    if (!u) {
      u = { id: crypto.randomUUID(), email, name: p.name || email.split("@")[0], picture: p.picture || null, googleId: p.sub, created: Date.now() };
      db.users[email] = u;
    } else {
      u.googleId = u.googleId || p.sub;
      u.picture = u.picture || p.picture || null;
    }
    persist();
    res.json({ token: sign(u), user: publicUser(u) });
  } catch (e) {
    res.status(401).json({ error: "Google sign-in failed. Please try again." });
  }
});

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
module.exports.requireAuth = requireAuth;
