
---

# 🔐 Authentication API (JWT + Email OTP Password Reset)

## 📌 Project Overview

A **secure authentication backend API** built using **Node.js, TypeScript, Prisma, and MongoDB**.
It provides **user authentication using JWT** and a **password reset mechanism via Email OTP verification**.

Designed with **real-world backend practices**, this project is suitable for **production use** and **resume-level CSE projects**.

---

## 🚀 Features

* ✅ User Registration
* ✅ User Login
* ✅ Password Hashing using **bcrypt**
* ✅ JWT **Access Token & Refresh Token**
* ✅ Forgot Password using **Email OTP**
* ✅ OTP Verification before Password Reset
* ✅ Secure Token Handling
* ✅ Prisma ORM with MongoDB
* ✅ Environment-based Configuration

---

## 🧠 Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Runtime   | Node.js                       |
| Language  | TypeScript                    |
| Framework | Express                       |
| ORM       | Prisma                        |
| Database  | MongoDB (Replica Set / Atlas) |
| Auth      | JWT                           |
| Security  | bcrypt                        |
| Email     | Nodemailer (Gmail SMTP)       |

---

## 🔐 Authentication Flow

### 1️⃣ User Registration

* User submits email & password
* Password is hashed using bcrypt
* User is stored in MongoDB

---

### 2️⃣ User Login

* Email and password are validated
* Access Token & Refresh Token are generated

---

### 3️⃣ Password Reset (Email OTP)

#### Step 1: Request OTP

* User provides registered email
* System generates a **6-digit OTP**
* OTP is sent to the user via email

#### Step 2: Verify OTP

* User submits OTP
* OTP is validated

#### Step 3: Reset Password

* User sets a new password
* Password is hashed and updated
* OTP is invalidated after successful reset

✅ Ensures **email ownership verification** and secure password recovery.

---

## 📩 Email Configuration (Gmail SMTP)

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=Auth Service <your_email@gmail.com>
```

⚠️ Use **Gmail App Passwords** (not your actual Gmail password).

---

## 🛠️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/anuj2731997/Authentication.git
cd Authentication
```

---

## ⚙️ Frontend Setup

1. Create environment file:

```bash
touch .env.local
```

2. Copy values from `sample.env.local` and update them.

3. Install dependencies:

```bash
npm install
```

4. Run frontend:

```bash
npm run dev
```

---

## ⚙️ Backend Setup

### Move to server folder

```bash
cd server
```

### Install dependencies

```bash
npm install
```

### Environment variables

```bash
touch .env
```

Copy values from `sample.env` and replace with actual credentials.

---

## 🧩 Prisma Setup

```bash
cd db
npx prisma generate
npx prisma db push
```

---

## 🚀 Run Backend Server

```bash
cd server
npm run start
```

> **PM2** is used as the process manager.

### PM2 Commands

```bash
pm2 list
pm2 stop <id|name>
```

---

## ⚠️ Important Notes

* MongoDB **must run as a Replica Set**
* **MongoDB Atlas is recommended**
* Password reset is allowed **only after OTP verification**
* Use environment variables for all secrets

---

## 📄 License

This project is **open-source**.
Free to use, modify, and extend.

---