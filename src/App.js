import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Save,
  Upload,
  Edit2,
  Check,
  X,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Pie,
} from "recharts";

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [incomeCategories, setIncomeCategories] = useState([
    "Salary",
    "Freelance",
    "Dividends",
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    "Rent",
    "Food",
    "Travel",
    "Entertainment",
  ]);
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // Form states
  const [newIncomeCategory, setNewIncomeCategory] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [transactionForm, setTransactionForm] = useState({
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
  });
  const [investmentForm, setInvestmentForm] = useState({
    action: "buy",
    ticker: "",
    shares: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Calculate total balance
  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === "income"
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
  };

  // Calculate investment balance
  const calculateInvestmentBalance = () => {
    return investments.reduce((acc, investment) => {
      return investment.type === "buy"
        ? acc - investment.total
        : acc + investment.total;
    }, 0);
  };

  // Calculate available balance (total balance - investment balance)
  const getAvailableBalance = () => {
    return calculateBalance() + calculateInvestmentBalance();
  };

  // Get monthly data
  const getMonthlyData = (month, year) => {
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() + 1 === month && tDate.getFullYear() === year;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactions: monthTransactions,
    };
  };

  // Get category breakdown
  const getCategoryBreakdown = (type, month = null, year = null) => {
    let filteredTransactions = transactions.filter((t) => t.type === type);

    if (month && year) {
      filteredTransactions = filteredTransactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() + 1 === month && tDate.getFullYear() === year;
      });
    }

    const breakdown = {};
    filteredTransactions.forEach((t) => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });

    return Object.entries(breakdown).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  // Get monthly trends
  const getMonthlyTrends = () => {
    const trends = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!trends[key]) {
        trends[key] = { month: key, income: 0, expense: 0 };
      }
      trends[key][t.type] += t.amount;
    });

    return Object.values(trends)
      .map((t) => ({
        ...t,
        balance: t.income - t.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Portfolio calculations
  const getPortfolio = () => {
    const portfolio = {};
    investments.forEach((inv) => {
      if (!portfolio[inv.ticker]) {
        portfolio[inv.ticker] = { shares: 0, totalCost: 0, avgPrice: 0 };
      }

      if (inv.type === "buy") {
        portfolio[inv.ticker].shares += inv.shares;
        portfolio[inv.ticker].totalCost += inv.total;
      } else {
        portfolio[inv.ticker].shares -= inv.shares;
        portfolio[inv.ticker].totalCost -=
          inv.shares * portfolio[inv.ticker].avgPrice;
      }

      if (portfolio[inv.ticker].shares > 0) {
        portfolio[inv.ticker].avgPrice =
          portfolio[inv.ticker].totalCost / portfolio[inv.ticker].shares;
      }
    });

    return Object.entries(portfolio)
      .filter(([_, data]) => data.shares > 0)
      .map(([ticker, data]) => ({
        ticker,
        shares: data.shares,
        avgPrice: data.avgPrice,
        totalValue: data.shares * data.avgPrice,
      }));
  };

  // Calculate total P&L
  const calculatePL = () => {
    return investments
      .filter((inv) => inv.type === "sell")
      .reduce((total, inv) => total + inv.profitLoss, 0);
  };

  // Handle category editing
  const handleCategoryEdit = (type, index, value) => {
    if (type === "income") {
      const newCategories = [...incomeCategories];
      newCategories[index] = value;
      setIncomeCategories(newCategories);
    } else {
      const newCategories = [...expenseCategories];
      newCategories[index] = value;
      setExpenseCategories(newCategories);
    }
    setEditingCategory(null);
    setEditingValue("");
  };

  // Handle adding categories
  const handleAddCategory = (type) => {
    if (type === "income" && newIncomeCategory.trim()) {
      setIncomeCategories([...incomeCategories, newIncomeCategory.trim()]);
      setNewIncomeCategory("");
    } else if (type === "expense" && newExpenseCategory.trim()) {
      setExpenseCategories([...expenseCategories, newExpenseCategory.trim()]);
      setNewExpenseCategory("");
    }
  };

  // Handle deleting categories
  const handleDeleteCategory = (type, index) => {
    if (type === "income") {
      setIncomeCategories(incomeCategories.filter((_, i) => i !== index));
    } else {
      setExpenseCategories(expenseCategories.filter((_, i) => i !== index));
    }
  };

  // Handle transaction submission
  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    if (transactionForm.category && transactionForm.amount) {
      const newTransaction = {
        id: Date.now(),
        type: transactionForm.type,
        date: transactionForm.date,
        category: transactionForm.category,
        amount: parseFloat(transactionForm.amount),
      };
      setTransactions([...transactions, newTransaction]);
      setTransactionForm({
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        category: "",
        amount: "",
      });
    }
  };

  // Handle investment submission
  const handleInvestmentSubmit = (e) => {
    e.preventDefault();
    if (
      investmentForm.ticker &&
      investmentForm.shares &&
      investmentForm.price
    ) {
      const shares = parseInt(investmentForm.shares);
      const price = parseFloat(investmentForm.price);
      const total = shares * price;

      if (investmentForm.action === "buy") {
        if (getAvailableBalance() >= total) {
          const newInvestment = {
            id: Date.now(),
            type: "buy",
            ticker: investmentForm.ticker.toUpperCase(),
            shares,
            price,
            total,
            date: investmentForm.date,
          };
          setInvestments([...investments, newInvestment]);
        } else {
          alert("Insufficient balance for this purchase");
          return;
        }
      } else {
        // Sell logic
        const portfolio = getPortfolio();
        const holding = portfolio.find(
          (p) => p.ticker === investmentForm.ticker.toUpperCase()
        );

        if (!holding || holding.shares < shares) {
          alert("Insufficient shares to sell");
          return;
        }

        const profitLoss = (price - holding.avgPrice) * shares;
        const newInvestment = {
          id: Date.now(),
          type: "sell",
          ticker: investmentForm.ticker.toUpperCase(),
          shares,
          price,
          total,
          profitLoss,
          date: investmentForm.date,
        };
        setInvestments([...investments, newInvestment]);
      }

      setInvestmentForm({
        action: "buy",
        ticker: "",
        shares: "",
        price: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  // Save data to JSON
  const saveData = () => {
    const data = {
      incomeCategories,
      expenseCategories,
      transactions,
      investments,
      savedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load data from JSON
  const loadData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setIncomeCategories(data.incomeCategories || []);
          setExpenseCategories(data.expenseCategories || []);
          setTransactions(data.transactions || []);
          setInvestments(data.investments || []);
          alert("Data loaded successfully!");
        } catch (error) {
          alert("Error loading file: Invalid JSON format");
        }
      };
      reader.readAsText(file);
    }
  };

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#8dd1e1",
    "#d084d0",
  ];
  const monthlyData = getMonthlyData(selectedMonth, selectedYear);
  const currentMonthIncome = getCategoryBreakdown(
    "income",
    selectedMonth,
    selectedYear
  );
  const currentMonthExpense = getCategoryBreakdown(
    "expense",
    selectedMonth,
    selectedYear
  );
  const allTimeIncome = getCategoryBreakdown("income");
  const allTimeExpense = getCategoryBreakdown("expense");
  const monthlyTrends = getMonthlyTrends();
  const portfolio = getPortfolio();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Personal Finance Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={saveData}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Save size={16} />
              Save Data
            </button>
            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors cursor-pointer">
              <Upload size={16} />
              Load Data
              <input
                type="file"
                accept=".json"
                onChange={loadData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex gap-6">
          {["dashboard", "transactions", "investments", "setup"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Month/Year Selector */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Analytics Period
              </h2>
              <div className="flex gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={2020 + i} value={2020 + i}>
                        {2020 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-green-500" size={24} />
                  <h3 className="text-lg font-semibold">Total Balance</h3>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  ${calculateBalance().toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-blue-500" size={24} />
                  <h3 className="text-lg font-semibold">Available Balance</h3>
                </div>
                <p className="text-2xl font-bold text-blue-500">
                  ${getAvailableBalance().toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-green-500" size={24} />
                  <h3 className="text-lg font-semibold">Monthly Income</h3>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  ${monthlyData.income.toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="text-red-500" size={24} />
                  <h3 className="text-lg font-semibold">Monthly Expense</h3>
                </div>
                <p className="text-2xl font-bold text-red-500">
                  ${monthlyData.expense.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Income Breakdown */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Monthly Income Breakdown
                </h3>
                {currentMonthIncome.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={currentMonthIncome}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) =>
                          `${name}: $${value.toFixed(2)}`
                        }
                      >
                        {currentMonthIncome.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-20">
                    No income data for selected month
                  </p>
                )}
              </div>

              {/* Monthly Expense Breakdown */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Monthly Expense Breakdown
                </h3>
                {currentMonthExpense.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={currentMonthExpense}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) =>
                          `${name}: $${value.toFixed(2)}`
                        }
                      >
                        {currentMonthExpense.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-20">
                    No expense data for selected month
                  </p>
                )}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                      }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#EF4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-20">
                  No data available for trends
                </p>
              )}
            </div>

            {/* All-Time Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  All-Time Income Categories
                </h3>
                {allTimeIncome.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={allTimeIncome}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        formatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <Bar dataKey="value" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-20">
                    No income data available
                  </p>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  All-Time Expense Categories
                </h3>
                {allTimeExpense.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={allTimeExpense}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        formatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <Bar dataKey="value" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-20">
                    No expense data available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            {/* Transaction Form */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              <form
                onSubmit={handleTransactionSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={transactionForm.type}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        type: e.target.value,
                        category: "",
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {(transactionForm.type === "income"
                      ? incomeCategories
                      : expenseCategories
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        amount: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Recent Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-300">Date</th>
                      <th className="pb-3 text-gray-300">Type</th>
                      <th className="pb-3 text-gray-300">Category</th>
                      <th className="pb-3 text-gray-300">Amount</th>
                      <th className="pb-3 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .slice(-10)
                      .reverse()
                      .map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-700"
                        >
                          <td className="py-3">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                transaction.type === "income"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-red-900 text-red-300"
                              }`}
                            >
                              {transaction.type}
                            </span>
                          </td>
                          <td className="py-3">{transaction.category}</td>
                          <td className="py-3">
                            <span
                              className={
                                transaction.type === "income"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {transaction.type === "income" ? "+" : "-"}$
                              {transaction.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() =>
                                setTransactions(
                                  transactions.filter(
                                    (t) => t.id !== transaction.id
                                  )
                                )
                              }
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {transactions.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Investments */}
        {activeTab === "investments" && (
          <div className="space-y-6">
            {/* Investment Form */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Investment Transaction
              </h2>
              <form
                onSubmit={handleInvestmentSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Action
                  </label>
                  <select
                    value={investmentForm.action}
                    onChange={(e) =>
                      setInvestmentForm({
                        ...investmentForm,
                        action: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ticker Symbol
                  </label>
                  <input
                    type="text"
                    value={investmentForm.ticker}
                    onChange={(e) =>
                      setInvestmentForm({
                        ...investmentForm,
                        ticker: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., AAPL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shares
                  </label>
                  <input
                    type="number"
                    value={investmentForm.shares}
                    onChange={(e) =>
                      setInvestmentForm({
                        ...investmentForm,
                        shares: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price per Share
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={investmentForm.price}
                    onChange={(e) =>
                      setInvestmentForm({
                        ...investmentForm,
                        price: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={investmentForm.date}
                    onChange={(e) =>
                      setInvestmentForm({
                        ...investmentForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {investmentForm.action === "buy"
                      ? "Buy Stock"
                      : "Sell Stock"}
                  </button>
                </div>
              </form>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Portfolio Value</h3>
                <p className="text-2xl font-bold text-blue-500">
                  $
                  {portfolio
                    .reduce((sum, stock) => sum + stock.totalValue, 0)
                    .toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Total P&L</h3>
                <p
                  className={`text-2xl font-bold ${
                    calculatePL() >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {calculatePL() >= 0 ? "+" : ""}${calculatePL().toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Available Cash</h3>
                <p className="text-2xl font-bold text-green-500">
                  ${getAvailableBalance().toFixed(2)}
                </p>
              </div>
            </div>

            {/* Current Portfolio */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Portfolio</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-300">Ticker</th>
                      <th className="pb-3 text-gray-300">Shares</th>
                      <th className="pb-3 text-gray-300">Avg Price</th>
                      <th className="pb-3 text-gray-300">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((stock) => (
                      <tr
                        key={stock.ticker}
                        className="border-b border-gray-700"
                      >
                        <td className="py-3 font-medium">{stock.ticker}</td>
                        <td className="py-3">{stock.shares}</td>
                        <td className="py-3">${stock.avgPrice.toFixed(2)}</td>
                        <td className="py-3">${stock.totalValue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {portfolio.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    No stocks in portfolio
                  </p>
                )}
              </div>
            </div>

            {/* Investment History */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Investment History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-300">Date</th>
                      <th className="pb-3 text-gray-300">Action</th>
                      <th className="pb-3 text-gray-300">Ticker</th>
                      <th className="pb-3 text-gray-300">Shares</th>
                      <th className="pb-3 text-gray-300">Price</th>
                      <th className="pb-3 text-gray-300">Total</th>
                      <th className="pb-3 text-gray-300">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments
                      .slice(-10)
                      .reverse()
                      .map((investment) => (
                        <tr
                          key={investment.id}
                          className="border-b border-gray-700"
                        >
                          <td className="py-3">
                            {new Date(investment.date).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                investment.type === "buy"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-red-900 text-red-300"
                              }`}
                            >
                              {investment.type}
                            </span>
                          </td>
                          <td className="py-3 font-medium">
                            {investment.ticker}
                          </td>
                          <td className="py-3">{investment.shares}</td>
                          <td className="py-3">
                            ${investment.price.toFixed(2)}
                          </td>
                          <td className="py-3">
                            ${investment.total.toFixed(2)}
                          </td>
                          <td className="py-3">
                            {investment.profitLoss !== undefined ? (
                              <span
                                className={
                                  investment.profitLoss >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {investment.profitLoss >= 0 ? "+" : ""}$
                                {investment.profitLoss.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {investments.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    No investment history
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Setup Center */}
        {activeTab === "setup" && (
          <div className="space-y-6">
            {/* Income Categories */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
              <div className="space-y-3">
                {incomeCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3"
                  >
                    {editingCategory === `income-${index}` ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          autoFocus
                        />
                        <button
                          onClick={() =>
                            handleCategoryEdit("income", index, editingValue)
                          }
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setEditingValue("");
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-white">{category}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(`income-${index}`);
                              setEditingValue(category);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategory("income", index)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIncomeCategory}
                    onChange={(e) => setNewIncomeCategory(e.target.value)}
                    placeholder="New income category"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCategory("income")
                    }
                  />
                  <button
                    onClick={() => handleAddCategory("income")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
              <div className="space-y-3">
                {expenseCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3"
                  >
                    {editingCategory === `expense-${index}` ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          autoFocus
                        />
                        <button
                          onClick={() =>
                            handleCategoryEdit("expense", index, editingValue)
                          }
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setEditingValue("");
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-white">{category}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(`expense-${index}`);
                              setEditingValue(category);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategory("expense", index)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    placeholder="New expense category"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCategory("expense")
                    }
                  />
                  <button
                    onClick={() => handleAddCategory("expense")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
