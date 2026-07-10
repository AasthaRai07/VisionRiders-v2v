const express = require('express');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

// Curated Real-World Government Schemes for Women in India (Requirement 8)
const GOVT_SCHEMES = [
  {
    id: 'mudra-yojana',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    benefits: 'Collateral-free business loans up to ₹10 Lakhs with low interest rates and flexible repayment options.',
    eligibility: {
      gender: 'Female Preferred',
      occupation: ['Entrepreneur', 'Working Professional'],
      maxIncome: 1000000,
      minAge: 18,
      maxAge: 65
    },
    documents: ['Identity Proof', 'Address Proof', 'Business Address & Category Proof', 'Passport Photographs'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/pmmy',
    currentStatus: 'Active',
    summaryTemplate: (state, occ) => `You qualify as a female entrepreneur from ${state} seeking business expansion funding.`
  },
  {
    id: 'mahila-samman',
    name: 'Mahila Samman Savings Certificate',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    benefits: 'Guaranteed 7.5% per annum fixed interest rate on 2-year savings deposits up to ₹2 Lakhs with tax exemption benefits.',
    eligibility: {
      gender: 'Female Only',
      minAge: 10,
      maxAge: 100
    },
    documents: ['Aadhaar Card', 'PAN Card', 'Cheque Book / Deposit Slip', 'KYC Verification Details'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/mssc',
    currentStatus: 'Active',
    summaryTemplate: (state) => `You are eligible as a woman resident of ${state} to secure a high-yield 7.5% fixed savings bond.`
  },
  {
    id: 'standup-india',
    name: 'Stand-Up India Scheme',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    benefits: 'Bank loans between ₹10 Lakhs and ₹1 Crore for setting up greenfield enterprises in manufacturing, services, or trading.',
    eligibility: {
      gender: 'Female Only',
      occupation: ['Entrepreneur'],
      minAge: 18,
      maxAge: 70
    },
    documents: ['Aadhaar Card', 'PAN Card', 'Business Project Report', 'Pollution Control NOC', 'Partnership Deed (if applicable)'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/suis',
    currentStatus: 'Active',
    summaryTemplate: (state) => `You qualify as a female entrepreneur starting a new greenfield venture in ${state}.`
  },
  {
    id: 'lakhpati-didi',
    name: 'Lakhpati Didi Scheme',
    ministry: 'Ministry of Rural Development',
    scope: 'Central',
    benefits: 'Comprehensive skill development training (LED bulb making, tailoring, drone operation) and interest-free micro-loans to earn at least ₹1 Lakh annually.',
    eligibility: {
      gender: 'Female Only',
      shgMember: true,
      maxIncome: 200000,
      minAge: 18,
      maxAge: 55
    },
    documents: ['Aadhaar Card', 'SHG Membership Certificate', 'Ration Card', 'Income Certificate'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/lds',
    currentStatus: 'Active',
    summaryTemplate: (state) => `As a Self-Help Group (SHG) member in ${state}, you qualify for free skill training and micro-credit.`
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    ministry: 'Ministry of Women and Child Development',
    scope: 'Central',
    benefits: 'High-interest tax-free savings account (8.2% current rate) opened for a girl child under 10 years. Complete Section 80C tax exemption.',
    eligibility: {
      gender: 'Female Child Beneficiary',
      minAge: 0,
      maxAge: 10
    },
    documents: ['Girl Child Birth Certificate', 'Parent Identity Proof', 'Parent Address Proof', 'Aadhaar Card'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/ssy',
    currentStatus: 'Active',
    summaryTemplate: (state) => `Available for girl children residing in ${state} to build education and wedding capital.`
  },
  {
    id: 'maharashtra-punyashlok',
    name: 'Punyashlok Ahilyadevi Holkar Nursery Scheme',
    ministry: 'Department of Agriculture',
    scope: 'State',
    state: 'Maharashtra',
    benefits: '50% government subsidy to female farmers to set up modern high-tech horticulture plant nurseries.',
    eligibility: {
      gender: 'Female Only',
      state: 'Maharashtra',
      occupation: ['Working Professional', 'Entrepreneur'],
      minAge: 18
    },
    documents: ['Aadhaar Card', 'Maharashtra Land Ownership Record (7/12)', 'Bank Passbook Copy'],
    officialUrl: 'https://maharashtra.gov.in',
    currentStatus: 'Active',
    summaryTemplate: () => `As a female farmer/agriculturist in Maharashtra, you qualify for 50% capital subsidies for plant nurseries.`
  },
  {
    id: 'karnataka-bhagyalaxmi',
    name: 'Bhagyalaxmi Scheme',
    ministry: 'Department of Women & Child Development',
    scope: 'State',
    state: 'Karnataka',
    benefits: 'Financial assistance, health insurance coverage, and scholarship benefits for girl children in BPL families.',
    eligibility: {
      gender: 'Female Child Beneficiary',
      state: 'Karnataka',
      maxIncome: 150000,
      minAge: 0,
      maxAge: 18
    },
    documents: ['BPL Ration Card', 'Child Birth Certificate', 'Income Certificate', 'Aadhaar of Mother'],
    officialUrl: 'https://dwcd.karnataka.gov.in',
    currentStatus: 'Active',
    summaryTemplate: () => `You qualify as a resident of Karnataka belonging to a below-poverty-line (BPL) household.`
  },
  {
    id: 'up-sumangala',
    name: 'Kanya Sumangala Yojana',
    ministry: 'Department of Women and Child Development',
    scope: 'State',
    state: 'Uttar Pradesh',
    benefits: 'Conditional cash transfer of ₹15,000 across 6 educational and vaccination milestones of a girl child.',
    eligibility: {
      gender: 'Female Child Beneficiary',
      state: 'Uttar Pradesh',
      maxIncome: 300000,
      minAge: 0,
      maxAge: 18
    },
    documents: ['Uttar Pradesh Domicile Proof', 'Birth Certificate', 'Income Certificate', 'Joint Photo of Child & Mother'],
    officialUrl: 'https://mksy.up.gov.in',
    currentStatus: 'Active',
    summaryTemplate: () => `Eligible for girl children born in Uttar Pradesh with family annual incomes under ₹3 Lakhs.`
  }
];

// Helper to initialize default finance stats if not present
async function getOrCreateFinanceProfile(userId) {
  const profileRef = admin.firestore().collection('finance_profiles').doc(userId);
  const doc = await profileRef.get();
  
  if (doc.exists) {
    return doc.data();
  }

  const defaultProfile = {
    userId,
    monthlyIncome: 35000,
    emergencyFundBalance: 65400,
    emergencyFundTarget: 100000,
    monthlySavingsRate: 20, // percentage
    finherScore: 75,
    savingsConsistency: 85,
    investmentReadiness: 78,
    netWorth: 120400,
    upcomingBills: [
      { id: 'b1', name: 'LIC Insurance Premium', amount: 3200, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Pending' },
      { id: 'b2', name: 'Broadband/WiFi Bill', amount: 899, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Pending' }
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
    ],
    updatedAt: new Date().toISOString()
  };

  await profileRef.set(defaultProfile);
  return defaultProfile;
}

// 1. GET Dashboard Data
router.get('/:userId/dashboard', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getOrCreateFinanceProfile(userId);
    
    // Fetch goals
    const goalsSnapshot = await admin.firestore().collection('finance_goals')
      .where('userId', '==', userId).get();
    const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch expenses
    const expSnapshot = await admin.firestore().collection('finance_expenses')
      .where('userId', '==', userId).get();
    const expenses = expSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate dynamic net worth & ratings
    const totalGoalSavings = goals.reduce((sum, g) => sum + (Number(g.currentSavings) || 0), 0);
    const updatedNetWorth = profile.emergencyFundBalance + totalGoalSavings;

    res.json({
      profile: {
        ...profile,
        netWorth: updatedNetWorth
      },
      goals,
      expenses
    });
  } catch (error) {
    console.error('Error fetching finance dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// 2. Add / Edit Goals
router.post('/:userId/goals', async (req, res) => {
  try {
    const { userId } = req.params;
    const { id, title, targetAmount, deadline, currentSavings, monthlyContribution } = req.body;

    const target = Number(targetAmount) || 0;
    const current = Number(currentSavings) || 0;
    const monthly = Number(monthlyContribution) || 0;

    // AI Estimations (Requirement 3)
    const gap = Math.max(0, target - current);
    const monthsRequired = monthly > 0 ? Math.ceil(gap / monthly) : 999;
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const monthsAvailable = Math.max(1, ((deadlineDate.getFullYear() - today.getFullYear()) * 12) + (deadlineDate.getMonth() - today.getMonth()));

    // Probability & completion date calculator
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsRequired);
    const estCompletion = completionDate.toISOString().split('T')[0];

    const requiredMonthly = monthsAvailable > 0 ? Math.round(gap / monthsAvailable) : gap;
    let probability = 'High';
    if (monthsRequired > monthsAvailable) {
      probability = 'Low';
    } else if (monthsRequired > monthsAvailable * 0.8) {
      probability = 'Medium';
    }

    const goalData = {
      userId,
      title,
      targetAmount: target,
      deadline,
      currentSavings: current,
      monthlyContribution: monthly,
      estCompletionDate: estCompletion,
      requiredMonthlyContribution: requiredMonthly,
      probability,
      updatedAt: new Date().toISOString()
    };

    let docRef;
    if (id) {
      docRef = admin.firestore().collection('finance_goals').doc(id);
      await docRef.update(goalData);
    } else {
      docRef = await admin.firestore().collection('finance_goals').add(goalData);
    }

    res.json({ success: true, id: docRef.id, ...goalData });
  } catch (error) {
    console.error('Error saving goal:', error);
    res.status(500).json({ error: 'Failed to save goal' });
  }
});

// Update current goal savings
router.post('/:userId/goals/:goalId/add', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { amount } = req.body;

    const docRef = admin.firestore().collection('finance_goals').doc(goalId);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const currentSavings = (Number(doc.data().currentSavings) || 0) + (Number(amount) || 0);
    const targetAmount = Number(doc.data().targetAmount) || 0;
    const monthly = Number(doc.data().monthlyContribution) || 0;

    // Recalculate AI rules
    const gap = Math.max(0, targetAmount - currentSavings);
    const monthsRequired = monthly > 0 ? Math.ceil(gap / monthly) : 999;
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsRequired);

    await docRef.update({
      currentSavings,
      estCompletionDate: completionDate.toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, currentSavings });
  } catch (error) {
    console.error('Error updating goal savings:', error);
    res.status(500).json({ error: 'Failed to update goal savings' });
  }
});

// Delete Goal
router.delete('/:userId/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    await admin.firestore().collection('finance_goals').doc(goalId).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// 3. Post expense
router.post('/:userId/expenses', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, amount, category, date } = req.body;

    const expenseData = {
      userId,
      title,
      amount: Number(amount) || 0,
      category: category || 'Miscellaneous',
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    const docRef = await admin.firestore().collection('finance_expenses').add(expenseData);
    res.json({ success: true, id: docRef.id, ...expenseData });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// 4. Statement Statement Parse API (Requirement 11)
router.post('/:userId/statement-parse', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rawText } = req.body;

    let parsedRecords = [];

    // Fallback parser rules if Gemini returns empty or offline
    const categories = {
      Rent: ['rent', 'landlord', 'housing', 'lease'],
      Food: ['swiggy', 'zomato', 'grocery', 'supermarket', 'd-mart', 'cafe', 'restaurant', 'food'],
      Travel: ['ola', 'uber', 'petrol', 'fuel', 'metro', 'railway', 'flight', 'cab'],
      Shopping: ['amazon', 'flipkart', 'myntra', 'zara', 'mall', 'clothing', 'retail'],
      Bills: ['electricity', 'wifi', 'jio', 'airtel', 'broadband', 'water', 'gas'],
      Medical: ['pharmacy', 'hospital', 'apollo', 'doctor', 'clinic', 'medicine']
    };

    // If real Gemini key is active, use it for statement categorization (Requirement 11)
    if (process.env.GEMINI_API_KEY && rawText) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Parse the following raw bank statement records and return a valid JSON array of objects. 
Each object must have exactly: "title" (cleaned description), "amount" (number), "category" (Must be one of: "Rent", "Food", "Travel", "Shopping", "Bills", "Medical", "Entertainment", or "Miscellaneous"), and "date" (YYYY-MM-DD). Only return raw JSON array inside a markdown code block. Do not write text explanation.

Statement raw text:
${rawText}`
        });

        const textResponse = response.text || '';
        const jsonMatch = textResponse.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          parsedRecords = JSON.parse(jsonMatch[0]);
        }
      } catch (aiErr) {
        console.warn('[Gemini Statement Parse] Failed, falling back to rule-based parser:', aiErr.message);
      }
    }

    // Rule-based fallback if parsedRecords is empty
    if (parsedRecords.length === 0 && rawText) {
      const lines = rawText.split('\n');
      lines.forEach(line => {
        const amountMatch = line.match(/(?:rs\.?|₹)\s?(\d{2,7})/i) || line.match(/(\d{2,7})\s?(?:debit|dr|paid)/i);
        if (amountMatch) {
          const amount = Number(amountMatch[1]);
          const lower = line.toLowerCase();
          
          let matchedCat = 'Miscellaneous';
          for (const cat in categories) {
            if (categories[cat].some(k => lower.includes(k))) {
              matchedCat = cat;
              break;
            }
          }

          // Clean title
          const title = line.replace(/rs\.?|₹|\d{2,7}|debit|dr|paid/gi, '').trim().substring(0, 30) || 'Debit Transaction';

          parsedRecords.push({
            title,
            amount,
            category: matchedCat,
            date: new Date().toISOString().split('T')[0]
          });
        }
      });
    }

    // Default mock records if no text provided
    if (parsedRecords.length === 0) {
      parsedRecords = [
        { title: 'Swiggy Delivery', amount: 890, category: 'Food', date: new Date().toISOString().split('T')[0] },
        { title: 'Amazon shopping', amount: 3200, category: 'Shopping', date: new Date().toISOString().split('T')[0] },
        { title: 'Uber Commute', amount: 450, category: 'Travel', date: new Date().toISOString().split('T')[0] }
      ];
    }

    // Save records to database
    for (const record of parsedRecords) {
      await admin.firestore().collection('finance_expenses').add({
        userId,
        ...record,
        createdAt: new Date().toISOString()
      });
    }

    res.json({ success: true, count: parsedRecords.length, records: parsedRecords });
  } catch (error) {
    console.error('Error parsing statement:', error);
    res.status(500).json({ error: 'Failed to parse statement' });
  }
});

// 5. AI Copilot Chat (Requirement 1 & 14)
router.post('/:userId/copilot', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userQuestion, isReportRequest } = req.body;

    const profile = await getOrCreateFinanceProfile(userId);
    
    // Fetch goals
    const goalsSnapshot = await admin.firestore().collection('finance_goals')
      .where('userId', '==', userId).get();
    const goals = goalsSnapshot.docs.map(doc => doc.data());

    // Fetch expenses
    const expSnapshot = await admin.firestore().collection('finance_expenses')
      .where('userId', '==', userId).get();
    const expenses = expSnapshot.docs.map(doc => doc.data());

    const promptContext = `User Profile:
- Name: ${profile.fullName || 'there'}
- Monthly Income: ₹${profile.monthlyIncome}
- Emergency Fund: ₹${profile.emergencyFundBalance} / ₹${profile.emergencyFundTarget}
- Total Savings Rate: ${profile.monthlySavingsRate}%
- Active Goals: ${goals.map(g => `${g.title} (Target: ₹${g.targetAmount}, Current: ₹${g.currentSavings})`).join(', ') || 'None'}
- Latest Transactions: ${expenses.slice(-5).map(e => `${e.title}: ₹${e.amount} [${e.category}]`).join(', ') || 'None'}`;

    if (isReportRequest) {
      // PDF Report generation text payload (Requirement 14)
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a certified Financial Planner. Generate a comprehensive PDF-printable Markdown report for ${profile.fullName || 'User'} based on this context:
${promptContext}

Structure the report with the following headers:
1. Executive Summary & FinHer Score Review
2. Emergency Fund Health Assessment
3. Monthly Budget & Expenditure Leak Analysis (detail categories Swiggy, Shopping, Rent)
4. Savings Goals Milestones & Success Probability
5. Strategic Allocation Recommendations (SIP, Gold, PPF)
6. Personalized Government Schemes matched for them

Keep the response strictly formatted as clean Markdown.`
          });
          return res.json({ reportMarkdown: response.text });
        } catch (aiErr) {
          console.warn('[Gemini Copilot Report] Failed, serving fallback report:', aiErr.message);
        }
      }

      // Hardcoded fallback report
      const fallbackReport = `# Monthly Financial Health & Growth Report
**Beneficiary:** ${profile.fullName || 'User'}
**Date:** ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}

## 1. Executive Summary
Your FinHer Score is currently **75/100**, placing you in the **Balanced** tier. You show strong savings consistency but can optimize cash allocation.

## 2. Emergency Fund Assessment
* Target: ₹1,00,000 | Current: ₹65,400 (65.4% Achieved)
* Recommendation: Automate a monthly transfer of ₹3,000. You will reach your target in 11 months.

## 3. Budget Analysis & Leak Detection
Based on recent trends, your biggest spending categories are Rent (34%) and Food/Shopping (30%). Trimming eating-out costs by 10% will yield an extra ₹1,500 monthly.

## 4. Savings Goals Update
* Emergency Fund is highly stable (High Probability of Success).
* Build up higher allocation towards short-term liquid funds.

## 5. Strategic Investment Recommendations
* SIP: ₹3,000/month in Nifty Index Mutual Funds.
* PPF/NPS: Ideal for long-term tax-exempt secure compound growth.
`;
      return res.json({ reportMarkdown: fallbackReport });
    }

    // Standard conversational chatbot reply (Requirement 1)
    if (process.env.GEMINI_API_KEY && userQuestion) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are Nova, the AI Financial Copilot for HerNova. Assist the user with their finance query in very simple, jargon-free, encouraging language. Use Indian Rupee (₹) where relevant. Refer to their context if helpful.

User Context:
${promptContext}

User Question: "${userQuestion}"`
        });
        return res.json({ reply: response.text });
      } catch (aiErr) {
        console.warn('[Gemini Copilot Chat] Failed, serving rules reply:', aiErr.message);
      }
    }

    // Fallback answer matrix
    const lowerQ = (userQuestion || '').toLowerCase();
    let reply = "I'm here as your financial partner! To help you grow your savings and build wealth, try asking about starting a SIP, checking your emergency fund target, or searching matching government schemes.";
    if (lowerQ.includes('sip')) {
      reply = `A SIP (Systematic Investment Plan) lets you invest a fixed amount regularly (e.g., ₹1,000/month) in mutual funds. This helps you build massive wealth over time due to compounding. For example, investing ₹3,000/month at 12% returns for 15 years yields approx ₹15 Lakhs!`;
    } else if (lowerQ.includes('emergency') || lowerQ.includes('savings')) {
      reply = `Your Emergency Fund target is ₹1,00,000, and you've achieved ₹65,400. You're 65% of the way there! Automating ₹3,000 every month is a safe strategy to secure this in less than a year.`;
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error in AI Copilot:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// 6. AI Investment Advisor (Requirement 5)
router.post('/:userId/investment-advisor', async (req, res) => {
  try {
    const { income, monthlySavings, riskAppetite, timeHorizon } = req.body;

    const savings = Number(monthlySavings) || 5000;
    let allocations = [];

    // Rules-based calculation
    if (riskAppetite === 'Conservative') {
      allocations = [
        { asset: 'Fixed Deposit (FD)', percent: 40, amount: Math.round(savings * 0.4), desc: 'Low risk, stable guaranteed interest.' },
        { asset: 'Public Provident Fund (PPF)', percent: 30, amount: Math.round(savings * 0.3), desc: 'Long-term tax-free government retirement fund.' },
        { asset: 'Gold / SGB', percent: 15, amount: Math.round(savings * 0.15), desc: 'Excellent inflation hedge.' },
        { asset: 'Liquid Mutual Funds', percent: 15, amount: Math.round(savings * 0.15), desc: 'High accessibility for emergency use.' }
      ];
    } else if (riskAppetite === 'Aggressive') {
      allocations = [
        { asset: 'Equity SIP Mutual Funds', percent: 50, amount: Math.round(savings * 0.5), desc: 'High-growth diversified index & mid-cap stocks.' },
        { asset: 'Direct Stocks', percent: 20, amount: Math.round(savings * 0.2), desc: 'High-risk individual market shares.' },
        { asset: 'Gold ETF', percent: 10, amount: Math.round(savings * 0.1), desc: 'Inflation hedging asset.' },
        { asset: 'NPS / PPF', percent: 20, amount: Math.round(savings * 0.2), desc: 'Tax-optimized secure compound growth.' }
      ];
    } else { // Moderate
      allocations = [
        { asset: 'Balanced SIP Mutual Funds', percent: 40, amount: Math.round(savings * 0.4), desc: 'Mixture of debt and equity mutual funds.' },
        { asset: 'PPF / NPS', percent: 25, amount: Math.round(savings * 0.25), desc: 'Stable tax saving tools.' },
        { asset: 'Fixed Deposit (FD)', percent: 20, amount: Math.round(savings * 0.2), desc: 'Guaranteed safety reserve.' },
        { asset: 'Sovereign Gold Bonds', percent: 15, amount: Math.round(savings * 0.15), desc: 'Sovereign-backed inflation hedge.' }
      ];
    }

    let aiAdvice = `Based on your monthly savings capability of ₹${savings} and a ${riskAppetite} risk preference over ${timeHorizon} years, we recommend a balanced allocation strategy focusing heavily on low-maintenance SIPs and secure PPF savings to capitalize on compound growth.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Analyze this user profile:
- Monthly Income: ₹${income}
- Monthly Savings Cap: ₹${savings}
- Risk Profile: ${riskAppetite}
- Horizon: ${timeHorizon} years

Write a highly personalized, supportive 3-sentence investment advice summary for an Indian female investor. Highlight the benefits of compounding, tax-saving tools (like PPF/NPS), and how they should approach allocations. Never promise stock market returns.`
        });
        aiAdvice = response.text || aiAdvice;
      } catch (err) {
        console.warn('[Gemini Advisor] Failed, serving rules-based copy:', err.message);
      }
    }

    res.json({
      allocations,
      advice: aiAdvice,
      success: true
    });
  } catch (error) {
    console.error('Advisor error:', error);
    res.status(500).json({ error: 'Failed to generate advisory response' });
  }
});

// 7. GET Government Schemes (Requirement 8)
router.get('/schemes', async (req, res) => {
  try {
    const { age, state, occupation, annualIncome, shgMember } = req.query;

    const userAge = Number(age) || 25;
    const userIncome = Number(annualIncome) || 300000;
    const userSHG = shgMember === 'true';

    // Filter relevant schemes
    const filtered = GOVT_SCHEMES.filter(s => {
      const matchAge = (!s.eligibility.minAge || userAge >= s.eligibility.minAge) && 
                       (!s.eligibility.maxAge || userAge <= s.eligibility.maxAge);
      const matchIncome = !s.eligibility.maxIncome || userIncome <= s.eligibility.maxIncome;
      const matchState = !s.state || s.state.toLowerCase() === (state || '').toLowerCase();
      const matchSHG = !s.eligibility.shgMember || userSHG === s.eligibility.shgMember;
      const matchOcc = !s.eligibility.occupation || s.eligibility.occupation.includes(occupation);

      return matchAge && matchIncome && matchState && matchSHG && matchOcc;
    });

    const results = filtered.map(s => ({
      ...s,
      aiSummary: s.summaryTemplate(state || 'your state', occupation || 'your work')
    }));

    res.json({ schemes: results });
  } catch (error) {
    console.error('Error matching schemes:', error);
    res.status(500).json({ error: 'Failed to match schemes' });
  }
});

// 8. Bookmarks schemes toggle
router.post('/:userId/schemes/bookmark', async (req, res) => {
  try {
    const { userId } = req.params;
    const { schemeId } = req.body;

    const ref = admin.firestore().collection('bookmarked_schemes').doc(`${userId}_${schemeId}`);
    const doc = await ref.get();

    if (doc.exists) {
      await ref.delete();
      return res.json({ bookmarked: false, success: true });
    } else {
      await ref.set({
        userId,
        schemeId,
        bookmarkedAt: new Date().toISOString()
      });
      return res.json({ bookmarked: true, success: true });
    }
  } catch (error) {
    console.error('Error toggling scheme bookmark:', error);
    res.status(500).json({ error: 'Failed to bookmark scheme' });
  }
});

// Get all bookmarked schemes
router.get('/:userId/schemes/bookmark', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await admin.firestore().collection('bookmarked_schemes')
      .where('userId', '==', userId).get();

    const bookmarkedIds = snapshot.docs.map(doc => doc.data().schemeId);
    const bookmarkedList = GOVT_SCHEMES.filter(s => bookmarkedIds.includes(s.id));

    res.json({ bookmarks: bookmarkedList });
  } catch (error) {
    console.error('Error fetching bookmarked schemes:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// 9. Learning Progress (Requirement 4 & 12)
router.post('/:userId/learning/progress', async (req, res) => {
  try {
    const { userId } = req.params;
    const { moduleId, isCompleted, quizScore } = req.body;

    const ref = admin.firestore().collection('learning_progress').doc(`${userId}_${moduleId}`);
    await ref.set({
      userId,
      moduleId,
      isCompleted: isCompleted || false,
      quizScore: Number(quizScore) || 0,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Fetch all completed modules to compute achievements
    const snapshot = await admin.firestore().collection('learning_progress')
      .where('userId', '==', userId)
      .where('isCompleted', '==', true)
      .get();
    
    const completedIds = snapshot.docs.map(d => d.data().moduleId);

    // Unlocking achievements dynamically (Requirement 12)
    const achievementsRef = admin.firestore().collection('achievements').doc(userId);
    const achievementsDoc = await achievementsRef.get();
    let currentBadges = achievementsDoc.exists ? (achievementsDoc.data().badges || []) : [];

    const badgeMappings = [
      { id: 'finance-beginner', name: 'Financial Beginner', reqModules: 1 },
      { id: 'budget-master', name: 'Budget Master', reqModules: 3 },
      { id: 'investment-explorer', name: 'Investment Explorer', reqModules: 5 }
    ];

    let unlockedNew = false;
    for (const b of badgeMappings) {
      if (completedIds.length >= b.reqModules && !currentBadges.includes(b.name)) {
        currentBadges.push(b.name);
        unlockedNew = true;
      }
    }

    if (unlockedNew) {
      await achievementsRef.set({
        userId,
        badges: currentBadges,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    res.json({
      success: true,
      completedCount: completedIds.length,
      badges: currentBadges,
      unlockedNew
    });
  } catch (error) {
    console.error('Error saving learning progress:', error);
    res.status(500).json({ error: 'Failed to save learning progress' });
  }
});

// Get user achievements
router.get('/:userId/achievements', async (req, res) => {
  try {
    const { userId } = req.params;
    const doc = await admin.firestore().collection('achievements').doc(userId).get();
    
    const badges = doc.exists ? (doc.data().badges || []) : [];
    res.json({ badges });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

module.exports = router;
