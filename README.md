# AI Email Template Generator

## 🚀 Overview
AI Email Template Generator is a powerful Next.js-based SaaS application that allows users to create, edit, and share AI-generated email templates. It features a rich text email editor, drag-and-drop functionality, and seamless authentication with Clerk. Built with cutting-edge technologies like Convex and Google's Gemini AI, this tool makes email creation faster and smarter.

## ✨ Features

- **AI-Powered Email Generation** (Powered by Gemini API)
- **Authentication with Clerk** (Sign in with OAuth providers)
- **Rich Text Email Editor** (For advanced formatting)
- **Drag and Drop Functionality** (Easy email template organization)
- **Save & Manage Templates** (Store emails for future use)
- **Email Sharing** (Share generated emails via a unique link)
- **Fast & Scalable Backend** (Using Convex for data storage)

## 🛠️ Tech Stack

- **Next.js** (Framework for a fast and scalable frontend)
- **ShadCN** (For a beautiful UI experience)
- **Convex** (Database and backend functions)
- **Clerk** (Authentication and user management)
- **Gemini API** (For AI-generated email templates)
- **Tailwind CSS** (For styling and responsiveness)

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Nainee99/ai-email-template-generator.git
cd ai-email-template-generator
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env.local` file and add the necessary API keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CONVEX_URL=your-convex-url
GEMINI_API_KEY=your-gemini-api-key
```

### 4️⃣ Run the Development Server
```sh
npm run dev
```
Visit `http://localhost:3000` to access the app.

## 📌 Usage Guide

1. **Login/Register** via Clerk authentication.
2. **Generate AI-powered email templates** with Gemini.
3. **Edit email templates** using the rich text editor.
4. **Drag and drop** email components to customize layouts.
5. **Save templates** for later use.
6. **Share templates** via a unique link.

## 🚀 Deployment
To deploy the app, use **Vercel** for seamless Next.js hosting.
```sh
npm run build
vercel deploy
```

## 🛡️ Security & Authentication
- Clerk is used for authentication, ensuring secure login.
- Only authenticated users can save or share templates.

## 📜 License
This project is open-source under the **MIT License**.

## 🤝 Contributing
Feel free to contribute! Submit a PR or open an issue for discussions.

---

💡 **Developed with ❤️ using Next.js, Convex, Clerk, and Gemini AI**

