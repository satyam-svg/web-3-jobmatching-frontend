
<h1 align="center">🚀 Rize-OS – Job & Networking Portal</h1>

<p align="center">
  <i>A modern Job & Networking platform with AI-powered resume parsing and Solana blockchain integration</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Go-1.21-blue?style=for-the-badge&logo=go" alt="Go"/>
  <img src="https://img.shields.io/badge/Solana-Web3-9945FF?style=for-the-badge&logo=solana" alt="Solana"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google" alt="Gemini AI"/>
</p>

---

## 🌟 Overview

Rize-OS is a **Next.js + Go-based full-stack Job & Networking platform**, inspired by LinkedIn and AngelList, built with:

- ✅ AI-powered **resume parsing & skill extraction** using **Google Gemini API**  
- ✅ **Solana blockchain** with **Phantom wallet** for secure recruiter payments  
- ✅ **Modern UI/UX** with modular components and protected routes  
- ✅ **Scalable MongoDB database** for users, resumes, and jobs  

---

## 📌 Features

- 🔐 **Secure Authentication:** JWT-based login and signup  
- 👤 **Profile Management:** Edit professional profiles with AI-extracted skills  
- 💼 **Job Listings & Feed:** Post jobs, browse opportunities  
- 🤖 **AI Insights:** Get match scores and smart job recommendations  
- 💳 **Blockchain Payments:** Solana + Phantom wallet for job posting fees  

---

## 🛠 Tech Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend    | [Next.js](https://nextjs.org/) (TypeScript, Tailwind CSS) |
| Backend     | [Golang](https://go.dev/)                          |
| Database    | [MongoDB](https://www.mongodb.com/)                |
| AI Services | [Google Gemini API](https://ai.google/)            |
| Blockchain  | [Solana Web3.js](https://solana.com/) + Phantom Wallet |

---

## 📂 Project Structure

```

src/
└── app/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── Jobs/           # Applicant job pages
├── recruiter/      # Recruiter dashboard
├── services/       # API services & integrations
├── types/          # TypeScript types
├── utils/          # Helper functions
├── globals.css     # Global styles
├── layout.tsx      # Layout configuration
├── page.tsx        # Landing page
└── middleware.ts   # Route protection
public/                   # Static assets

````

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/rize-os.git
cd rize-os
````

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GEMINI_API_KEY=your-gemini-api-key
MONGO_URI=your-mongodb-connection-string
SOLANA_NETWORK=devnet
ADMIN_WALLET=your-admin-wallet-address
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

### 5️⃣ Start Backend (Go Server)

```bash
cd backend
go run main.go
```

Runs on [http://localhost:5000](http://localhost:5000)

---

## 🌐 Phantom Wallet Connection

* Install [Phantom Wallet](https://phantom.app/) extension.
* Connect wallet before posting a job (transaction required).

---

## 🧪 Testing

```bash
npm test
```

---

## 🌍 Deployment

* **Frontend:** [Vercel](https://vercel.com)
* **Backend:** [Render](https://render.com) or [Railway](https://railway.app)

---

## 🤝 Contribution

Contributions are welcome!

1. Fork this repository
2. Create a new branch `feature-name`
3. Commit changes and push
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

