# MoneyPilot - Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend
npm install -w frontend

# Install backend
npm install -w backend
```

### 2. Environment Setup

#### Backend (.env)
Create `.env` file in `/backend` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Any random secure string
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

#### Frontend (.env.local)
Create `.env.local` file in `/frontend` directory:

```bash
cp frontend/.env.example frontend/.env.local
```

### 3. Start Development Servers

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 5000
```

### 4. Test the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/health
- Demo credentials:
  - Email: demo@example.com
  - Password: demo123

---

## Project Structure

```
moneypilot/
├── frontend/                          # React 18 + Vite
│   ├── src/
│   │   ├── pages/                    # Page components
│   │   ├── components/               # Reusable UI components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # Zustand stores
│   │   ├── utils/                    # Helpers and API client
│   │   ├── styles/                   # Global styles & Tailwind
│   │   ├── App.tsx                   # Main app component
│   │   └── main.tsx                  # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Node.js + Express
│   ├── src/
│   │   └── index.js                  # Main server file
│   ├── routes/                       # API routes
│   ├── controllers/                  # Business logic
│   ├── models/                       # Mongoose schemas
│   ├── middleware/                   # Auth & error handling
│   ├── config/                       # Database configuration
│   ├── utils/                        # Helper functions
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                      # Workspace root
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary
- `GET /api/dashboard/health-score` - Get health score

### Expenses
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Add expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/analytics` - Get expense analytics

### Investments
- `GET /api/investments` - Get investments
- `POST /api/investments` - Add investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment

### Loans
- `GET /api/loans` - Get loans
- `POST /api/loans` - Add loan
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan

### Goals
- `GET /api/goals` - Get goals
- `POST /api/goals` - Add goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Reports
- `GET /api/reports/monthly` - Get monthly report
- `GET /api/reports/analytics` - Get analytics

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js 18+** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## Development Workflow

### Adding a New Feature

1. **Create Backend Endpoint**
   - Add route in `backend/routes/`
   - Create controller in `backend/controllers/`
   - Create/update Mongoose model in `backend/models/`

2. **Create Frontend Component**
   - Add page in `frontend/src/pages/`
   - Create components in `frontend/src/components/`
   - Add API call using custom hooks

3. **Test Locally**
   - Run dev servers: `npm run dev`
   - Test API endpoints using Postman/Thunder Client
   - Test UI in browser

### Common Commands

```bash
# Install package globally
npm install -g <package>

# Install to specific workspace
npm install <package> -w frontend
npm install <package> -w backend

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start -w backend
```

---

## Database Models

### User
- name, email, password
- googleId, avatar
- monthlySalary, currency
- preferences (darkMode, notifications)
- timestamps

### Expense
- userId, amount, category
- description, date, paymentMethod
- recurring, notes
- Indexed by: userId + date, userId + category

### Investment
- userId, type, name
- investedAmount, currentValue
- monthlyContribution, startDate, maturityDate
- expectedReturn, riskLevel, notes
- Indexed by: userId + type

### Loan
- userId, type, lenderName
- principalAmount, remainingAmount
- interestRate, emiAmount, emiDate
- tenure, startDate, endDate, paidEMI
- Indexed by: userId + endDate

### Goal
- userId, name, description, category
- targetAmount, savedAmount, deadline
- priority, status, emoji
- Indexed by: userId + status

### Report
- userId, month, year
- totalIncome, totalExpense, totalInvestment
- netWorth, savingsRate
- expensesByCategory, investmentGains
- recommendations
- Indexed by: userId + year + month

---

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Token included in all API requests
5. Backend validates token in auth middleware
6. Protected routes redirect to login if no token

---

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy build/ folder to Vercel
```

### Backend (Render)
```bash
git push origin main
# Render auto-deploys from GitHub
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Get connection string
- Update `MONGODB_URI` in backend `.env`

---

## Troubleshooting

### Port 3000/5000 already in use
```bash
# macOS/Linux
lsof -i :3000
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB connection error
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### CORS errors
- Update `FRONTEND_URL` in backend `.env`
- Check CORS middleware in `backend/src/index.js`

---

## Phase 2 Features (Coming Soon)

- [ ] AI Finance Analyzer with detailed insights
- [ ] SMS bank statement parsing
- [ ] UPI/GPay transaction tracking
- [ ] AI Chat Assistant
- [ ] Predictive savings forecasting
- [ ] Mobile app (React Native)

---

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

---

## License

MIT

---

**Built with ❤️ for better financial decisions**
