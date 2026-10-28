# DeepSINKY login server (real auth)

Email+password aur Google sign-in, dono server par verify hote hain. Passwords bcrypt se hash hokar save hote hain, login ke baad 30 din ka signed token (JWT) milta hai.

## 1. Server par lagana

Agar tumhara server (jisme `/chat` hai) pehle se hai, to `auth.js` us folder mein rakho aur sirf ye line add karo:

```js
app.use("/auth", require("./auth"));
```

Aur `npm i bcryptjs jsonwebtoken google-auth-library` chalao. Naya server chahiye to is folder ka `server.js` + `package.json` use karo (`npm install`, `npm start`).

Render par Environment Variables:

| Name | Value |
|---|---|
| `JWT_SECRET` | koi bhi lamba random text (24+ akshar) |
| `GOOGLE_CLIENT_ID` | Step 2 se milega |

## 2. Google sign-in ke liye (zaroori)

1. https://console.cloud.google.com → APIs & Services → Credentials → **Create credentials → OAuth client ID** → type **Web application**.
2. **Authorized JavaScript origins** mein wo `https://` address daalo jahan tumhara `index.html` khulta hai (jaise `https://deepsinky.onrender.com` ya Netlify/GitHub Pages ka link). Local test ke liye `http://localhost:5500` bhi add kar sakte ho.
3. Jo **Client ID** mile use Render par `GOOGLE_CLIENT_ID` mein daalo, aur `index.html` mein is line mein bhi:

```js
window.DEEPSINKY_CONFIG = { api: "https://deepsinky-server-1.onrender.com", googleClientId: "YAHAN-CLIENT-ID" };
```

Google ka button sirf `https://` (ya localhost) par chalta hai. File ko seedha phone ke file viewer se kholne par Google login nahi chalega, isliye `index.html` ko kisi https hosting par rakho. Jab tak `googleClientId` khali hai, app mein Google button dikhta hi nahi.

## 3. Routes

| Route | Kaam |
|---|---|
| `POST /auth/check` | email se pata karo account hai ya nahi |
| `POST /auth/signup` | naya account (email, name, password min 8) |
| `POST /auth/login` | email + password |
| `POST /auth/google` | Google ID token verify karke login/signup |
| `GET /auth/me` | token check |

Optional: `/chat` ko login ke peeche karne ke liye `const { requireAuth } = require("./auth"); app.post("/chat", requireAuth, ...)`. Iske liye `/chat` ke CORS mein `Authorization` header allow karna hoga, aur `index.html` ke `/chat` fetch mein `Authorization: "Bearer " + window.__auth.token` header jodna hoga.

## Dhyan rakho

- Users abhi `users.json` file mein save hote hain. Render free plan par har redeploy/restart par ye file mit jati hai, to users gayab ho jayenge. Real use ke liye isi file ke load/save ko MongoDB / Supabase / Postgres se badal do (`auth.js` ke upar ka "JSON user store" hissa).
- Login limit: ek IP se 10 minute mein 20 try.
- Chats abhi bhi har phone/browser mein alag save hoti hain (account ke hisaab se), server par sync nahi hoti.
