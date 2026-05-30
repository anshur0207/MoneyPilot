# Mutual Fund Investment System - Quick Start

## 🚀 What's Ready

A **complete, production-ready Mutual Fund Tracking System** for MoneyPilot with:
- ✅ Live mutual fund NAV updates from MFAPI
- ✅ Real-time portfolio calculations & analytics
- ✅ Premium fintech dashboard UI
- ✅ 10 advanced portfolio metrics
- ✅ Historical performance charts
- ✅ AI-powered insights
- ✅ Fund search & comparison
- ✅ Mobile-responsive design

---

## 🔧 Getting Started

### 1. Start the Backend
```bash
cd backend
npm run dev
```
Backend runs on: **http://localhost:5001**

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:3000**

### 3. Seed Demo Data (Optional)
```bash
cd backend
npm run seed:mf
```
This adds 5 sample mutual funds to your account.

---

## 📊 How to Use

### Access the Mutual Funds Dashboard
1. Login to MoneyPilot
2. Click **Funds** (💹) in the navigation bar
3. You'll see the portfolio dashboard

### Add a Mutual Fund
1. Click **"Add Fund"** button
2. Search for fund name (e.g., "Parag Parikh")
3. Select from results
4. Enter units, invested amount, and date
5. Click **"Add Fund"**

### View Your Portfolio
- **Portfolio Summary**: Total value, invested amount, profit/loss
- **Asset Allocation**: See distribution across categories
- **Charts**: View historical performance
- **Insights**: AI-generated recommendations
- **Risk Score**: Portfolio risk assessment
- **Diversification Score**: How well-distributed your portfolio is

### Monitor Live Updates
- Click **"Refresh NAV"** to manually update
- Automatic updates every 5 minutes
- See last updated timestamp on each fund

### View Fund Details
- Click any fund card
- See detailed NAV history
- View charts for different periods (1M, 3M, 1Y, 5Y)
- Check XIRR and other metrics

---

## 📁 File Structure

```
backend/
├── services/
│   ├── mfService.js              ← MFAPI integration
│   └── portfolioService.js        ← Calculations
├── controllers/
│   └── mutualFundController.js    ← API logic
├── routes/
│   └── mutualFundRoutes.js        ← Endpoints
├── scripts/
│   └── seedMutualFunds.js         ← Demo data
└── models/
    └── Investment.js              ← Updated schema

frontend/
├── pages/
│   ├── MutualFundsPage.tsx        ← Dashboard
│   └── MutualFundDetailsPage.tsx  ← Details view
├── components/
│   └── MutualFunds/
│       ├── PortfolioSummary.tsx
│       ├── MutualFundCard.tsx
│       ├── FundSearchModal.tsx
│       ├── PortfolioCharts.tsx
│       └── InsightsSection.tsx
└── App.tsx                         ← Routes updated
```

---

## 🔌 API Endpoints

All endpoints are authenticated and require JWT token.

```
POST   /api/mutual-funds/add                     Add fund
GET    /api/mutual-funds/portfolio               Get portfolio
GET    /api/mutual-funds/:id                     Get fund details
PUT    /api/mutual-funds/update/:id              Update fund
DELETE /api/mutual-funds/:id                     Delete fund
GET    /api/mutual-funds/search/funds?q=         Search funds
POST   /api/mutual-funds/update-all-navs         Update all NAVs
POST   /api/mutual-funds/compare                 Compare funds
```

---

## 📈 Calculations

### Key Formulas Used

**Current Value**
```
= Units × Current NAV
```

**Profit/Loss**
```
= Current Value - Invested Amount
```

**Return %**
```
= (Profit/Loss / Invested Amount) × 100
```

**XIRR (Annualized)**
```
= (Current Value / Invested Amount)^(1/Years) - 1
```

---

## 💡 Portfolio Insights

The system generates insights like:
- "Parag Parikh Flexi Cap is your best performing fund with 32.5% returns"
- "Your portfolio is well-diversified across 5 asset classes"
- "Portfolio gained 4.2% this month"
- "Consider rebalancing: Equity is 75% of portfolio"

---

## 🎨 UI Features

- **Dark Theme** with purple-blue gradients
- **Glassmorphism** cards with blur effects
- **Smooth Animations** with Framer Motion
- **Responsive Grid** that adapts to all screen sizes
- **Interactive Charts** with Recharts
- **Real-time Updates** with visual feedback

---

## 🔍 Sample Funds to Test

Try adding these mutual funds to test:

1. **Parag Parikh Flexi Cap Fund**
   - Code: 122639

2. **HDFC Mid-Cap Opportunities Fund**
   - Code: 119695

3. **Axis Long Term Equity Fund**
   - Code: 120506

4. **ICICI Prudential Balanced Advantage Fund**
   - Code: 120599

5. **ABSL Gold Fund**
   - Code: 109044

---

## 🚨 Troubleshooting

**NAV data not showing?**
- Check internet connection
- Verify scheme code is correct
- Wait 5 minutes for cache refresh

**Charts not displaying?**
- Ensure fund has historical data (wait 5 min)
- Clear browser cache
- Check browser console

**API errors?**
- Check backend is running on :5001
- Verify JWT token is valid
- Check MongoDB is connected

---

## 📚 Full Documentation

See [MUTUAL_FUNDS_GUIDE.md](../MUTUAL_FUNDS_GUIDE.md) for:
- Complete feature list
- Detailed API documentation
- Database schema
- Performance optimizations
- Future enhancements
- Troubleshooting guide

---

## 🎯 Next Steps

1. ✅ Test adding a mutual fund
2. ✅ Check portfolio summary
3. ✅ View historical charts
4. ✅ Generate insights
5. ✅ Monitor live NAV updates

---

## 📞 Support

For issues or questions:
1. Check [MUTUAL_FUNDS_GUIDE.md](../MUTUAL_FUNDS_GUIDE.md)
2. Review browser console for errors
3. Check MongoDB connection
4. Verify MFAPI is accessible

---

**Built with ❤️ for MoneyPilot**
**Status: Ready for Production** ✅
