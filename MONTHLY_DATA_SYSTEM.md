# Monthly Data System - Implementation Guide

## Overview
The MoneyPilot app now supports a comprehensive monthly-based data system that allows users to:
- View financial data for any specific month
- Track expenses and performance month-over-month
- Get fresh monthly resets without carryover from previous months
- Compare financial health across different time periods

## Key Features

### 1. Monthly Data Filtering
All financial queries now support month/year parameters:
- Dashboard summary
- Health score calculation
- Expense reports
- Investment tracking

### 2. Month Selector Component
New `MonthSelector.tsx` component provides:
- Easy month/year selection
- Navigation between months
- "This Month" quick button
- Dropdown interface with calendar view

### 3. API Endpoints with Monthly Support

#### Dashboard Summary Endpoint
```
GET /api/dashboard/summary?month=0&year=2026
```

**Query Parameters:**
- `month` (0-11): 0 = January, 11 = December (optional, defaults to current)
- `year` (YYYY): Full year (optional, defaults to current year)

**Response Includes:**
```json
{
  "currentMonth": 0,
  "currentYear": 2026,
  "monthString": "January 2026",
  "summary": { ... },
  "metrics": { ... }
}
```

#### Health Score Endpoint
```
GET /api/dashboard/health-score?month=0&year=2026
```

Returns health score data for the specific month, with all metrics calculated for that period.

### 4. Data Isolation

Each month's data is completely isolated:
- **Current Month Expenses**: Only expenses from the selected month
- **Previous Month Expenses**: Automatically calculated for comparison
- **Monthly Income/EMI**: Calculated based on regular patterns
- **Fresh Start**: Switching months gives you a clean state

### 5. Frontend Components

#### MonthSelector Component
```tsx
import MonthSelector from '../components/MonthSelector'

<MonthSelector 
  month={month} 
  year={year} 
  onMonthChange={handleMonthChange}
/>
```

#### DashboardPage Updates
- Added month selector to header
- Displays current month string
- Updates all metrics when month changes
- Maintains smooth UX

#### HealthScorePage Updates
- Month selector integration
- Month-specific health score calculation
- Historical month comparison support

## How It Works

### Monthly Reset Process
1. **User Selects Month**: Uses MonthSelector dropdown
2. **API Query Updated**: Month/year parameters sent to backend
3. **Data Filtered**: Backend filters expenses by selected month
4. **Fresh Calculation**: Health score and metrics recalculated for that month
5. **UI Updates**: All components update with new data

### Data Lifecycle
```
┌─────────────────────────────────────────────────────┐
│                  User Selects Month                  │
│                   (e.g., May 2026)                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│            API Receives Month/Year Params            │
│         /api/dashboard/summary?month=4&year=2026    │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│      Backend Filters Data for Selected Month         │
│  - May 2026 expenses only                            │
│  - May 2026 health score calculated                  │
│  - Compared with April 2026                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│        Response with Month-Specific Data             │
│  - monthString: "May 2026"                           │
│  - currentMonthExpenses: [filtered]                  │
│  - previousMonthExpenses: [April data]               │
│  - healthScore: [recalculated]                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│           Frontend Updates All Components            │
│  - Dashboard shows May 2026 data                     │
│  - Health score reflects May metrics                 │
│  - Month selector shows "May 2026"                   │
└─────────────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: View May 2026 Health Score
```
1. Navigate to /health-score
2. Click "May 2026" in month selector
3. See health score for that specific month
4. Compare with April for month-over-month analysis
```

### Example 2: Check Dashboard for Previous Month
```
1. Navigate to /dashboard
2. Use month selector to choose previous month
3. See all expenses and metrics for that month
4. Analyze spending patterns by month
```

### Example 3: Year-End Review
```
1. Use month selector to navigate to December of previous year
2. Review health score and expenses for that month
3. Compare with current month for year-end analysis
```

## Scoring Recalculation

When month changes, the health score is recalculated based on:

### Current Month Data
- Expenses from selected month only
- Monthly income (from user profile)
- Monthly EMI (based on loans)
- Investment contributions

### Comparison Data
- Previous month expenses (for trend analysis)
- Historical patterns

### Key Metrics Recalculated
```
Savings Ratio = Monthly Investment / Monthly Income × 100
Debt Ratio = Monthly EMI / Monthly Income × 100
Emergency Fund = Emergency Savings / Monthly Expenses
Expense Control = Based on current month spending
```

## Implementation Details

### Backend Changes

#### Dashboard Controller
```javascript
// Query parameters
const { month, year } = req.query
const now = new Date()
month = month ? parseInt(month) : now.getMonth()
year = year ? parseInt(year) : now.getFullYear()

// Filter expenses for selected month
const monthlyExpenses = expenses.filter((e) => {
  const eDate = new Date(e.date)
  return eDate.getMonth() === month && eDate.getFullYear() === year
})
```

#### Health Score Service
```javascript
export const calculateFinancialHealthScore = (
  user,
  expenses,
  investments,
  loans,
  goals,
  targetMonth = null,
  targetYear = null
) => {
  // Uses provided month/year or current
  const month = targetMonth !== null ? targetMonth : now.getMonth()
  const year = targetYear !== null ? targetYear : now.getFullYear()
  // ... rest of calculation
}
```

### Frontend Changes

#### DashboardPage State
```typescript
const now = new Date()
const [month, setMonth] = useState(now.getMonth())
const [year, setYear] = useState(now.getFullYear())

// API call with month/year
const { data, loading, error } = useFetch<DashboardResponse>(
  `/api/dashboard/summary?month=${month}&year=${year}`
)
```

## Data Consistency

### Monthly Isolation Ensures:
1. **No Carryover**: Previous month data doesn't affect current month display
2. **Fresh State**: Each month starts clean
3. **Accurate Trends**: Month-to-month comparisons are reliable
4. **User Control**: Users can review any historical month

### Data Stored Per Record:
- Each expense has a `date` field (stored with month/year)
- Each investment has a `startDate` and optional `maturityDate`
- Each loan has payment history
- All calculations are dynamic based on selected period

## Best Practices

### For Users
1. **Add Expenses with Correct Dates**: Use actual transaction dates
2. **Review Monthly**: Check health score at month-end
3. **Compare Trends**: Use month selector to identify patterns
4. **Track Improvements**: Monitor score progression across months

### For Developers
1. **Always Use Month Parameters**: Pass month/year to relevant endpoints
2. **Handle Current Month**: Default to current if not specified
3. **Validate Dates**: Ensure stored dates are accurate
4. **Document Month Usage**: Clearly indicate endpoints support monthly filtering

## Future Enhancements

### Possible Improvements
1. **Monthly Archives**: Save detailed monthly snapshots
2. **Year-over-Year**: Compare same month different years
3. **Trend Analysis**: Automatic trend detection across months
4. **Monthly Reports**: Generate downloadable monthly PDF reports
5. **Forecasting**: Predict future months based on trends
6. **Notifications**: Alert for significant month-to-month changes

## Troubleshooting

### Issue: Data from previous month showing
**Solution**: Ensure expense date field is set correctly. Dates determine filtering.

### Issue: Health score not updating on month change
**Solution**: Verify month/year parameters are being sent to API. Check network tab for correct query strings.

### Issue: Missing data for certain months
**Solution**: Add expenses/investments with proper dates for those months. System only shows data that exists.

## API Reference

### Dashboard Summary
```
GET /api/dashboard/summary
Query Parameters:
  - month: 0-11 (optional)
  - year: YYYY (optional)

Response:
{
  "currentMonth": 0,
  "currentYear": 2026,
  "monthString": "January 2026",
  "summary": { ... },
  "metrics": { ... }
}
```

### Health Score
```
GET /api/dashboard/health-score
Query Parameters:
  - month: 0-11 (optional)
  - year: YYYY (optional)

Response:
{
  "score": 82,
  "month": 0,
  "year": 2026,
  "monthString": "January 2026",
  "scoreBreakdown": { ... },
  "metrics": { ... },
  "strengths": [ ... ],
  "improvements": [ ... ],
  "insights": [ ... ]
}
```

---
**Last Updated:** May 29, 2026
**Version:** 1.0
