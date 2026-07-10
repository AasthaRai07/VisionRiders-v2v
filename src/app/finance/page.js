'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState, useRef } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  BarChart, 
  Bar 
} from 'recharts';

export default function FinanceHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Dashboard & Goals states
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: 'Higher Education', targetAmount: 200000, deadline: '2028-12-31', currentSavings: 15000, monthlyContribution: 5000 });
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(5000);
  
  // Expenses states
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  
  // AI Copilot states
  const [copilotMessages, setCopilotMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I am your HerNova Financial Copilot. Ask me anything about budgeting, saving strategies, or how to reach your investment goals." }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotTyping, setCopilotTyping] = useState(false);
  
  // AI Advisor states
  const [advisorForm, setAdvisorForm] = useState({ income: 50000, savings: 10000, riskAppetite: 'Moderate', timeHorizon: 5 });
  const [advisorRecommendation, setAdvisorRecommendation] = useState(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // SIP Simulator states
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  
  // Virtual Portfolio states
  const [virtualBalance, setVirtualBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState([
    { id: 'stock_hdfc', name: 'HDFC Bank (Stock)', qty: 5, avgPrice: 1550, currentPrice: 1580, type: 'Stock' },
    { id: 'mf_nifty', name: 'Nifty Index Fund (MF)', qty: 10, avgPrice: 220, currentPrice: 235, type: 'Mutual Fund' }
  ]);
  const [selectedAssetToBuy, setSelectedAssetToBuy] = useState('stock_hdfc');
  const [tradeQty, setTradeQty] = useState(1);
  const [assetsCatalog] = useState([
    { id: 'stock_hdfc', name: 'HDFC Bank (Stock)', price: 1580, type: 'Stock' },
    { id: 'stock_tcs', name: 'TCS (Stock)', price: 3420, type: 'Stock' },
    { id: 'mf_nifty', name: 'Nifty Index Fund (MF)', price: 235, type: 'Mutual Fund' },
    { id: 'mf_midcap', name: 'MidCap Opportunities (MF)', price: 110, type: 'Mutual Fund' },
    { id: 'gold_etf', name: 'Gold ETF', price: 6200, type: 'Gold' }
  ]);

  // Government Scheme Finder states
  const [schemeForm, setSchemeForm] = useState({ age: 24, state: 'Maharashtra', occupation: 'Entrepreneur', annualIncome: 300000, shgMember: false });
  const [schemes, setSchemes] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState([]);

  // Safety Center & Emergency Mode states
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  // Statement parser states
  const [statementText, setStatementText] = useState('');
  const [parseResults, setParseResults] = useState(null);
  const [parsing, setParsing] = useState(false);

  // Achievements/Gamification
  const [badges, setBadges] = useState(['Financial Beginner']);

  // Fetch Dashboard on Mount
  useEffect(() => {
    fetchDashboard();
    fetchBookmarks();
    fetchAchievements();
    
    // Setup background particles
    const container = document.getElementById('finance-particles');
    if (!container) return;
    container.innerHTML = '';
    const count = 15;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'absolute bg-white/20 rounded-full pointer-events-none';
      const size = Math.random() * 6 + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 100}vh`;
      p.style.animation = `floatBg ${Math.random() * 15 + 15}s linear infinite`;
      container.appendChild(p);
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/dashboard');
      const data = await res.json();
      setDashboardData(data.profile);
      setGoals(data.goals);
      setExpenses(data.expenses);
    } catch (err) {
      console.error("Dashboard load failed, loading fallback data", err);
      // Mock Fallbacks
      setDashboardData({
        finherScore: 75,
        emergencyFundBalance: 65400,
        emergencyFundTarget: 100000,
        monthlySavingsRate: 20,
        netWorth: 120400,
        savingsConsistency: 85,
        investmentReadiness: 78,
        upcomingBills: [
          { id: 'b1', name: 'LIC Insurance Premium', amount: 3200, dueDate: '2026-07-16', status: 'Pending' },
          { id: 'b2', name: 'Broadband/WiFi Bill', amount: 899, dueDate: '2026-07-21', status: 'Pending' }
        ],
        spendingTrends: [
          { month: 'Jan', savings: 4500, expenses: 18000, investments: 2000 },
          { month: 'Feb', savings: 5000, expenses: 17500, investments: 2500 },
          { month: 'Mar', savings: 6000, expenses: 16000, investments: 3000 },
          { month: 'Apr', savings: 5200, expenses: 19000, investments: 3200 },
          { month: 'May', savings: 6500, expenses: 15500, investments: 4000 },
          { month: 'Jun', savings: 7200, expenses: 15000, investments: 5000 }
        ],
        expenseBreakdown: [
          { name: 'Rent', value: 12000, color: '#C2185B' },
          { name: 'Food/Groceries', value: 6500, color: '#E91E63' },
          { name: 'Travel', value: 2500, color: '#FFB300' },
          { name: 'Bills & Utilities', value: 4100, color: '#9C27B0' },
          { name: 'Shopping & Leisure', value: 4900, color: '#00BCD4' }
        ]
      });
      setGoals([
        { id: 'g1', title: 'Emergency Fund', targetAmount: 100000, currentSavings: 65400, monthlyContribution: 3000, estCompletionDate: '2027-06-15', probability: 'High' },
        { id: 'g2', title: 'Startup Capital', targetAmount: 500000, currentSavings: 20000, monthlyContribution: 10000, estCompletionDate: '2030-02-01', probability: 'Medium' }
      ]);
      setExpenses([
        { id: 'e1', title: 'Grocery Shopping', amount: 1500, category: 'Food', date: '2026-07-09' },
        { id: 'e2', title: 'Apartment Rent', amount: 12000, category: 'Rent', date: '2026-07-01' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/schemes/bookmark');
      const data = await res.json();
      setBookmarkedSchemes(data.bookmarks || []);
    } catch (_) {}
  };

  const fetchAchievements = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/achievements');
      const data = await res.json();
      if (data.badges) setBadges(data.badges);
    } catch (_) {}
  };

  // Add a new Goal
  const handleSaveGoal = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      if (res.ok) {
        setGoalModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Contribute savings to goal
  const handleGoalContribution = async () => {
    if (!selectedGoalForContribution) return;
    try {
      const res = await fetch(`http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/goals/${selectedGoalForContribution.id}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: contributionAmount })
      });
      if (res.ok) {
        setSelectedGoalForContribution(null);
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a Goal
  const handleDeleteGoal = async (goalId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/goals/${goalId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add manual expense
  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return;
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });
      if (res.ok) {
        setNewExpense({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Copilot Query
  const handleSendCopilot = async () => {
    if (!copilotInput.trim() || copilotTyping) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: copilotInput.trim() };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotInput('');
    setCopilotTyping(true);

    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: userMsg.text })
      });
      const data = await res.json();
      setCopilotMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.reply }]);
    } catch (err) {
      setCopilotMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "I ran into a connection issue, but let's practice your budgeting and wealth planning again soon!" }]);
    } finally {
      setCopilotTyping(false);
    }
  };

  // Download Financial PDF Report
  const handleDownloadReport = async () => {
    try {
      setCopilotTyping(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReportRequest: true })
      });
      const data = await res.json();
      
      // Simple dynamic print helper for report
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(`
        <html>
          <head>
            <title>HerNova AI Financial Report</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: inherit; }
              h1, h2, h3 { color: #C2185B; }
              button { background: #FFB300; border: none; padding: 10px 20px; font-weight: bold; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
              @media print { button { display: none; } }
            </style>
          </head>
          <body>
            <button onclick="window.print()">Print / Export PDF</button>
            <pre>${data.reportMarkdown}</pre>
          </body>
        </html>
      `);
      reportWindow.document.close();
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotTyping(false);
    }
  };

  // AI Investment Advisor Allocation
  const handleGetAdvisory = async () => {
    try {
      setAdvisorLoading(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/investment-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advisorForm)
      });
      const data = await res.json();
      setAdvisorRecommendation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Simulated Portfolio Trade Action
  const handlePortfolioTrade = (action) => {
    const asset = assetsCatalog.find(a => a.id === selectedAssetToBuy);
    if (!asset) return;

    const totalCost = asset.price * tradeQty;

    if (action === 'BUY') {
      if (virtualBalance < totalCost) return alert("Insufficient virtual balance!");
      setVirtualBalance(prev => prev - totalCost);
      setPortfolio(prev => {
        const existing = prev.find(item => item.id === asset.id);
        if (existing) {
          const totalQty = existing.qty + tradeQty;
          const avgPrice = Math.round(((existing.qty * existing.avgPrice) + totalCost) / totalQty);
          return prev.map(item => item.id === asset.id ? { ...item, qty: totalQty, avgPrice, currentPrice: asset.price } : item);
        } else {
          return [...prev, { id: asset.id, name: asset.name, qty: tradeQty, avgPrice: asset.price, currentPrice: asset.price, type: asset.type }];
        }
      });
    } else { // SELL
      const existing = portfolio.find(item => item.id === asset.id);
      if (!existing || existing.qty < tradeQty) return alert("You don't own enough shares/units to sell!");
      setVirtualBalance(prev => prev + (asset.price * tradeQty));
      setPortfolio(prev => {
        return prev.map(item => {
          if (item.id === asset.id) {
            const nextQty = item.qty - tradeQty;
            return { ...item, qty: nextQty };
          }
          return item;
        }).filter(item => item.qty > 0);
      });
    }
  };

  // Match Government Schemes
  const handleFindSchemes = async () => {
    try {
      setSchemesLoading(true);
      const query = new URLSearchParams(schemeForm).toString();
      const res = await fetch(`http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/schemes?${query}`);
      const data = await res.json();
      setSchemes(data.schemes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSchemesLoading(false);
    }
  };

  // Bookmark / Scheme Toggle
  const handleToggleBookmark = async (schemeId) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/schemes/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeId })
      });
      if (res.ok) {
        fetchBookmarks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit dynamic quiz answers in Learning Hub
  const handleCompleteLesson = async (moduleId, quizScore) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, isCompleted: true, quizScore })
      });
      const data = await res.json();
      if (data.badges) setBadges(data.badges);
      alert(`Lesson completed! Unlocked badges: ${data.badges.join(', ')}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload/Parse Statements
  const handleParseStatement = async () => {
    if (!statementText.trim()) return;
    try {
      setParsing(true);
      const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/finance/demo-user-123/statement-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: statementText })
      });
      const data = await res.json();
      setParseResults(data.records);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setParsing(false);
    }
  };

  // Mathematical SIP wealth calculators
  const calculateSIP = () => {
    const P = sipAmount;
    const r = sipRate / 12 / 100;
    const n = sipYears * 12;
    const expectedWealth = Math.round(P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
    const totalInvested = P * n;
    const returns = expectedWealth - totalInvested;
    
    // Generate compound line growth path data
    const chartData = [];
    for (let yr = 1; yr <= sipYears; yr++) {
      const months = yr * 12;
      const val = Math.round(P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r)));
      chartData.push({
        year: `Year ${yr}`,
        wealth: val,
        invested: P * months
      });
    }

    return { expectedWealth, totalInvested, returns, chartData };
  };

  const { expectedWealth, totalInvested, returns, chartData } = calculateSIP();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#FBEAF0] to-[#F4C0D1]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[#C2185B] text-5xl animate-spin">rotate_right</span>
          <p className="font-semibold text-primary">Loading HerNova Finance Module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatBg {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        .tab-btn-active {
          color: #C2185B;
          border-color: #C2185B;
          font-weight: bold;
        }
      `}} />
      <div id="finance-particles" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"></div>
      
      <Sidebar activeItem="finance" />
      <Header />

      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-glass-border mb-4 gap-6 text-sm font-semibold overflow-x-auto whitespace-nowrap pb-2">
          {[
            { id: 'dashboard', name: 'Dashboard 📊' },
            { id: 'copilot', name: 'AI Financial Copilot 🤖' },
            { id: 'goals', name: 'Goal Planner 🎯' },
            { id: 'simulator', name: 'SIP & Virtual Trading 📈' },
            { id: 'schemes', name: 'Govt. Schemes Finder 🏛️' },
            { id: 'learning', name: 'Learning Hub 🎓' },
            { id: 'safety', name: 'Safety & Emergency Support 🛡️' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 px-1 transition-all border-b-2 ${activeTab === t.id ? 'tab-btn-active' : 'border-transparent text-on-surface-variant'}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* Top row scores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* FinHer Score Widget */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">FinHer Score</h4>
                <p className="text-4xl font-extrabold text-[#C2185B] mt-1">{dashboardData.finherScore}/100</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${dashboardData.finherScore}%` }}></div>
                </div>
              </div>

              {/* Emergency Fund Score */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-[#FFB300]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#FFB300] text-3xl">shield_with_heart</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Emergency Fund</h4>
                <p className="text-xl font-extrabold text-on-surface mt-2">
                  ₹{dashboardData.emergencyFundBalance} / ₹{dashboardData.emergencyFundTarget}
                </p>
                <span className="text-[10px] text-success-emerald font-bold mt-1">65% Target Met</span>
              </div>

              {/* Savings Consistency */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-[#9C27B0]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#9C27B0] text-3xl">savings</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Consistency</h4>
                <p className="text-4xl font-extrabold text-[#9C27B0] mt-1">{dashboardData.savingsConsistency}%</p>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">Consistency Tracker</span>
              </div>

              {/* Investment Readiness */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-primary/10 bg-white/50">
                <div className="w-16 h-16 rounded-full bg-[#00BCD4]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#00BCD4] text-3xl">trending_up</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Investment Readiness</h4>
                <p className="text-4xl font-extrabold text-[#00BCD4] mt-1">{dashboardData.investmentReadiness}%</p>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">Advanced Profile Tier</span>
              </div>

            </div>

            {/* Charts and trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line chart showing savings trends */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Savings vs Expense Trend</h3>
                <div className="flex-1 w-full min-h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.spendingTrends}>
                      <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C2185B" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C2185B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="rgba(0,0,0,0.4)" fontSize={11}/>
                      <YAxis stroke="rgba(0,0,0,0.4)" fontSize={11}/>
                      <Tooltip />
                      <Area type="monotone" dataKey="savings" stroke="#2E7D32" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={2}/>
                      <Area type="monotone" dataKey="expenses" stroke="#C2185B" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie chart expense breakdown */}
              <div className="lg:col-span-1 glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Expense Breakdown</h3>
                <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dashboardData.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dashboardData.expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {dashboardData.expenseBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Upcoming bills */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Upcoming Due Bills</h3>
                <div className="flex flex-col gap-3">
                  {dashboardData.upcomingBills.map(bill => (
                    <div key={bill.id} className="p-4 rounded-xl border border-glass-border flex justify-between items-center bg-white/20">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{bill.name}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Due: {bill.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-sm text-[#C2185B]">₹{bill.amount}</p>
                        <button className="text-[10px] font-bold bg-[#FFB300]/20 text-[#FFB300] border border-[#FFB300]/40 px-3 py-1 rounded-full mt-2 hover:bg-[#FFB300] hover:text-[#320047] transition-all">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro insights nudges */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h3 className="font-headline-md text-sm font-bold text-on-surface mb-4">Smart Insights & Nudges</h3>
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#C2185B]">lightbulb</span>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
                      "You spent **₹2,100 more on shopping** this month compared to average. Trimming shopping by 15% would fund a SIP investment!"
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FFB300]/5 border border-[#FFB300]/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#FFB300]">campaign</span>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
                      "Reducing your dining out/Swiggy expenses by **₹1,000/month** will help you achieve your Startup capital goal **3 months earlier**!"
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-success-emerald/5 border border-success-emerald/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-success-emerald">savings</span>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
                      "Emergency fund consistency rate is at **85%**. Transfer ₹3,000 this month to maintain your streak medal!"
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. AI FINANCIAL COPILOT TAB */}
        {activeTab === 'copilot' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-slide-up">
            
            {/* Copilot Chat pane */}
            <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col h-[580px] overflow-hidden border border-glass-border shadow-lg">
              
              {/* Header */}
              <div className="p-4 border-b border-glass-border flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">Nova AI Copilot</h3>
                    <p className="text-[10px] text-success-emerald font-semibold">Live Finance Advisor</p>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadReport}
                  className="font-bold text-xs bg-primary text-white hover:bg-primary-container px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span> Download PDF Report
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {copilotMessages.map(m => (
                  <div key={m.id} className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${m.sender === 'user' ? 'bg-[#C2185B] text-white rounded-tr-none' : 'bg-white/30 border border-glass-border text-on-surface rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {copilotTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="p-3 rounded-2xl bg-white/30 border border-glass-border text-xs flex items-center gap-1 font-semibold text-primary">
                      <span className="w-1.5 h-1.5 bg-[#C2185B] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#C2185B] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#C2185B] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div className="p-3 border-t border-glass-border bg-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCopilot()}
                  placeholder="Ask Nova about emergency funds, budget planning, or SIPs..."
                  className="flex-1 bg-white/20 border border-glass-border rounded-xl px-4 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/60"
                />
                <button 
                  onClick={handleSendCopilot}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>

            </div>

            {/* Smart Expense Statement Analyzer */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary">upload_file</span>
                  Smart Expense Analyzer
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Paste bank statement logs or copy-paste CSV statements to auto-categorize.
                </p>

                <textarea 
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Paste bank transaction rows here..." 
                  rows={6}
                  className="w-full bg-white/20 border border-glass-border rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                />

                <button 
                  onClick={handleParseStatement}
                  disabled={parsing}
                  className="w-full font-bold text-xs bg-primary text-white py-3 rounded-xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {parsing ? (
                    <span className="material-symbols-outlined text-sm animate-spin">rotate_right</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  )}
                  Analyze &amp; Categorize
                </button>

                {parseResults && (
                  <div className="mt-4 border-t border-glass-border pt-4">
                    <h4 className="font-bold text-xs text-on-surface mb-2">Categorized Records:</h4>
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                      {parseResults.map((r, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/10 flex justify-between items-center text-[10px]">
                          <div>
                            <span className="font-bold">{r.title}</span>
                            <span className="text-[8px] bg-primary/20 text-[#C2185B] px-1.5 py-0.5 rounded-full ml-2 uppercase font-extrabold">{r.category}</span>
                          </div>
                          <span className="font-bold text-[#C2185B]">₹{r.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Manual Expense */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <h4 className="font-bold text-xs text-on-surface mb-3">Add Manual Transaction</h4>
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Expense name"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="w-full bg-white/20 border border-glass-border rounded-lg px-3 py-2 text-xs text-on-surface"
                  />
                  <input 
                    type="number" 
                    placeholder="Amount (₹)"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full bg-white/20 border border-glass-border rounded-lg px-3 py-2 text-xs text-on-surface"
                  />
                  <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full bg-white/20 border border-glass-border rounded-lg px-3 py-2 text-xs text-on-surface text-on-surface-variant font-semibold"
                  >
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Travel">Travel</option>
                  </select>
                  <button 
                    onClick={handleAddExpense}
                    className="w-full font-bold text-xs bg-[#FFB300] text-[#320047] py-2.5 rounded-lg hover:opacity-90 transition-all"
                  >
                    Add Expense
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 3. GOAL PLANNER TAB */}
        {activeTab === 'goals' && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* Header / Trigger */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Goal Planner</h3>
              <button 
                onClick={() => setGoalModalOpen(true)}
                className="font-bold text-xs bg-primary text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-1 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add New Goal
              </button>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map(g => {
                const percent = Math.min(100, Math.round((g.currentSavings / g.targetAmount) * 100));
                return (
                  <div key={g.id} className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-base text-on-surface">{g.title}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Target: **₹{g.targetAmount}**</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${g.probability === 'High' ? 'bg-success-emerald/20 text-success-emerald' : g.probability === 'Medium' ? 'bg-[#FFB300]/20 text-[#FFB300]' : 'bg-error/20 text-error'}`}>
                          {g.probability} Probability
                        </span>
                        <p className="text-[10px] text-on-surface-variant mt-1.5">Completes: **{g.estCompletionDate}**</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden mt-6 relative">
                      <div className="h-full bg-primary" style={{ width: `${percent}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 text-[11px] font-bold text-on-surface-variant">
                      <span>₹{g.currentSavings} saved</span>
                      <span>{percent}%</span>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-glass-border gap-4">
                      <button 
                        onClick={() => setSelectedGoalForContribution(g)}
                        className="flex-1 font-bold text-xs bg-[#FFB300]/20 text-[#FFB300] border border-[#FFB300]/40 py-2 rounded-xl hover:bg-[#FFB300] hover:text-[#320047] transition-all"
                      >
                        Add Savings
                      </button>
                      <button 
                        onClick={() => handleDeleteGoal(g.id)}
                        className="font-bold text-xs text-error hover:underline px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Goal Modal */}
            {goalModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" onClick={() => setGoalModalOpen(false)}></div>
                <div className="relative w-full max-w-md mx-4 glass-panel rounded-2xl p-6 border border-glass-border shadow-2xl">
                  <h3 className="font-bold text-base text-primary mb-4">Create Financial Goal</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Goal Name</label>
                      <input 
                        type="text" 
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Target Amount (₹)</label>
                      <input 
                        type="number" 
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Monthly Contribution (₹)</label>
                      <input 
                        type="number" 
                        value={newGoal.monthlyContribution}
                        onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: Number(e.target.value) })}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Target Deadline</label>
                      <input 
                        type="date" 
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <button 
                      onClick={handleSaveGoal}
                      className="w-full font-bold text-xs bg-primary text-white py-3 rounded-xl hover:opacity-90 mt-2"
                    >
                      Save Goal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contribution Modal */}
            {selectedGoalForContribution && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" onClick={() => setSelectedGoalForContribution(null)}></div>
                <div className="relative w-full max-w-sm mx-4 glass-panel rounded-2xl p-6 border border-glass-border shadow-2xl">
                  <h3 className="font-bold text-base text-primary mb-4">Add Savings to: {selectedGoalForContribution.title}</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Savings Amount (₹)</label>
                      <input 
                        type="number" 
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(Number(e.target.value))}
                        className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2 text-xs text-on-surface"
                      />
                    </div>
                    <button 
                      onClick={handleGoalContribution}
                      className="w-full font-bold text-xs bg-primary text-white py-3 rounded-xl hover:opacity-90"
                    >
                      Confirm Savings
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. INVESTMENT SIMULATOR & PORTFOLIO */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-slide-up">
            
            {/* Interactive SIP Sliders */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border">
                <h3 className="font-bold text-base text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FFB300]">sliders</span>
                  SIP Compound Wealth Simulator
                </h3>

                <div className="space-y-6">
                  {/* Monthly Investment Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-on-surface mb-2">
                      <span>Monthly SIP Amount</span>
                      <span className="text-[#C2185B] font-extrabold">₹{sipAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="100000" 
                      step="500" 
                      value={sipAmount} 
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full accent-primary bg-white/10 h-1.5 rounded-full"
                    />
                  </div>

                  {/* Rate of Return Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-on-surface mb-2">
                      <span>Expected Annual Rate of Return</span>
                      <span className="text-[#C2185B] font-extrabold">{sipRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="30" 
                      step="0.5" 
                      value={sipRate} 
                      onChange={(e) => setSipRate(Number(e.target.value))}
                      className="w-full accent-primary bg-white/10 h-1.5 rounded-full"
                    />
                  </div>

                  {/* Time Horizon Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-on-surface mb-2">
                      <span>Duration (Years)</span>
                      <span className="text-[#C2185B] font-extrabold">{sipYears} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="40" 
                      step="1" 
                      value={sipYears} 
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full accent-primary bg-white/10 h-1.5 rounded-full"
                    />
                  </div>
                </div>

                {/* Return Summary Metrics */}
                <div className="grid grid-cols-3 gap-4 border-t border-glass-border mt-8 pt-6 text-center">
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Total Invested</p>
                    <p className="text-base font-extrabold text-on-surface mt-1">₹{totalInvested.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Estimated Returns</p>
                    <p className="text-base font-extrabold text-success-emerald mt-1">₹{returns.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Expected Wealth</p>
                    <p className="text-base font-extrabold text-primary mt-1">₹{expectedWealth.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Simulator Graph */}
                <div className="w-full h-[220px] mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="year" stroke="rgba(0,0,0,0.4)" fontSize={10}/>
                      <YAxis stroke="rgba(0,0,0,0.4)" fontSize={10}/>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Line type="monotone" dataKey="invested" stroke="#FFB300" strokeWidth={2} dot={false} name="Invested Capital"/>
                      <Line type="monotone" dataKey="wealth" stroke="#C2185B" strokeWidth={3} dot={false} name="Wealth Growth"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Virtual Portfolio */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border">
                <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary">toll</span>
                  Virtual Demo Portfolio
                </h3>
                
                {/* Available Balance */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center mb-4">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Demo Money Available</p>
                  <p className="text-2xl font-extrabold text-primary mt-1">₹{virtualBalance.toLocaleString('en-IN')}</p>
                </div>

                {/* Portfolio Assets */}
                <div className="flex flex-col gap-2 mb-6">
                  <h4 className="font-bold text-xs text-on-surface mb-1">Your Investments:</h4>
                  {portfolio.length === 0 ? (
                    <p className="text-[11px] text-on-surface-variant italic">No virtual assets owned yet.</p>
                  ) : (
                    portfolio.map((item, idx) => {
                      const value = item.qty * item.currentPrice;
                      const profit = (item.currentPrice - item.avgPrice) * item.qty;
                      return (
                        <div key={idx} className="p-3 rounded-xl border border-glass-border flex justify-between items-center bg-white/20 text-[10px]">
                          <div>
                            <p className="font-bold text-on-surface">{item.name}</p>
                            <p className="text-[8px] text-on-surface-variant mt-0.5">Qty: {item.qty} | Avg: ₹{item.avgPrice}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-on-surface">₹{value.toLocaleString('en-IN')}</p>
                            <p className={`text-[8px] font-bold ${profit >= 0 ? 'text-success-emerald' : 'text-error'}`}>
                              {profit >= 0 ? '+' : ''}₹{profit}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Buy / Sell UI */}
                <div className="border-t border-glass-border pt-4">
                  <h4 className="font-bold text-xs text-on-surface mb-3">Invest Mock Funds</h4>
                  <div className="flex flex-col gap-3">
                    <select 
                      value={selectedAssetToBuy}
                      onChange={(e) => setSelectedAssetToBuy(e.target.value)}
                      className="w-full bg-white/20 border border-glass-border rounded-lg p-2.5 text-xs text-on-surface font-semibold"
                    >
                      {assetsCatalog.map(a => (
                        <option key={a.id} value={a.id}>{a.name} (Price: ₹{a.price})</option>
                      ))}
                    </select>

                    <div className="flex justify-between items-center">
                      <label className="text-xs text-on-surface-variant font-bold">Qty:</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={tradeQty} 
                        onChange={(e) => setTradeQty(Math.max(1, Number(e.target.value)))}
                        className="w-20 bg-white/20 border border-glass-border rounded-lg p-1.5 text-xs text-on-surface text-center font-bold"
                      />
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button 
                        onClick={() => handlePortfolioTrade('BUY')}
                        className="flex-1 font-bold text-xs bg-success-emerald text-white py-2.5 rounded-lg hover:opacity-90 transition-all"
                      >
                        Buy Asset
                      </button>
                      <button 
                        onClick={() => handlePortfolioTrade('SELL')}
                        className="flex-1 font-bold text-xs bg-error text-white py-2.5 rounded-lg hover:opacity-90 transition-all"
                      >
                        Sell Asset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 5. GOVERNMENT SCHEME FINDER */}
        {activeTab === 'schemes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-slide-up">
            
            {/* Questionnaire Filter form */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-2xl flex flex-col border border-glass-border self-start">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">page_info</span>
                Find Schemes
              </h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Age</label>
                  <input 
                    type="number" 
                    value={schemeForm.age}
                    onChange={(e) => setSchemeForm({ ...schemeForm, age: Number(e.target.value) })}
                    className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">State Domicile</label>
                  <select 
                    value={schemeForm.state}
                    onChange={(e) => setSchemeForm({ ...schemeForm, state: e.target.value })}
                    className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Occupation</label>
                  <select 
                    value={schemeForm.occupation}
                    onChange={(e) => setSchemeForm({ ...schemeForm, occupation: e.target.value })}
                    className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold"
                  >
                    <option value="Entrepreneur">Entrepreneur / Business Owner</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Homemaker">Homemaker</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-bold uppercase ml-1 mb-1">Annual Income (₹)</label>
                  <input 
                    type="number" 
                    value={schemeForm.annualIncome}
                    onChange={(e) => setSchemeForm({ ...schemeForm, annualIncome: Number(e.target.value) })}
                    className="w-full bg-white/20 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div className="flex items-center justify-between border border-glass-border p-3 rounded-xl bg-white/10 mt-1">
                  <span className="text-xs text-on-surface-variant font-semibold">Self-Help Group (SHG) Member?</span>
                  <input 
                    type="checkbox" 
                    checked={schemeForm.shgMember}
                    onChange={(e) => setSchemeForm({ ...schemeForm, shgMember: e.target.checked })}
                    className="w-5 h-5 rounded border-glass-border text-primary focus:ring-primary"
                  />
                </div>
                <button 
                  onClick={handleFindSchemes}
                  className="w-full font-bold text-xs bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all mt-2"
                >
                  Find Matching Schemes
                </button>
              </div>
            </div>

            {/* Scheme Cards Results */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-on-surface-variant uppercase tracking-wider">Matched Schemes:</h4>
                {schemesLoading && <span className="material-symbols-outlined text-primary text-xl animate-spin">rotate_right</span>}
              </div>

              {schemes.length === 0 ? (
                <div className="glass-panel p-8 text-center rounded-2xl border border-glass-border bg-white/30">
                  <span className="material-symbols-outlined text-[#FFB300] text-4xl mb-2">account_balance</span>
                  <p className="text-xs text-on-surface-variant font-medium">Select parameters and click "Find Matching Schemes" to search.</p>
                </div>
              ) : (
                schemes.map(s => {
                  const isBookmarked = bookmarkedSchemes.some(bm => bm.id === s.id);
                  return (
                    <div key={s.id} className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border relative hover:border-[#FFB300]/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] bg-primary/20 text-[#C2185B] px-2 py-0.5 rounded-full font-extrabold uppercase">
                            {s.scope} • {s.ministry}
                          </span>
                          <h4 className="font-bold text-base text-on-surface mt-2">{s.name}</h4>
                        </div>
                        <button 
                          onClick={() => handleToggleBookmark(s.id)}
                          className="p-2 rounded-full bg-white/20 border border-glass-border hover:text-[#C2185B] transition-colors"
                        >
                          <span className={`material-symbols-outlined text-sm ${isBookmarked ? 'fill text-[#C2185B]' : 'text-on-surface-variant'}`}>
                            bookmark
                          </span>
                        </button>
                      </div>

                      {/* Benefits & Documents */}
                      <p className="text-xs text-on-surface-variant leading-relaxed mt-3">{s.benefits}</p>
                      
                      <div className="mt-4 p-3 rounded-xl bg-success-emerald/5 border border-success-emerald/20">
                        <p className="text-[10px] text-success-emerald font-bold uppercase mb-1">AI Simplified Qualification:</p>
                        <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed italic">
                          "{s.aiSummary}"
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-glass-border flex justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-1 text-[9px] text-on-surface-variant font-semibold">
                          <span>Docs: {s.documents.slice(0, 2).join(', ')}...</span>
                        </div>
                        <a 
                          href={s.officialUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-bold text-xs bg-[#FFB300] text-[#320047] px-4 py-2 rounded-xl hover:opacity-90 shadow-sm text-center"
                        >
                          Official Apply Portal
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* 6. LEARNING HUB TAB */}
        {activeTab === 'learning' && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* Cabinet */}
            <div className="glass-panel p-6 rounded-2xl border border-glass-border bg-white/40 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Your Achievements Cabinet</h3>
                <p className="text-xs text-on-surface-variant mt-1">Complete lessons, answer quizzes, and unlock Indian Financial literacy medals!</p>
              </div>
              <div className="flex gap-2">
                {badges.map((b, idx) => (
                  <span key={idx} className="text-[10px] font-bold bg-[#FFB300]/20 text-[#FFB300] border border-[#FFB300]/40 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs fill">workspace_premium</span> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Smart Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'l1', title: 'Systematic Investment Plans (SIP)', desc: 'Discover how small, consistent monthly allocations compound into massive retirement wealth.', quiz: 'Q1: What does SIP stand for?', options: ['Secure Income Portfolio', 'Systematic Investment Plan', 'State Investment Program'], answer: 1 },
                { id: 'l2', title: 'Gold vs Equity Investments', desc: 'Unlock the historical performance differences between Gold ETFs, SGBs, and Nifty index funds.', quiz: 'Q2: SGB stands for?', options: ['Systematic Gold Bond', 'Sovereign Gold Bond', 'State Gold Bill'], answer: 1 },
                { id: 'l3', title: 'Tax Saving 101 (80C/PPF)', desc: 'Learn how to maximize tax exemptions using PPF, NPS, and Sukanya Samriddhi Yojana tools.', quiz: 'Q3: Section 80C offers tax exemptions up to?', options: ['₹1.5 Lakhs', '₹3 Lakhs', '₹5 Lakhs'], answer: 0 }
              ].map(m => (
                <div key={m.id} className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-on-surface leading-tight">{m.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-2 flex-grow">{m.desc}</p>
                  
                  {/* Lesson Quiz Panel */}
                  <div className="mt-4 pt-4 border-t border-glass-border">
                    <p className="text-[10px] text-on-surface-variant font-bold mb-2 uppercase">{m.quiz}</p>
                    <div className="flex flex-col gap-2">
                      {m.options.map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => {
                            if (idx === m.answer) {
                              handleCompleteLesson(m.id, 100);
                            } else {
                              alert("Oops! Incorrect, try again!");
                            }
                          }}
                          className="w-full text-left p-2 rounded-lg bg-white/20 border border-glass-border text-[10px] hover:bg-white/40 font-semibold"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 7. SAFETY CENTER & EMERGENCY SUPPORT */}
        {activeTab === 'safety' && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            
            {/* emergency loss support toggle */}
            <div className="glass-panel p-6 rounded-2xl border border-glass-border bg-gradient-to-r from-error/10 to-transparent flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">warning</span>
                  Emergency Finance Mode
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Trigger this if you recently experienced job loss or health crises. Access expense reduction and local skill programs.
                </p>
              </div>
              <button 
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`font-bold text-xs px-4 py-2.5 rounded-xl border transition-all ${emergencyMode ? 'bg-error text-white border-transparent' : 'border-error/40 text-error bg-error/5 hover:bg-error/10'}`}
              >
                {emergencyMode ? 'Disable Emergency Mode' : 'Enable Emergency Mode'}
              </button>
            </div>

            {emergencyMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeSlideUp_0.5s_ease-out]">
                
                {/* Emergency Budget plan */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border">
                  <h4 className="font-bold text-sm text-error mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">payments</span> Emergency Expense Reduction Checklist
                  </h4>
                  <ul className="space-y-3 text-xs text-on-surface-variant leading-relaxed font-semibold">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-error text-sm">cancel</span> Pause non-essential subscriptions (Gym, OTT, Leisure).
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-success-emerald text-sm">check_circle</span> Downsize grocery plans &amp; pause online dining-out deliveries.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-success-emerald text-sm">check_circle</span> Apply for interest-free government micro-credits (Mudra Shishu scheme).
                    </li>
                  </ul>
                </div>

                {/* Free skills programmes */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col border border-glass-border">
                  <h4 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#FFB300] text-sm">school</span> Recommended Free Local Skill Programs
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="p-3 rounded-xl bg-white/20 border border-glass-border flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold">PMKVY Technical Training</h5>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Duration: 3 Months | Location: Regional Center</p>
                      </div>
                      <a href="https://www.pmkvyofficial.org" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary hover:underline">Apply</a>
                    </div>
                    <div className="p-3 rounded-xl bg-white/20 border border-glass-border flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold">DDU-GKY Rural Employment</h5>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Duration: 6 Months | Placement Guaranteed</p>
                      </div>
                      <a href="http://ddugky.gov.in" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary hover:underline">Apply</a>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Safety tips cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'UPI Fraud Protection', icon: 'shield', desc: 'Avoid typing your UPI PIN when receiving money. Scammers use fake collect requests. PIN is only needed to pay, never to receive!' },
                { title: 'Fake Loan App Detection', icon: 'gavel', desc: 'Never borrow from unregistered app stores. Real lending apps must list their associated NBFC/Banks registered under RBI.' },
                { title: 'Investment Scheme Scams', icon: 'visibility', desc: 'Be wary of schemes promising 20%+ monthly guaranteed returns. Multi-level networking/referral schemes are highly illegal.' }
              ].map((tip, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-glass-border flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <span className="material-symbols-outlined">{tip.icon}</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">{tip.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-2">{tip.desc}</p>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
