# 📚 Book Review Platform (MERN)

A **Fullstack Book Review Platform** built using the **MERN Stack** — **MongoDB, Express.js, React, and Node.js**.  
Users can **sign up / log in**, **add books**, and **write reviews (rating + text)**.  
Protected routes use **JWT-based authentication** for secure access.

---

## ✨ Features

- 🔐 **User Authentication** (JWT + bcrypt)
- 📘 **Book Management (CRUD)** — only the creator can edit/delete
- 📝 **Review System** — users can create, edit, or delete their own reviews
- 📊 **Pagination** — 5 books per page
- ⭐ **Average Rating Calculation** — displayed on book details page
- 💻 **Frontend:** React (Vite) + Bootstrap
- ⚙️ **Backend:** Node.js + Express + MongoDB Atlas + Mongoose

---




## Requirements
- Node.js v16+
- npm
- MongoDB Atlas account

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill values:
MONGO_URI=your_mongodb_uri
JWT_SECRET=supersecret
PORT=5000

4. `npm run dev` (server starts on port 5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. (Optional) create `.env` with `VITE_API_URL=http://localhost:5000/api`
4. `npm run dev` (open http://localhost:5173)

## API Endpoints

### Auth
- POST `/api/auth/signup` — body: `{ name, email, password }`
- POST `/api/auth/login` — body: `{ email, password }`

### Books
- GET `/api/books?page=1&limit=5&search=...&genre=...`
- POST `/api/books` — (auth) create book
- GET `/api/books/:id` — get details + reviews
- PUT `/api/books/:id` — (auth, owner) edit
- DELETE `/api/books/:id` — (auth, owner) delete

### Reviews
- POST `/api/reviews` — (auth) body: `{ bookId, rating, reviewText }`
- PUT `/api/reviews/:id` — (auth, owner)
- DELETE `/api/reviews/:id` — (auth, owner)
- GET `/api/reviews/book/:bookId` — list reviews for book

## Testing
Use Postman or the React UI. For protected endpoints add header:
## 📁 Folder Structure

```bash
/book-review-project
│
├── /backend
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   │
│   ├── /config
│   │   └── db.js
│   │
│   ├── /models
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   │
│   ├── /middleware
│   │   └── auth.js
│   │
│   ├── /controllers
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   │
│   └── /routes
│       ├── auth.js
│       ├── books.js
│       └── reviews.js
│
├── /frontend
│   ├── package.json
│   ├── index.html
│   │
│   └── /src
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── /api
│       │   └── axios.js
│       │
│       ├── /context
│       │   └── AuthContext.jsx
│       │
│       ├── /components
│       │   ├── ProtectedRoute.jsx
│       │   ├── BookCard.jsx
│       │   ├── BookList.jsx
│       │   └── Navbar.jsx
│       │
│       └── /pages
│           ├── Signup.jsx
│           ├── Login.jsx
│           ├── BookList.jsx
│           ├── BookDetails.jsx
│           ├── AddEditBook.jsx
│           └── Profile.jsx
│
└── README.md
