'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const categoryData = [
  { name: 'SIP', value: 35000, color: '#F06292' },
  { name: 'Bonus', value: 18000, color: '#FFB300' },
  { name: 'Auto-Save', value: 8400, color: '#7B1FA2' },
  { name: 'Other', value: 4000, color: '#2E7D32' },
];

export default function SavingsTracker() {
  const [modalOpen, setModalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");

  const target = 100000;
  const [balance, setBalance] = useState(65400);
  const [showBurst, setShowBurst] = useState(false);
  const [prevProgress, setPrevProgress] = useState(65); // initial is 65
  const [extraSavings, setExtraSavings] = useState(0);
  const [activeRange, setActiveRange] = useState('1M');

  const [transactionType, setTransactionType] = useState('deposit'); // 'deposit' or 'withdrawal'
  const [categoryInput, setCategoryInput] = useState("sip");
  const [dateInput, setDateInput] = useState("");
  
  const [entries, setEntries] = useState([
    { id: 1, title: 'Monthly SIP', date: 'Today', amount: 5000, type: 'positive', icon: 'account_balance', iconColor: 'text-primary', iconBg: 'bg-primary/10' },
    { id: 2, title: 'Freelance Bonus', date: 'Yesterday', amount: 12400, type: 'positive', icon: 'payments', iconColor: 'text-[#FFB300]', iconBg: 'bg-[#FFB300]/10' },
    { id: 3, title: 'Auto-Save', date: 'Oct 12, 2023', amount: 2000, type: 'positive', icon: 'savings', iconColor: 'text-primary', iconBg: 'bg-primary/10' },
    { id: 4, title: 'Medical Emergency', date: 'Sep 28, 2023', amount: 4000, type: 'negative', icon: 'medical_services', iconColor: 'text-error', iconBg: 'bg-error/10' }
  ]);

  const progressPercent = Math.min(100, Math.round((balance / target) * 100));

  const baseSavingsPerMonth = 5000; // e.g. base SIP
  const remainingGoal = Math.max(0, target - balance);
  const monthsToGoal = remainingGoal / (baseSavingsPerMonth + extraSavings);
  
  const projectedDate = new Date();
  projectedDate.setMonth(projectedDate.getMonth() + (monthsToGoal === Infinity ? 0 : Math.ceil(monthsToGoal)));
  const dateString = projectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  let progressGlow = "rgba(240, 98, 146, 0.4)";
  let progressGradient = "linear-gradient(90deg, #F06292 0%, #C2185B 100%)";
  
  if (progressPercent >= 100) {
    progressGlow = "rgba(46, 125, 50, 0.6)"; // emerald
    progressGradient = "linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%)";
  } else if (progressPercent >= 50) {
    progressGlow = "rgba(255, 179, 0, 0.4)"; // warmer amber
    progressGradient = "linear-gradient(90deg, #FFB300 0%, #F57C00 100%)";
  } else if (progressPercent >= 25) {
    progressGlow = "rgba(255, 179, 0, 0.2)"; // amber
    progressGradient = "linear-gradient(90deg, #FFD54F 0%, #FFB300 100%)";
  }

  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const crossedMilestone = milestones.some(m => prevProgress < m && progressPercent >= m);
    
    if (crossedMilestone) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1500);
    }
    setPrevProgress(progressPercent);
  }, [progressPercent, prevProgress]);

  useEffect(() => {
    // Generate Nova Particles
    const particlesContainer = document.getElementById('savings-particles');
    if (!particlesContainer) return;
    
    particlesContainer.innerHTML = '';
    const numParticles = 15;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        
        const size = Math.random() * 8 + 4; // 4px to 12px
        const left = Math.random() * 100; // 0% to 100%
        const animDuration = Math.random() * 10 + 15; // 15s to 25s
        const delay = Math.random() * 10; // 0s to 10s
        
        particle.style.position = 'absolute';
        particle.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animation = `float-up ${animDuration}s linear infinite, twinkle 3s ease-in-out infinite alternate`;
        particle.style.animationDelay = `-${delay}s, -${Math.random() * 3}s`;
        
        particlesContainer.appendChild(particle);
    }
  }, []);

  const handleAddEntry = (e) => {
    e.preventDefault();
    const amount = parseFloat(amountInput);
    if (!isNaN(amount)) {
      const finalAmount = transactionType === 'withdrawal' ? -Math.abs(amount) : Math.abs(amount);
      setBalance(prev => prev + finalAmount);
      
      let title = transactionType === 'deposit' ? "Other Deposit" : "Other Expense";
      let icon = transactionType === 'deposit' ? "savings" : "receipt";
      let iconColor = transactionType === 'deposit' ? "text-primary" : "text-error";
      let iconBg = transactionType === 'deposit' ? "bg-primary/10" : "bg-error/10";
      
      if (categoryInput === "sip") {
        title = "Monthly SIP"; icon = "account_balance"; iconColor = "text-primary"; iconBg = "bg-primary/10";
      } else if (categoryInput === "bonus") {
        title = "Bonus / Extra Income"; icon = "payments"; iconColor = "text-[#FFB300]"; iconBg = "bg-[#FFB300]/10";
      } else if (categoryInput === "auto") {
        title = "Auto-Save"; icon = "savings"; iconColor = "text-[#7B1FA2]"; iconBg = "bg-[#7B1FA2]/10";
      } else if (categoryInput === "salary") {
        title = "Salary Deposit"; icon = "work"; iconColor = "text-primary"; iconBg = "bg-primary/10";
      } else if (categoryInput === "gift") {
        title = "Gift / Family Support"; icon = "redeem"; iconColor = "text-[#FFB300]"; iconBg = "bg-[#FFB300]/10";
      } else if (categoryInput === "refund") {
        title = "Refund"; icon = "currency_exchange"; iconColor = "text-primary"; iconBg = "bg-primary/10";
      } else if (categoryInput === "medical") {
        title = "Medical Emergency"; icon = "medical_services"; iconColor = "text-error"; iconBg = "bg-error/10";
      } else if (categoryInput === "bill") {
        title = "Bill Payment"; icon = "receipt_long"; iconColor = "text-error"; iconBg = "bg-error/10";
      } else if (categoryInput === "education") {
        title = "Education Expense"; icon = "school"; iconColor = "text-[#FFB300]"; iconBg = "bg-[#FFB300]/10";
      } else if (categoryInput === "family") {
        title = "Family Support Given"; icon = "family_restroom"; iconColor = "text-[#7B1FA2]"; iconBg = "bg-[#7B1FA2]/10";
      } else if (categoryInput === "emergency") {
        title = "Emergency Withdrawal"; icon = "warning"; iconColor = "text-error"; iconBg = "bg-error/10";
      }

      const displayDate = dateInput ? new Date(dateInput).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today';

      const newEntry = {
        id: Date.now(),
        title,
        date: displayDate,
        amount: finalAmount,
        type: finalAmount >= 0 ? 'positive' : 'negative',
        icon,
        iconColor,
        iconBg
      };

      setEntries(prev => [newEntry, ...prev]);
      
      setAmountInput("");
      setCategoryInput("sip");
      setDateInput("");
    }
    setModalOpen(false);
  };

  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
            100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes float-up {
            from { transform: translateY(100vh) rotate(0deg); }
            to { transform: translateY(-100px) rotate(360deg); }
        }
        @keyframes twinkle {
            from { opacity: 0.1; transform: scale(0.8); }
            to { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes drawLine {
            to { stroke-dashoffset: 0; }
        }
        @keyframes fillArea {
            to { opacity: 1; }
        }
        .chart-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 2s ease-out forwards;
        }
        .chart-fill {
            opacity: 0;
            animation: fillArea 2s ease-out forwards;
            animation-delay: 0.5s;
        }
        @keyframes slideUpFade {
            to { opacity: 1; transform: translateY(0); }
        }
        .entry-row {
            opacity: 0;
            transform: translateY(20px);
            animation: slideUpFade 0.6s ease-out forwards;
        }
        @keyframes nova-burst {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-burst {
            animation: nova-burst 1.5s ease-out forwards;
        }
      `}} />
      <div id="savings-particles" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"></div>
      
      <Sidebar activeItem="finance" />
      <Header />
      
      <main className="md:ml-64 pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop pb-32 max-w-container-max mx-auto relative z-10 w-full">
        {/* Header / Goal Section */}
        <section className="mb-stack-lg relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-md">
            <div>
              <h2 className="font-headline-lg md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 font-bold">Emergency Fund</h2>
              <p className="font-body-lg text-body-lg text-[#7B1FA2]">Target: ₹1,00,000</p>
            </div>
            <div className="md:text-right">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Current Balance</p>
              <div className="flex flex-col md:items-end gap-2">
                <p className="font-headline-md text-headline-md text-primary leading-none">₹{balance.toLocaleString('en-IN')}</p>
                <div className="glass-panel flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 border border-white/30 text-[#C2185B] w-max shadow-sm backdrop-blur-md">
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  <span className="font-label-sm text-xs font-semibold">≈ {(balance / 40000).toFixed(1)} months expenses covered</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            {showBurst && (
              <div className="absolute top-1/2 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,215,0,0.8)_0%,transparent_60%)] animate-burst pointer-events-none z-20"></div>
            )}
            <div 
              className="glass-panel rounded-full h-8 w-full p-1 relative overflow-hidden transition-shadow duration-700" 
              style={{ boxShadow: `0 0 15px ${progressGlow}` }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-full"></div>
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${progressPercent}%`, background: progressGradient }}
              >
                {/* Shimmer effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
            <span>0%</span>
            <span>{progressPercent}% Achieved</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Chart Section */}
            <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface">Savings Trend</h3>
                <div className="flex gap-2 bg-white/20 rounded-lg p-1">
                  <button 
                    onClick={() => setActiveRange('1M')}
                    className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors ${activeRange === '1M' ? 'bg-white/40 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/20'}`}
                  >1M</button>
                  <button 
                    onClick={() => setActiveRange('6M')}
                    className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors ${activeRange === '6M' ? 'bg-white/40 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/20'}`}
                  >6M</button>
                  <button 
                    onClick={() => setActiveRange('1Y')}
                    className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors ${activeRange === '1Y' ? 'bg-white/40 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/20'}`}
                  >1Y</button>
                </div>
              </div>
              <div className="flex-1 relative w-full h-full mt-4">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#9b0044" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#C2185B" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path className="chart-fill" d="M0,200 L0,150 Q50,140 100,160 T200,120 T300,90 T400,60 T500,40 L500,200 Z" fill="url(#areaGradient)"></path>
                  <path className="chart-path" d="M0,150 Q50,140 100,160 T200,120 T300,90 T400,60 T500,40" fill="none" stroke="#C2185B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                  <circle className="opacity-0 animate-[fillArea_0.5s_ease-out_2s_forwards]" cx="500" cy="40" fill="#FFF" r="6" stroke="#C2185B" strokeWidth="3"></circle>
                </svg>
              </div>
            </section>

            {/* "What If" Goal Projector */}
            <section className="glass-panel rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#FFB300]">lightbulb</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">"What If" Goal Projector</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-on-surface font-body-md">
                  <span>If I save ₹<span className="font-bold text-[#FFB300]">{extraSavings}</span> more per month</span>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  step="500" 
                  value={extraSavings} 
                  onChange={(e) => setExtraSavings(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-[#FFB300]"
                  style={{ background: 'linear-gradient(90deg, #FFB300 0%, #2E7D32 100%)' }}
                />
                
                <div className="mt-2 p-4 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between">
                  <span className="font-body-md text-on-surface-variant">Projected Goal Date:</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {balance >= target ? "Goal Reached!" : dateString}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Category Breakdown */}
            <section className="glass-panel rounded-2xl p-6 flex flex-col shadow-sm border border-white/20">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Savings Breakdown</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(50, 0, 71, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {categoryData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-xs font-label-sm text-on-surface-variant">{entry.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Entries Section */}
            <section className="flex flex-col gap-4">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 px-1">Recent Entries</h3>
            <div className="flex flex-col gap-3">
              {entries.map((entry, idx) => (
                <div key={entry.id} className="glass-panel p-4 flex items-center justify-between entry-row rounded-2xl hover:-translate-y-1 hover:backdrop-blur-2xl transition-all duration-300" style={{animationDelay: `${(idx + 1) * 0.1}s`}}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${entry.iconBg} flex items-center justify-center ${entry.iconColor}`}>
                      <span className="material-symbols-outlined">{entry.icon}</span>
                    </div>
                    <div>
                      <p className="font-body-md text-on-surface font-medium">{entry.title}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{entry.date}</p>
                    </div>
                  </div>
                  <span className={`font-body-lg font-medium ${entry.type === 'positive' ? 'text-success-emerald' : 'text-error'}`}>
                    {entry.type === 'positive' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-8 md:bottom-12 right-6 md:right-12 z-50 flex items-center justify-center gap-2 bg-[#FFB300] text-[#320047] px-6 py-4 rounded-full shadow-[0_0_20px_rgba(255,179,0,0.4)] hover:shadow-[0_0_30px_rgba(255,179,0,0.6)] hover:scale-105 transition-all duration-300 font-body-lg font-semibold group border border-white/30 backdrop-blur-md active:scale-95"
        onClick={() => setModalOpen(true)}
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
        Add Entry
      </button>

      {/* Glass Modal for Adding Entry */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300">
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-md mx-4 glass-panel rounded-2xl p-8 shadow-2xl transition-transform duration-300 transform scale-100">
            <button className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface hover:bg-white/20 p-2 rounded-full transition-colors" onClick={() => setModalOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">New Savings Entry</h2>
            <form className="flex flex-col gap-4" onSubmit={handleAddEntry}>
              
              {/* Segmented Control */}
              <div className="flex bg-white/20 p-1 rounded-xl glass-panel shadow-inner mb-2 border border-white/30">
                <button
                  type="button"
                  onClick={() => { setTransactionType('deposit'); setCategoryInput('sip'); }}
                  className={`flex-1 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all duration-300 ${transactionType === 'deposit' ? 'bg-[#FFB300] text-[#320047] shadow-sm' : 'text-on-surface hover:bg-white/10'}`}
                >
                  Add Money
                </button>
                <button
                  type="button"
                  onClick={() => { setTransactionType('withdrawal'); setCategoryInput('medical'); }}
                  className={`flex-1 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all duration-300 ${transactionType === 'withdrawal' ? 'bg-[#FFB300] text-[#320047] shadow-sm' : 'text-on-surface hover:bg-white/10'}`}
                >
                  Withdraw Money
                </button>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 uppercase">Amount (₹)</label>
                <input 
                  className="w-full glass-panel rounded-[14px] px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-white/40 bg-white/20 placeholder:text-on-surface-variant/50 font-body-lg" 
                  placeholder="0.00" 
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 uppercase">Category</label>
                <div className="relative">
                  <select 
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full glass-panel rounded-[14px] px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-white/40 bg-white/20 appearance-none font-body-md"
                  >
                    {transactionType === 'deposit' ? (
                      <>
                        <option value="sip" className="text-black">Monthly SIP</option>
                        <option value="bonus" className="text-black">Bonus / Extra Income</option>
                        <option value="auto" className="text-black">Auto-Save</option>
                        <option value="salary" className="text-black">Salary Deposit</option>
                        <option value="gift" className="text-black">Gift / Family Support</option>
                        <option value="refund" className="text-black">Refund</option>
                        <option value="other" className="text-black">Other Deposit</option>
                      </>
                    ) : (
                      <>
                        <option value="medical" className="text-black">Medical Emergency</option>
                        <option value="bill" className="text-black">Bill Payment</option>
                        <option value="education" className="text-black">Education Expense</option>
                        <option value="family" className="text-black">Family Support Given</option>
                        <option value="emergency" className="text-black">Emergency Withdrawal</option>
                        <option value="other" className="text-black">Other Expense</option>
                      </>
                    )}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1 uppercase">Date</label>
                <input 
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full glass-panel rounded-[14px] px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-white/40 bg-white/20 font-body-md" 
                />
              </div>
              <button className="mt-4 w-full bg-[#FFB300] text-[#320047] font-body-lg font-semibold py-3 rounded-xl shadow-[0_0_15px_rgba(255,179,0,0.3)] hover:bg-[#FFC107] transition-colors" type="submit">
                  Save Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
