# 🍬 Sweet Shop Backend API

A TypeScript-based backend application for managing a Sweet Shop system. The project supports user authentication, role-based access control, sweet inventory management, purchasing, restocking, and searching. The entire backend is implemented using **Node.js, Express, and TypeScript**, and follows **Test-Driven Development (TDD)** principles.

---

## 📌 Features

### 🔐 Authentication & Authorization
- User registration and login using JWT
- Password hashing using bcrypt
- Role-based access control (`USER`, `ADMIN`)
- Protected routes using authentication middleware

### 🍭 Sweet Management
- List all sweets (public)
- Search sweets by:
  - Name
  - Category
  - Minimum price
  - Maximum price
- Create new sweets (Admin only)
- Update existing sweets (Admin only)
- Delete sweets (Admin only)

### 🛒 Inventory Operations
- Purchase sweets (User)
- Automatic quantity reduction on purchase
- Restock sweets (Admin only)

### 🧪 Testing
- Comprehensive Jest test suite
- Covers authentication, middleware, health checks, CRUD operations, search, purchase, and restock
- All tests passing (27/27)

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|------------|
| Runtime     | Node.js    |
| Framework   | Express.js |
| Language    | TypeScript |
| Auth        | JWT, bcryptjs |
| Testing     | Jest, Supertest |
| Architecture| MVC-style modular structure |

---

## 📁 Project Structure

backend/
├── src/
│ ├── app.ts
│ ├── models/
│ │ ├── User.ts
│ │ └── Sweet.ts
│ ├── middleware/
│ │ └── auth.middleware.ts
│ ├── services/
│ │ └── auth.service.ts
│ ├── tests/
│ │ ├── auth..test.ts
│ │ ├── sweets..test.ts
│ │ └── health.test.ts
│ └── index.ts
├── package.json
├── tsconfig.json
└── jest.config.ts

---

## 🚀 API Endpoints

### Health
- `GET /health` → Check server status

### Authentication
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login and receive JWT

### Sweets
- `GET /api/sweets` → List all sweets
- `GET /api/sweets/search` → Search sweets with query params
- `POST /api/sweets` → Create sweet (Admin)
- `PUT /api/sweets/:id` → Update sweet (Admin)
- `DELETE /api/sweets/:id` → Delete sweet (Admin)

### Inventory
- `POST /api/sweets/:id/purchase` → Purchase a sweet
- `POST /api/sweets/:id/restock` → Restock sweet (Admin)

---

## 🔍 Search API Details

Query Parameters:
- `name` → Partial or full sweet name
- `category` → Sweet category
- `minPrice` → Minimum price
- `maxPrice` → Maximum price

Example:
GET /api/sweets/search?name=Barfi&category=Milk&minPrice=10

---

## ⚙️ Setup & Installation

1. Clone the repository
git clone <repository-url>
cd backend

2. Install dependencies
npm install

3. Environment variables
Create a `.env` file:
JWT_SECRET=your_secret_key

4. Run the server
npm run dev

---

## 🧪 Running Tests

Run all tests using:
npm test

Expected Output:
Test Suites: 10 passed, 10 total
Tests: 27 passed, 27 total


---

## 🤖 AI Usage Explanation

I used AI tools (such as ChatGPT) as a development assistant and mentor during this project. The AI helped me understand the requirements, design the backend architecture, and break the problem into manageable steps. I used it to clarify TypeScript and Express best practices, debug failing test cases, and validate logic against test-driven development (TDD) expectations.

All code was written incrementally with my understanding, reviewed against test cases, and manually integrated into the project. The AI did not replace my reasoning; instead, it guided me in identifying errors, improving structure, and ensuring correctness. Final implementation decisions and debugging were done by me after analyzing test outputs and application behavior.

In addition, AI assistance was mainly used for repetitive and boilerplate tasks such as generating standard Express route structures, middleware skeletons, basic CRUD patterns, and common validation logic. These were then adapted, integrated, and debugged by me according to the project’s test cases and requirements.

---

## ✅ Current Status

- Backend complete
- All features implemented
- All tests passing
- Ready for frontend integration or deployment

---

## 👩‍💻 Author

**Lakshmi Prasanna Mudige**  
Email: [lakshmiprasannamudiga@gmail.com](mailto:lakshmiprasannamudiga@gmail.com)  
LinkedIn: [https://www.linkedin.com/in/lakshmi-prasanna-mudige-b5205a257/](https://www.linkedin.com/in/lakshmi-prasanna-mudige-b5205a257/)  

---

✨ This project demonstrates clean backend architecture, proper testing practices, and real-world API design.
