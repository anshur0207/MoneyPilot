# 🚀 Getting Started Guide

## ✅ What's Already Done

Your entire financial dashboard project has been scaffolded with:
- ✅ Complete frontend structure (React + Vite + Tailwind)
- ✅ Complete backend structure (Express + MongoDB)
- ✅ All dependencies installed via npm
- ✅ Environment files ready for configuration
- ✅ 5 database models designed
- ✅ 7 API route groups with controllers
- ✅ 7 frontend pages with components

**You're 80% done with setup! Now let's get it running.** 🎉

---

## 🎯 Step-by-Step Setup (15 minutes)

### Step 1: Configure MongoDB (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new cluster (Free tier is fine)
4. Click "Connect"
5. Create a database user (save username & password)
6. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
7. Copy the connection string and open `backend/.env`
8. Replace the `MONGODB_URI` value with your connection string

**backend/.env:**
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/moneypilot?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-key-12345
```

### Step 2: Configure Frontend (2 minutes)

Open `frontend/.env.local` and update:
```
REACT_APP_API_URL=http://localhost:5000
```

(No changes needed for local development)

### Step 3: Start the Servers (3 minutes)

Open a terminal in the project root:

```bash
npm run dev
```

You'll see:
```
Frontend running at: http://localhost:3000 ✅
Backend running at: http://localhost:5000 ✅
```

### Step 4: Test the App (5 minutes)

1. **Frontend**: Open http://localhost:3000 in your browser
2. **Login Page**: You should see the login screen
3. **Demo Credentials**: (These are example, you'll need to create real ones)
   - Email: demo@example.com
   - Password: demo123

4. **Backend Health Check**: http://localhost:5000/health
   - Should show: `{"status":"OK","message":"MoneyPilot API is running"}`

---

## 📱 Mobile Responsiveness

The app is designed mobile-first! Open DevTools (F12) and:
- Rotate to portrait
- Click mobile device icon (iPhone/Android)
- Test bottom navigation and layout

---

## 🛠️ Making Your First Change

### Add a New Expense Category

1. **Backend**: Edit `backend/models/Expense.js`
   - Find the category enum
   - Add your new category to the list

2. **Frontend**: Edit `frontend/src/pages/ExpensesPage.tsx`
   - Replace placeholder with real form
   - Use the new category

3. **Test**: Restart servers and try adding expense

---

## 🔍 Useful Developer Tools

### For Frontend
- Install **React Developer Tools** browser extension
- Open DevTools (F12) and go to Components tab
- See component structure and state in real-time

### For Backend
- Install **Postman** or **Thunder Client** (VS Code extension)
- Test API endpoints:
  ```
  POST http://localhost:5000/api/auth/register
  Body: { "name": "Test", "email": "test@example.com", "password": "test123" }
  ```

### For Database
- Install **MongoDB Compass** (free)
- Connect to your MongoDB Atlas cluster
- View collections and data visually

---

## 📋 Folder Structure Quick Reference

```
frontend/src/
  ├── pages/           ← Add new screens here
  ├── components/      ← Reusable UI pieces
  ├── hooks/           ← Data fetching logic
  ├── context/         ← Global state (auth)
  └── utils/           ← Helpers and API client

backend/
  ├── routes/          ← API endpoints (define what URLs exist)
  ├── controllers/     ← Business logic (what happens for each route)
  ├── models/          ← Database schemas (how data is structured)
  ├── middleware/      ← Auth and error handling
  ├── config/          ← Database connection
  └── utils/           ← Helper functions
```

---

## 🔄 Development Workflow

### Adding Dashboard Data

1. **Check Dashboard Controller** - `backend/controllers/dashboardController.js`
   - Already calculates net worth, health score, etc.
   - Just needs real data from frontend

2. **Check Dashboard Page** - `frontend/src/pages/DashboardPage.tsx`
   - Has placeholder data
   - Replace with API call: `const { data } = useFetch('/api/dashboard/summary')`

3. **Test Everything**
   - Restart servers
   - See data flow from backend to frontend

---

## 🐛 Troubleshooting

### "Cannot find module" errors
- Make sure both servers are running
- Check all imports have `.js` extension

### API calls not working
- Check `REACT_APP_API_URL` in `frontend/.env.local`
- Check `MONGODB_URI` in `backend/.env`
- Verify MongoDB connection in terminal

### Port already in use
```bash
# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Not authorized" on MongoDB
- Check IP whitelist in MongoDB Atlas
- Go to Network Access → Add IP Address → Add Current IP
- Or allow access from anywhere (less secure)

---

## 🎨 Customizing the UI

### Change Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  'primary': '#1a1a1a',      ← Background
  'accent': '#00d4ff',       ← Highlights
  'success': '#10b981',      ← Green
}
```

### Change Font
Edit `frontend/tailwind.config.js`:
```js
fontFamily: {
  'sans': ['Poppins', 'sans-serif'],  ← Change font here
}
```

### Add Animation
Use Framer Motion in components:
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  whileHover={{ scale: 1.05 }}
>
  Content
</motion.div>
```

---

## 📚 Next Features to Build

### Easy First Features
- [ ] Fix placeholder pages (Expenses, Investments, etc.)
- [ ] Add real form validation
- [ ] Implement category filtering
- [ ] Add delete/edit functionality
- [ ] Create charts using Recharts

### Medium Features
- [ ] AI spending insights
- [ ] Monthly report generation
- [ ] Goal progress tracking
- [ ] Notification system
- [ ] Dark mode toggle

### Advanced Features
- [ ] SMS transaction parsing
- [ ] UPI integration
- [ ] Investment recommendations
- [ ] Budget forecasting
- [ ] Mobile app (React Native)

---

## 🚀 Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Vercel auto-deploys on push

### Backend (Render)
1. Push code to GitHub
2. Go to render.com
3. New Web Service → GitHub repo
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)
- Already cloud-hosted
- Just get connection string

---

## 💡 Pro Tips

1. **Commit Frequently**
   ```bash
   git add .
   git commit -m "Add expense tracking feature"
   git push
   ```

2. **Use Meaningful Branch Names**
   ```bash
   git checkout -b feature/expense-tracker
   git checkout -b fix/login-bug
   ```

3. **Keep Dependencies Updated**
   ```bash
   npm outdated
   npm update
   ```

4. **Test API Before Building UI**
   - Use Postman first
   - Make sure API works
   - Then build components

5. **Read Code Comments**
   - Code has inline explanations
   - Models show all fields
   - Controllers show all logic

---

## 📞 Quick Help

### Port 3000 (Frontend) won't start
- Check `vite.config.ts` for port configuration
- Try: `npm run dev:frontend -- --port 3001`

### Port 5000 (Backend) won't start
- Check if MongoDB is connected
- Check `.env` file for `MONGODB_URI`

### Want to change ports?
**Frontend**: `frontend/vite.config.ts`
**Backend**: `backend/.env` (PORT=5000)

---

## 🎯 Success Checklist

After setup, you should be able to:

- [ ] See frontend at http://localhost:3000
- [ ] See backend health at http://localhost:5000/health
- [ ] Browse all 7 pages (Home, Expenses, Investments, etc.)
- [ ] See the beautiful dark-themed UI
- [ ] Test API with Postman

**If all ✅, you're ready to build!**

---

## 🎉 You're Ready!

Your financial dashboard is ready for development. The structure is perfect, the technologies are modern, and the foundation is solid.

**Next Step**: Pick one feature and start building. The dashboard page is the most important - connect it to real data first!

---

**Happy coding! Build something amazing! 🚀**

---

**Need help?** Refer to:
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Architecture & components
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed technical guide
- [README.md](./README.md) - Project documentation
