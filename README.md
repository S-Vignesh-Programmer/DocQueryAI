# 📄 DocQueryAI – Ask Questions from Your PDF using AI (Gemini API)

> An intelligent document query system powered by **Gemini AI**, allowing users to upload PDFs and ask natural language questions. Built using the **MERN stack** with secure authentication and modern UI, this project demonstrates real-world AI integration and full-stack development

---

## 🌐 Live Demo

🔗 [Click here to try the app](https://doc-query-ai-gilt.vercel.app)

---


## Key Features

-  Upload any PDF and extract its content
-  Ask questions using **Gemini AI** (`gemini-2.5-flash`)
-  Secure authentication with **JWT**, **Bcrypt**, and **CORS**
-  User Dashboard showing plan and daily query usage
-  Premium Pricing Model with two tiers
-  Fully responsive UI using **React.js** and **Tailwind CSS**
-  Backend logic in **Node.js + Express.js**
-  Data management with **MongoDB + Mongoose**

---

## 🧑‍💻 Tech Stack

| Layer          | Technology                              |
|------------    |-----------------------------------------|
| Frontend       | React.js, TailwindCSS                   |
| Backend        | Node.js, Express.js                     |
| Database       | MongoDB with Mongoose                   |
| Authentication | JWT, Bcrypt.js, CORS                    |
| AI Integration | Gemini API (`gemini-2.5-flash`)         |
| Tools          | Git, GitHub, Postman, ThunderClient     |
| Hosting        | Vercel (Frontend), Render (Backend)     |

---

## 📂 Project Structure

DocQueryAI/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
│ └── tailwind.config.js
├── server/ # Express Backend
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js
└── README.md


---

## 🧠 AI Workflow

1. User uploads a PDF file
2. Text is extracted and parsed
3. User asks a question in natural language
4. The backend sends the content and question to **Gemini AI**
5. Gemini returns an intelligent answer, displayed in real-time

---

## 🔐 Authentication Flow

- Users can **sign up** and **log in**
- JWT token is generated and verified using middleware
- Passwords are hashed with **Bcrypt**
- Only authenticated users can access the dashboard and query services

---

## ⚙️ How to Run Locally

```bash
# Clone the repository
git clone https://github.com/S-Vignesh-Programmer/DocQueryAI.git

# Backend setup
cd server
npm install
npm run dev

# Frontend setup
cd ../client
npm install
npm run dev


Create a .env file

PORT=5000
MONGO_URI=your_mongo_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret


Future Enhancements
 -> Multi-file support & PDF summarization.

 -> AI memory-based conversation threads.

 -> Internationalization & multi-language support.

 -> Admin panel for usage insights.

Author
 Vignesh S
 Aspiring Java Full Stack Developer | AI-Integrated Project Builder
 Email: [vigneshprogrammer01@gmail.com]
 GitHub: S-Vignesh-Programmer

License
 This project is licensed under the MIT License – you are free to use, modify, and share it.
