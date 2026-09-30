# Lokhit Foundation website (static + Firebase)

Plain HTML/CSS/JS. No build step. Content lives in one Firestore document (`site/content`); the admin signs in on the site itself and edits text in place.

## 1. Firebase setup (once)
1. Firebase console → create a project.
2. **Build → Firestore Database** → Create database (production mode).
3. **Build → Authentication** → Sign-in method → enable **Email/Password** → Users tab → **Add user** (this is your admin login).
4. **Project settings → Your apps → Web (</>)** → copy the config into `firebase-config.js`.
5. **Firestore → Rules** → paste `firestore.rules`, replace `YOUR_ADMIN_EMAIL` with the admin email, Publish. (This is what actually stops other people writing.)
6. After you deploy: **Authentication → Settings → Authorized domains** → add `YOUR_USERNAME.github.io` (and your custom domain, if any).

## 2. Host on GitHub
Push this folder to a repo → Settings → Pages → Deploy from branch → `main` / root. The site uses `#/page` URLs so it works on GitHub Pages without extra config.

## 3. Editing
Click **Editor access** → sign in. Every text gets a dashed outline: click, type, click away — it saves to Firestore (bar shows "Saved ✓"). Enter finishes a line; on multi-line fields (addresses, captions) Shift+Enter is not needed, Enter adds a new line.
- Images (hero, home pictures, team photos, kit views): click the image and paste a URL or a path like `assets/my-photo.jpg` (commit the file to the repo).
- Projects / kits / team: add, delete, reorder (↑ ↓) and star projects as featured (highlighted band on the Projects page).
- Use the page menu in the bar to jump between pages while editing; "Turn off" previews the public view.

## Notes
- Without a real `firebase-config.js` the site runs in preview mode with default content (no editing).
- Firebase Storage is not used (it needs the paid plan); images are referenced by URL/path.
- The 243 MB video in the original zip isn't used by the site and is not included.
