# Mutual Fund Investment Tracking System - Implementation Guide

## Overview

A complete **Mutual Fund Investment Tracking System** has been successfully implemented for **MoneyPilot**, featuring real-time NAV updates, portfolio analytics, and a premium fintech dashboard.

---

## Features Implemented

### ✅ Backend Services

#### 1. **MFAPI Service** (`backend/services/mfService.js`)
- Real-time NAV fetching from MFAPI
- Caching mechanism (5-minute TTL)
- Historical NAV retrieval
- Fund search functionality
- Batch NAV updates
- Period-based NAV filtering

#### 2. **Portfolio Service** (`backend/services/portfolioService.js`)
- Profit/Loss calculations
- Return percentage calculations
- XIRR (Extended Internal Rate of Return) computation
- SIP return calculations
- Asset allocation analysis
- Portfolio diversification scoring (0-100)
- Risk scoring
- AI-powered portfolio insights generation

#### 3. **Mutual Fund Controller** (`backend/controllers/mutualFundController.js`)
- Add mutual fund investments
- Fetch user portfolio
- Get detailed fund information
- Update NAVs for all funds
- Search mutual funds
- Compare multiple funds
- Calculate fund metrics

#### 4. **Updated Models**
- **Investment Model** extended with:
  - `isMutualFund` flag
  - `schemeCode` (MFAPI identifier)
  - `units` (quantity of units held)
  - `purchaseNAV` and `currentNAV`
  - `category` (Equity, Debt, Gold, Hybrid, etc.)
  - `fundHouse` (fund provider)
  - Historical NAV data storage

### ✅ API Endpoints

**Base URL:** `http://localhost:5001/api/mutual-funds`

```
GET    /portfolio                      - Get user's portfolio
POST   /add                            - Add new mutual fund
PUT    /update/:id                     - Update fund investment
DELETE /:id                            - Delete fund investment
GET    /:id                            - Get fund details
GET    /fund-details/:schemeCode       - Get fund info from MFAPI
GET    /chart/:schemeCode              - Get historical chart data
GET    /search/funds?query=            - Search mutual funds
POST   /update-all-navs                - Update NAV for all funds
POST   /compare                        - Compare multiple funds
```

### ✅ Frontend Components

#### 1. **Pages**
- **MutualFundsPage** - Main dashboard with portfolio summary, charts, and investment cards
- **MutualFundDetailsPage** - Detailed view of individual fund with historical performance

#### 2. **Components**
- **PortfolioSummary** - Shows total portfolio value, invested amount, profit/loss, and asset allocation donut chart
- **MutualFundCard** - Individual fund card with mini sparkline chart, current value, and returns
- **FundSearchModal** - Interactive search modal for finding and adding funds
- **PortfolioCharts** - Historical performance charts with multiple timeframes
- **InsightsSection** - AI-generated portfolio insights

#### 3. **UI Features**
- Dark navy background with purple-blue gradients
- Glassmorphism design with backdrop blur
- Smooth Framer Motion animations
- Responsive grid layouts
- Real-time data updates
- Mobile-first design

---

## Technology Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Axios (API calls)
- JavaScript ES6+

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)
- React Router (navigation)

### External API
- MFAPI (https://api.mfapi.in)

---

## Portfolio Calculations

### 1. **Current Value**
```
Current Value = Units × Current NAV
```

### 2. **Profit/Loss**
```
Profit/Loss = Current Value - Invested Amount
```

### 3. **Return Percentage**
```
Return % = (Profit / Invested Amount) × 100
```

### 4. **XIRR (Annualized Return)**
```
XIRR = (Current Value / Invested Amount)^(1/Years) - 1
```

### 5. **Daily Gain/Loss**
```
Daily Gain = (Current NAV - Previous NAV) × Units
```

### 6. **Asset Allocation**
```
Percentage = (Fund Value / Total Portfolio) × 100
```

---

## Key Metrics

### Portfolio Summary
- **Total Invested** - Sum of all investments
- **Portfolio Value** - Current total value
- **Total Profit/Loss** - Absolute gains/losses
- **Return %** - Overall portfolio return
- **Diversification Score** - 0-100 based on category distribution
- **Risk Score** - 0-100 based on fund risk levels

### Fund Metrics
- Current NAV
- Purchase NAV
- Units held
- Invested Amount
- Current Value
- Profit/Loss
- Return %
- XIRR
- Historical performance

---

## Database Schema

### Investment Collection
```javascript
{
  userId: ObjectId,
  type: "Mutual Fund",
  name: String,
  isMutualFund: Boolean,
  schemeCode: String,
  units: Number,
  investedAmount: Number,
  purchaseNAV: Number,
  currentNAV: Number,
  category: String,
  fundHouse: String,
  currentValue: Number,
  historicalNAVs: [{
    date: Date,
    nav: Number
  }],
  startDate: Date,
  lastUpdated: Date,
  riskLevel: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies (if not already installed)
npm install axios

# Start development server
npm run dev

# Seed demo mutual fund data
npm run seed:mf
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

### 3. Environment Configuration

**Backend (.env)**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/moneypilot
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:5001
```

---

## How to Use

### Adding a Mutual Fund

1. Navigate to **Funds** tab in navigation
2. Click **"Add Fund"** button
3. Search for mutual fund (e.g., "Parag Parikh")
4. Select from results
5. Enter:
   - Number of units
   - Invested amount
   - Purchase date
   - Category
6. Click **"Add Fund"**

### Viewing Portfolio

- **Portfolio Summary** shows total value and asset allocation
- **Portfolio Charts** display historical performance
- **Insights Section** shows AI-generated recommendations
- **Investment Cards** show individual fund details
- **Diversification & Risk Scores** indicate portfolio health

### Updating NAVs

- Click **"Refresh NAV"** button to manually update
- Automatic updates every 5 minutes
- Each fund shows "Last Updated" timestamp

### Detailed Fund Analysis

- Click on any fund card to view detailed page
- See NAV history over different periods (1M, 3M, 1Y, 5Y)
- View XIRR and other key metrics
- Analyze fund category and investment period

---

## API Response Examples

### Add Mutual Fund
```bash
POST /api/mutual-funds/add
{
  "fundName": "Parag Parikh Flexi Cap Fund",
  "schemeCode": "122639",
  "units": 100,
  "investedAmount": 50000,
  "purchaseDate": "2024-01-15",
  "category": "Equity",
  "fundHouse": "Parag Parikh Financial Advisory"
}

Response:
{
  "success": true,
  "message": "Mutual fund investment added successfully",
  "investment": { ... }
}
```

### Get Portfolio
```bash
GET /api/mutual-funds/portfolio

Response:
{
  "success": true,
  "investments": [...],
  "summary": {
    "totalInvested": 180000,
    "totalCurrentValue": 225420,
    "totalProfitLoss": 45420,
    "totalReturnPercentage": 25.23
  },
  "allocation": {
    "Equity": { "value": 150000, "percentage": "65.5" },
    "Gold": { "value": 75420, "percentage": "34.5" }
  },
  "diversificationScore": 85,
  "riskScore": 62,
  "insights": [...]
}
```

### Search Funds
```bash
GET /api/mutual-funds/search/funds?query=parag

Response:
{
  "success": true,
  "results": [
    {
      "schemeCode": "122639",
      "schemeName": "Parag Parikh Flexi Cap Fund",
      "fundHouse": "Parag Parikh Financial Advisory"
    }
  ]
}
```

---

## Real-time Features

### NAV Polling
- Automatic update interval: 5 minutes
- Manual refresh available
- Last updated timestamp on each card

### Historical Data
- Stores last 365 days of NAV history
- Used for charting and performance analysis
- Automatically pruned to prevent data bloat

### Live Calculations
- Portfolio value updates in real-time
- Profit/Loss recalculated on NAV change
- Charts update smoothly with animations

---

## Performance Optimizations

1. **Caching** - NAV data cached for 5 minutes
2. **Batch Updates** - Update multiple funds simultaneously
3. **Lazy Loading** - Charts load on demand
4. **Indexed Queries** - Database queries optimized with indexes
5. **Pagination** - Portfolio pagination support

---

## Bonus Features Implemented

✅ **Diversification Score** (0-100)
- Based on category distribution
- Helps identify over-concentration

✅ **Risk Analysis**
- Individual fund risk levels
- Portfolio risk score
- Risk-based recommendations

✅ **XIRR Calculation**
- Annualized return calculation
- Better than simple IRR for irregular investments

✅ **Asset Allocation**
- Visual donut chart
- Category breakdown
- Value and percentage display

✅ **AI Insights**
- Best performing fund
- Underperforming fund alerts
- Diversification recommendations
- Monthly return trends

✅ **Fund Comparison**
- Compare multiple funds simultaneously
- Side-by-side metrics

✅ **Historical Analytics**
- 1 Month, 3 Month, 1 Year, 5 Year views
- Smooth gradient charts
- Performance tracking

---

## MFAPI Integration

### Endpoints Used
- **Latest NAV**: `GET https://api.mfapi.in/mf/{schemeCode}/latest`
- **Historical Data**: `GET https://api.mfapi.in/mf/{schemeCode}`
- **Search Funds**: `GET https://api.mfapi.in/mf/search?q={query}`

### Sample Scheme Codes
- Parag Parikh Flexi Cap: 122639
- HDFC Mid-Cap Opportunities: 119695
- Axis Long Term Equity: 120506
- ICICI Prudential Balanced: 120599
- ABSL Gold Fund: 109044

---

## Troubleshooting

### NAV Data Not Updating
1. Check internet connection
2. Verify MFAPI is accessible
3. Ensure scheme code is correct
4. Check browser console for errors

### Portfolio Values Not Calculating
1. Clear browser cache
2. Refresh the page
3. Verify all fund fields are filled
4. Check MongoDB connection

### Charts Not Displaying
1. Ensure historical data exists (wait 5 minutes for updates)
2. Check browser console for errors
3. Verify Recharts library is loaded

---

## Future Enhancements

- [ ] SIP Tracker with goal-based investing
- [ ] Portfolio rebalancing recommendations
- [ ] Tax-loss harvesting alerts
- [ ] Correlation analysis between funds
- [ ] Machine learning-based fund recommendations
- [ ] Expense ratio tracking
- [ ] Benchmark comparison (Nifty, Sensex, etc.)
- [ ] Export portfolio to PDF
- [ ] Email alerts for market movements
- [ ] Integration with portfolio trackers (Kuvera, ETMoney data)

---

## Support & Resources

- **MFAPI Documentation**: https://mfapi.in/
- **Recharts Docs**: https://recharts.org/
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/

---

## License

This implementation is part of the MoneyPilot Finance Dashboard project.

---

**Last Updated**: May 29, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
