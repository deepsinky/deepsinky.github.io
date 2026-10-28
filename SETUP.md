# DeepSINKY: real Google + email login, poora process

Total 4 hisse hain. Is order mein karo. Phone par Google Cloud Console kholo to Chrome ke menu (⋮) mein **Desktop site** ON kar lo.

---

## Hissa A: Google Cloud mein Client ID banana (10 minute)

1. **console.cloud.google.com** kholo, apne Google account se login karo.
2. Upar project ke naam par tap karo → **New project** → Name: `DeepSINKY` → **Create**. Phir wahi project select karo.
3. Left menu (☰) → **APIs & Services** → **OAuth consent screen** (naye design mein **Google Auth Platform** dikhega, uske **Get started** par tap karo).
4. Form bharo:
   - App name: `DeepSINKY`
   - User support email: apna Gmail
   - Audience / User type: **External**
   - Contact email: apna Gmail
   - Terms tick karo → **Create**
5. **Audience** (ya "Publishing status") mein jaakar **Publish app** dabao aur confirm karo. Ye zaroori hai. Nahi karoge to sirf "Test users" wale hi login kar payenge. Hum sirf email aur profile maang rahe hain, isliye Google ki verification nahi lagti.
6. Left menu → **Credentials** (ya **Clients**) → **Create credentials** → **OAuth client ID**:
   - Application type: **Web application**
   - Name: `DeepSINKY web`
   - **Authorized JavaScript origins** → **Add URI** → exactly ye likho: `https://deepsinky.github.io`
     (aage `/` mat lagao, koi path mat lagao, `http` nahi `https`)
   - **Authorized redirect URIs** khali chhod do (zaroorat nahi)
   - **Create**
7. Jo **Client ID** dikhe (`123456-abc.apps.googleusercontent.com` jaisi) use copy karke kahin save kar lo. **Client secret** ki zaroorat nahi hai.

Google ko origin apply karne mein kabhi 5 minute se kuch ghante lag sakte hain.

---

## Hissa B: Client ID ko index.html mein lagana

`index.html` mein ye line dhundo (Ctrl+F: `googleClientId`):

```js
window.DEEPSINKY_CONFIG = window.DEEPSINKY_CONFIG || { api: "https://deepsinky-server-1.onrender.com", googleClientId: "" };
```

`googleClientId: ""` ke andar apni Client ID paste karo:

```js
googleClientId: "123456-abc.apps.googleusercontent.com"
```

GitHub par: apni repo `deepsinky.github.io` → `index.html` → ✏️ (edit) → change karo → **Commit changes**. 1 minute baad site refresh karo (pehle ek baar hard refresh / cache clear).

Phone par ye edit mushkil lage to Client ID mujhe bhej do, main `index.html` mein laga dunga.

---

## Hissa C: Render server par auth lagana

Server repo wo hai jisse `deepsinky-server-1` Render par chal raha hai.

1. Repo mein **Add file → Upload files** se `auth.js` daalo (main file ke saath, same folder mein).
2. `package.json` kholkar `dependencies` mein ye teen jodo (jo pehle se hain unhe mat hatao):
   ```json
   "bcryptjs": "^2.4.3",
   "jsonwebtoken": "^9.0.2",
   "google-auth-library": "^9.14.0"
   ```
3. Server ki main file (jisme `/chat` hai) mein `app = express()` aur `app.use(cors())` ke **neeche** ye line jodo:
   ```js
   app.use("/auth", require("./auth"));
   ```
   Agar `app.use(cors())` nahi hai to `cors` aisa lagao: `app.use(cors({ origin: "https://deepsinky.github.io" }))`.
4. Render dashboard → apni service → **Environment** → **Add Environment Variable**:
   - `JWT_SECRET` = koi bhi 30+ akshar ka random text (jaise password manager se banao)
   - `GOOGLE_CLIENT_ID` = wahi Client ID jo Hissa A mein mili
   - **Save changes**. Render apne aap redeploy karega (nahi to **Manual Deploy → Deploy latest commit**).
5. Deploy "Live" hone tak ruko (2-3 minute).

---

## Hissa D: Check karna

1. Browser mein kholo: `https://deepsinky-server-1.onrender.com/auth/config`
   - `{"google":true}` aaye = server theek hai.
   - "Route not found" ya "Cannot GET" = `auth.js` mount nahi hui (Hissa C step 3).
2. Site kholo (`https://deepsinky.github.io`). Google ka asli button dikhna chahiye. Dabao, apna Gmail chuno, app khul jayega.
3. Profile (avatar) mein **Log out** se wapas login screen aani chahiye.
4. Email se bhi ek naya account banakar dekho.

---

## Agar error aaye

| Dikhe | Matlab / fix |
|---|---|
| "Route not found" | `auth.js` server par mount nahi hui. Hissa C step 3. |
| "Google sign-in isn't set up yet" | `index.html` mein `googleClientId` khali hai ya GitHub par update nahi hui. |
| Google: `origin_mismatch` ya "origin is not allowed" | Hissa A step 6 ka origin galat hai. Exactly `https://deepsinky.github.io` hona chahiye. Thoda wait bhi karo. |
| Google: "Access blocked / app in testing" | Hissa A step 5: **Publish app** karo, ya apna email Test users mein jodo. |
| "Google sign-in failed" | Server ki `GOOGLE_CLIENT_ID` aur `index.html` wali ID alag hain. Dono same karo. |
| Render deploy fail, log mein "Set JWT_SECRET" | `JWT_SECRET` env variable add karo. |
| "Couldn't reach the server" | Render free server so raha hota hai, pehli baar 30-60 second lagte hain. Dobara try karo. CORS bhi check karo (Hissa C step 3). |

---

## Dhyan rakhne wali baatein

- Users abhi `users.json` file mein save hote hain. Render free plan par redeploy/restart par ye file mit jati hai. Pakke use ke liye MongoDB ya Supabase lagana hoga (main kar dunga).
- Chats abhi har device par alag save hoti hain, server par sync nahi hoti.
- Terms / Usage / Privacy Policy ke pages abhi nahi hain, isliye wo words click nahi hote.
