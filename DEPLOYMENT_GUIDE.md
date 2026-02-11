# TerraKnots Deployment & Configuration Guide

This guide provides step-by-step instructions to take your project from localhost to production using free/open-source tiers of modern services.

---

## 1. MongoDB Atlas (Cloud Database)
*Replaces your local MongoDB instance.*

1.  **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  **Deploy a Cluster:** Choose the "M0" (Free) tier and select a region close to you.
3.  **Database User:** Under "Database Access", create a new user with a username and a strong password. Note these down.
4.  **Network Access:** Under "Network Access", click "Add IP Address". Select **"Allow Access From Anywhere" (0.0.0.0/0)** for production, or add your specific IP for development.
5.  **Get Connection String:**
    - Click "Database" in the sidebar, then "Connect" on your cluster.
    - Choose "Drivers" and copy the connection string.
    - It should look like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/terraknots?retryWrites=true&w=majority`
    - Update your `.env` file in the backend with this string (replace `<password>` with your actual password).

---

## 2. Cloudinary (Image Management)
*Used for product images and uploads.*

1.  **Sign Up:** Create a free account at [Cloudinary](https://cloudinary.com/).
2.  **Dashboard:** On your dashboard, you will find:
    - `Cloud Name`
    - `API Key`
    - `API Secret`
3.  **Backend Config:** Add these to your backend `.env` file:
    ```env
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  The project is already wired to use these for uploading handmade treasure images.

---

## 3. Render (Backend Deployment)
*Hosts your Express.js server.*

1.  **Sign Up:** Connect your GitHub account to [Render](https://render.com/).
2.  **New Web Service:** Click "New" > "Web Service".
3.  **Connect Repo:** Select the `Terraknots` repository.
4.  **Settings:**
    - **Name:** `terraknots-backend`
    - **Root Directory:** `terraknots-backend`
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
5.  **Environment Variables:** Add all variables from your local `terraknots-backend/.env` file (MONGO_URI, JWT_SECRET, etc.).
6.  **URL:** Once deployed, Render will give you a URL like `https://terraknots-backend.onrender.com`. Copy this.

---

## 4. Razorpay (Payment Gateway)
*Handles online payments.*

1.  **Dashboard:** Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  **Test Mode:** Ensure you are in "Test Mode" for initial setup.
3.  **API Keys:** Go to "Settings" > "API Keys" > "Generate Key".
4.  **Copy Keys:**
    - `Key ID`: This goes to **both** Frontend and Backend `.env`.
    - `Key Secret`: This goes **only** to the Backend `.env`.
5.  **Env Config:**
    - Backend: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
    - Frontend: `NEXT_PUBLIC_RAZORPAY_KEY_ID`

---

## 5. Vercel (Frontend Deployment)
*Hosts your Next.js application.*

1.  **Sign Up:** Connect your GitHub to [Vercel](https://vercel.com/).
2.  **New Project:** Click "Add New" > "Project".
3.  **Connect Repo:** Select the `Terraknots` repository.
4.  **Settings:**
    - **Project Name:** `terraknots-frontend`
    - **Root Directory:** `terraknots-frontend`
    - **Framework Preset:** `Next.js`
5.  **Environment Variables:**
    - `NEXT_PUBLIC_API_URL`: Use your Render backend URL (e.g., `https://terraknots-backend.onrender.com/api`).
    - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID.
6.  **Deploy:** Click Deploy. Vercel will give you your production website URL!

---

## Post-Deployment Checklist
- [ ] Update `FRONTEND_URL` in backend env to your Vercel URL.
- [ ] Verify you can login/signup.
- [ ] Test a checkout flow (using Razorpay test cards or Manual UPI).
- [ ] Check if images upload correctly to Cloudinary.

Congratulations! Your handmade treasure shop is now live. 🎨🧶
