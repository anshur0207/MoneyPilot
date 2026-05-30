# Mutual Funds - Seeded Data Summary

## Overview
✅ **6 Mutual Fund Investments** seeded with all scheme details and NAV information
✅ **6 Mutual Fund Master Records** with detailed fund information
✅ **9 Total Investments** in the demo user portfolio

---

## Scheme Numbers & Mutual Fund Investments

### 1. **Tata Nifty 50 Index Direct**
- **Scheme Code**: `101054`
- **Fund House**: Tata Asset Management
- **Category**: Equity
- **Risk Level**: Moderate
- **Current NAV**: ₹362
- **Units Held**: 125
- **Current Value**: ₹45,250
- **Invested Amount**: ₹50,000
- **Returns 1Y**: 15.2%
- **Returns 3Y**: 18.5%
- **Expense Ratio**: 0.20%

### 2. **Nippon India Small Cap Fund Direct**
- **Scheme Code**: `119599`
- **Fund House**: Nippon Life India Asset Management
- **Category**: Equity
- **Risk Level**: High
- **Current NAV**: ₹68.92
- **Units Held**: 500
- **Current Value**: ₹34,460
- **Invested Amount**: ₹60,000
- **Returns 1Y**: 22.3%
- **Returns 3Y**: 28.5%
- **Expense Ratio**: 0.75%

### 3. **Quant Mid Cap Fund Direct**
- **Scheme Code**: `108513`
- **Fund House**: Quant Capital
- **Category**: Equity
- **Risk Level**: High
- **Current NAV**: ₹30.33
- **Units Held**: 1,000
- **Current Value**: ₹30,330
- **Invested Amount**: ₹45,000
- **Returns 1Y**: 18.9%
- **Returns 3Y**: 24.3%
- **Expense Ratio**: 0.65%

### 4. **Mirae Asset Liquid Fund**
- **Scheme Code**: `101462`
- **Fund House**: Mirae Asset Global Investments
- **Category**: Liquid
- **Risk Level**: Low
- **Current NAV**: ₹1,000.401
- **Units Held**: 9,950
- **Current Value**: ₹10,040
- **Invested Amount**: ₹100,000
- **Returns 1Y**: 5.2%
- **Returns 3Y**: 5.1%
- **Expense Ratio**: 0.25%

### 5. **Quant ELSS Tax Saver Fund**
- **Scheme Code**: `110555`
- **Fund House**: Quant Capital
- **Category**: ELSS (Equity Linked Saving Scheme)
- **Risk Level**: Moderate
- **Current NAV**: ₹22.45
- **Units Held**: 1,500
- **Current Value**: ₹33,670
- **Invested Amount**: ₹50,000
- **Returns 1Y**: 16.8%
- **Returns 3Y**: 22.5%
- **Expense Ratio**: 0.55%

### 6. **Edelweiss Gold ETF**
- **Scheme Code**: `100031`
- **Fund House**: Edelweiss Asset Management
- **Category**: Gold
- **Risk Level**: Moderate
- **Current NAV**: ₹782.40
- **Units Held**: 25
- **Current Value**: ₹19,560
- **Invested Amount**: ₹50,000
- **Returns 1Y**: 9.5%
- **Returns 3Y**: 8.2%
- **Expense Ratio**: 0.35%

---

## Portfolio Summary

| Metric | Value |
|--------|-------|
| **Total Invested** | ₹405,000 |
| **Current Portfolio Value** | ₹173,310 |
| **Total Gain/Loss** | -₹231,690 |
| **Total Units Held** | 14,075 |
| **Number of Funds** | 6 |

---

## Database Collections

### investments Collection
- 9 total investment documents
- 6 mutual fund investments (isMutualFund: true)
- 3 regular investments (SIP, FD, Stocks)

### mutualfunds Collection
- 6 mutual fund master records
- Each with schemeCode (unique), currentNAV, historical returns, expense ratio
- Categories: Equity, Liquid, ELSS, Gold

---

## How to View on Mutual Funds Page

1. **Login** with demo credentials:
   - Email: `demo@example.com`
   - Password: `demo123`

2. **Navigate** to "Mutual Funds" page

3. **View Your Portfolio**:
   - All 6 mutual fund investments will be displayed
   - Shows current value, gains/losses
   - Portfolio charts and insights
   - Individual fund cards with scheme details

---

## API Endpoints

### Get Mutual Fund Portfolio
```
GET /api/mutual-funds/portfolio
```
Returns all mutual fund investments for the logged-in user with scheme details.

### Get Fund Details by Scheme Code
```
GET /api/mutual-funds/fund-details/:schemeCode
```
Example: `/api/mutual-funds/fund-details/101054`

### Search Mutual Funds
```
GET /api/mutual-funds/search/funds?query=nifty
```

---

## Database Structure

### Investment Document (Mutual Fund)
```json
{
  "userId": "ObjectId",
  "type": "Mutual Fund",
  "name": "Fund Name",
  "isMutualFund": true,
  "schemeCode": "101054",
  "investedAmount": 50000,
  "currentValue": 45250,
  "units": 125,
  "purchaseNAV": 400,
  "currentNAV": 362,
  "fundHouse": "Fund House Name",
  "category": "Equity",
  "riskLevel": "Medium",
  "startDate": "2025-03-15T00:00:00Z",
  "lastUpdated": "2026-05-30T00:00:00Z"
}
```

### MutualFund Document (Master)
```json
{
  "schemeCode": "101054",
  "schemeName": "Tata Nifty 50 Index Direct",
  "category": "Equity",
  "fundHouse": "Tata Asset Management",
  "currentNAV": 362,
  "previousNAV": 365,
  "returns1Y": 15.2,
  "returns3Y": 18.5,
  "returns5Y": 14.8,
  "expense_ratio": 0.2,
  "riskRating": "Moderate"
}
```

---

## Seeding Scripts

### seedDemoData.js
Seeds demo user with investments including mutual funds with full details.

### seedActualMutualFunds.js
Seeds the mutual fund master collection with scheme details, NAV, and historical returns.

---

**Date Created**: 30 May 2026
**Status**: ✅ All data seeded and verified in MongoDB
