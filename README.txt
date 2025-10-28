Rupeedesk7 Admin Dashboard (Full Control)
=========================================

What this package contains:
- index.html (Admin login & create user)
- dashboard.html (Full control panel: Users, Inventory, Settings)
- firebase.js (Firebase initialization with your project values)
- admin.js (CRUD logic for users, inventory, settings)
- style.css (UI styles)

How to use:
1. Deploy with Firebase Hosting (recommended):
   - Install Firebase CLI: npm install -g firebase-tools
   - firebase login
   - firebase init hosting (choose existing project 'rupeedesk7')
   - Set 'public' directory to the folder where you'll place these files (e.g., 'admin-dashboard')
   - Copy these files into that folder or move this folder to your hosting path
   - firebase deploy

2. Local testing:
   - Run a simple static server: python3 -m http.server 8080
   - Open http://localhost:8080/index.html

Important admin setup steps:
- Create an admin auth user in Firebase Console (Authentication → Add user) or use "Create Admin" button on login page to create an auth user.
- After creating an auth user, add a document under Firestore collection '/admins' whose document id is the admin's UID and set { "isAdmin": true, "email": "admin@example.com" }.
  Example using Firebase Console: Collection 'admins' → New Document (id = uid) → add field isAdmin = true
- Only admin-authenticated users should be allowed to use this dashboard in production; secure your Firestore rules appropriately.

Security notes:
- This dashboard assumes Firebase Authentication + admins collection for authorization.
- Before deploying publicly, tighten Firestore rules to restrict writes to admins only.
- Never expose administrative accounts to untrusted users.

If you want, I can:
- Deploy this to Firebase Hosting for you (if you provide access or do the steps & I guide you).
- Add more admin features (export CSV, logs, bulk upload of inventory).
