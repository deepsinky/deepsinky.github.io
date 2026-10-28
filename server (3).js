/* Minimal standalone server. If you already have a server (the one with /chat),
   skip this file and just add:  app.use("/auth", require("./auth"));            */
const express = require("express");
const cors = require("cors");
const app = express();
app.set("trust proxy", 1);
app.use(cors()); // tighten to your site's origin in production: cors({ origin: "https://your-site" })
app.use("/auth", require("./auth"));
app.get("/", (req, res) => res.send("DeepSINKY auth server running"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on " + PORT));
