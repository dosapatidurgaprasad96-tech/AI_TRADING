# AllocateIQ - AI Trading Platform

A modern, full-stack, high-performance platform for automated and AI-driven trading. AllocateIQ offers a secure Express/MongoDB backend connected to a responsive React frontend, providing simulated paper trading, live portfolio tracking, and AI-powered market advice.

## 🚀 Key Features

### 🖥️ Customer Dashboard
- **Paper Trading Wallet**: Start with a simulated $100,000 to execute `BUY` and `SELL` orders.
- **Holdings & Net Worth**: Automatically tracks active assets, quantities, average costs, and total net worth in real time.
- **Trade History**: Detailed transaction logs, complete with volume tracking and execution status.
- **Watchlist**: Track your favorite market symbols (e.g. BTC, AAPL) with dynamically simulated price quotes and trend indicators + custom notes.

### 🧠 AI Trading Advisor 
- Integrated directly with the **OpenRouter SDK** to provide rich trading insights.
- Chat with the AI directly from the dashboard to get reasoning on whether to HOLD, BUY, or SELL.
- Currently powered by `nvidia/nemotron-3-super-120b-a12b:free` (configured to stream reasoning responses).

### 🔒 Secure Backend Architecture
- **Express.js & MongoDB**: Robust MVC framework handling complex dynamic schemas.
- **Authentication**: JWT-based user sessions, `bcrypt`-encrypted passwords, and strict input validation via `express-validator`.
- **Global Error Handling**: Uses `express-async-handler` to reliably catch faults without dropping the service.

## 📁 Project Structure

This project uses a standard monorepo structure separating the client boundary and backend services.

- **/client** - Frontend web application built with **Vite + React.js** and styled with TailwindCSS & custom utility components.
- **/server** - Backend API REST application powered by **Node.js, Express, and MongoDB (Mongoose)**.

## 🛠️ API Endpoints Reference

| Route | Method | Description |
|---|---|---|
| `/api/auth/register`, `/api/auth/login` | POST | Secure account creation and token generation |
| `/api/dashboard/summary` | GET | Comprehensive snapshot of holdings, net worth, and trades |
| `/api/portfolio` | GET | Query the user's secure wallet state |
| `/api/trades` | GET/POST | Create transactions (`BUY`/`SELL`) and list history |
| `/api/watchlist` | GET/POST/DELETE | Manage personal tracked symbols & notes |
| `/api/ai/advice` | POST | Stream context-aware trading insights from OpenRouter |

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm or yarn
- MongoDB (Running locally or an Atlas connection string)
- An API Key from [OpenRouter](https://openrouter.ai/) for the AI Advisor

### 1. Backend Setup (Server)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup local environment config:
   Copy `.env.example` to `.env` and fill out your local config:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database
   JWT_SECRET=your_jwt_secret_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup (Client)
1. In a new terminal, navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` securely if using custom ports (defaults to hitting `localhost:5000`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the UI:
   ```bash
   npm run dev
   ```
   *Navigate to the address provided by Vite (e.g. `http://localhost:5173`) to view the application.*

## 🤝 Development and Contribution

1. Create a descriptive branch: `git checkout -b feature/awesome-feature`
2. Commit your changes: `git commit -m "feat: adding an awesome feature"`
3. Push to the branch: `git push origin feature/awesome-feature`
4. Open a generic Pull Request against `main`.

## 📄 License

This project is licensed under the MIT License.
