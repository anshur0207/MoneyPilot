# MoneyPilot 💰

A minimalistic **mobile-first financial dashboard** to track net worth, analyze spending, get AI-based suggestions, and plan savings goals.

## Features

- **Dashboard**: Net worth, savings, investments, loans, burn rate at a glance
- **Expense Tracking**: Categorized expenses with daily/monthly charts
- **Investment Tracker**: Track SIPs, mutual funds, stocks, crypto, etc.
- **Loan Management**: EMI tracking, interest analysis, smart insights
- **AI Finance Analyzer**: Spending analysis, investment suggestions, risk assessment
- **Goal Planner**: Set and track financial goals with progress
- **Mobile-First**: Thumb-friendly, bottom navigation, dark mode
- **Reports**: Auto-generated monthly financial reports
- **Notifications**: EMI reminders, SIP alerts, spending limit warnings

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Axios (API calls)
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Google OAuth2

### Hosting
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```
finance-dashboard/
├── frontend/                 # React app
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Context API
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # Global styles
│   └── package.json
├── backend/                 # Express server
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── package.json
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Running the Project

### Development
```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend
npm run dev:backend
```

### Production Build
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/summary` - Get net worth summary
- `GET /api/dashboard/health-score` - Financial health score

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/analytics` - Expense analytics

### Investments
- `GET /api/investments` - Get all investments
- `POST /api/investments` - Add investment
- `DELETE /api/investments/:id` - Delete investment

### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Add loan
- `DELETE /api/loans/:id` - Delete loan

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Add goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Reports
- `GET /api/reports/monthly` - Get monthly report
- `GET /api/reports/analytics` - Get financial analytics

## Database Schema

### Collections
- **users** - User profiles and preferences
- **expenses** - Transaction records
- **investments** - Investment portfolio
- **loans** - Loan details
- **goals** - Savings goals
- **reports** - Monthly financial reports

## Roadmap

### Phase 1 (MVP)
- [x] Project setup
- [ ] Authentication (JWT + Google)
- [ ] Dashboard with summary cards
- [ ] Expense tracking
- [ ] Investment tracking
- [ ] Loan management
- [ ] Goal planner

### Phase 2
- [ ] AI Finance Analyzer
- [ ] Smart spending insights
- [ ] Auto-generated reports
- [ ] Notifications system

### Phase 3
- [ ] Bank SMS parsing
- [ ] UPI transaction tracking
- [ ] AI chat assistant
- [ ] Predictive savings analysis

## Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Contact & Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for smarter financial decisions**
