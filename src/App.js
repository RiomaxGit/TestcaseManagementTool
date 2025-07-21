import React, { useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Play,
  FileDown,
  Save,
  Upload,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Pie,
} from "recharts";

const TestManagementTool = () => {
  const [activeTab, setActiveTab] = useState("suites");
  const [testSuites, setTestSuites] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [selectedTestRun, setSelectedTestRun] = useState(null);

  const fileInputRef = useRef(null);

  // Test Suite Management
  const [suiteForm, setSuiteForm] = useState({ name: "", description: "" });
  const [editingSuite, setEditingSuite] = useState(null);
  const [expandedSuites, setExpandedSuites] = useState({});

  // Test Case Management
  const [caseForm, setCaseForm] = useState({
    name: "",
    testSteps: "",
    expectedResults: "",
  });
  const [editingCase, setEditingCase] = useState(null);
  const [activeSuite, setActiveSuite] = useState(null);

  // Test Run Management
  const [runForm, setRunForm] = useState({
    name: "",
    date: "",
    environment: "",
    selectedSuites: [],
  });
  const [editingRun, setEditingRun] = useState(null);

  // Test Suite Functions
  const addTestSuite = () => {
    if (suiteForm.name.trim()) {
      const newSuite = {
        id: Date.now(),
        name: suiteForm.name,
        description: suiteForm.description,
        testCases: [],
      };
      setTestSuites([...testSuites, newSuite]);
      setSuiteForm({ name: "", description: "" });
    }
  };

  const updateTestSuite = () => {
    setTestSuites(
      testSuites.map((suite) =>
        suite.id === editingSuite.id
          ? {
              ...suite,
              name: suiteForm.name,
              description: suiteForm.description,
            }
          : suite
      )
    );
    setEditingSuite(null);
    setSuiteForm({ name: "", description: "" });
  };

  const deleteTestSuite = (suiteId) => {
    setTestSuites(testSuites.filter((suite) => suite.id !== suiteId));
  };

  const toggleSuite = (suiteId) => {
    setExpandedSuites((prev) => ({ ...prev, [suiteId]: !prev[suiteId] }));
  };

  // Test Case Functions
  const addTestCase = (suiteId) => {
    if (caseForm.name.trim()) {
      const newCase = {
        id: Date.now(),
        name: caseForm.name,
        testSteps: caseForm.testSteps,
        expectedResults: caseForm.expectedResults,
      };
      setTestSuites(
        testSuites.map((suite) =>
          suite.id === suiteId
            ? { ...suite, testCases: [...suite.testCases, newCase] }
            : suite
        )
      );
      setCaseForm({ name: "", testSteps: "", expectedResults: "" });
      setActiveSuite(null);
    }
  };

  const updateTestCase = (suiteId) => {
    setTestSuites(
      testSuites.map((suite) =>
        suite.id === suiteId
          ? {
              ...suite,
              testCases: suite.testCases.map((testCase) =>
                testCase.id === editingCase.id
                  ? {
                      ...testCase,
                      name: caseForm.name,
                      testSteps: caseForm.testSteps,
                      expectedResults: caseForm.expectedResults,
                    }
                  : testCase
              ),
            }
          : suite
      )
    );
    setEditingCase(null);
    setCaseForm({ name: "", testSteps: "", expectedResults: "" });
  };

  const deleteTestCase = (suiteId, caseId) => {
    setTestSuites(
      testSuites.map((suite) =>
        suite.id === suiteId
          ? {
              ...suite,
              testCases: suite.testCases.filter(
                (testCase) => testCase.id !== caseId
              ),
            }
          : suite
      )
    );
  };

  // Test Run Functions
  const addTestRun = () => {
    if (
      runForm.name.trim() &&
      runForm.date &&
      runForm.environment &&
      runForm.selectedSuites.length > 0
    ) {
      const selectedSuitesData = testSuites.filter((suite) =>
        runForm.selectedSuites.includes(suite.id)
      );
      const testRunCases = selectedSuitesData.flatMap((suite) =>
        suite.testCases.map((testCase) => ({
          ...testCase,
          suiteId: suite.id,
          suiteName: suite.name,
          status: "pending",
          comment: "",
        }))
      );

      const newRun = {
        id: Date.now(),
        name: runForm.name,
        date: runForm.date,
        environment: runForm.environment,
        suites: selectedSuitesData,
        testCases: testRunCases,
        completed: false,
      };
      setTestRuns([...testRuns, newRun]);
      setRunForm({ name: "", date: "", environment: "", selectedSuites: [] });
    }
  };

  const updateTestRun = () => {
    if (
      runForm.name.trim() &&
      runForm.date &&
      runForm.environment &&
      runForm.selectedSuites.length > 0
    ) {
      const selectedSuitesData = testSuites.filter((suite) =>
        runForm.selectedSuites.includes(suite.id)
      );
      const testRunCases = selectedSuitesData.flatMap((suite) =>
        suite.testCases.map((testCase) => {
          const existingCase = editingRun.testCases.find(
            (tc) => tc.id === testCase.id && tc.suiteId === suite.id
          );
          return {
            ...testCase,
            suiteId: suite.id,
            suiteName: suite.name,
            status: existingCase ? existingCase.status : "pending",
            comment: existingCase ? existingCase.comment : "",
          };
        })
      );

      setTestRuns(
        testRuns.map((run) =>
          run.id === editingRun.id
            ? {
                ...run,
                name: runForm.name,
                date: runForm.date,
                environment: runForm.environment,
                suites: selectedSuitesData,
                testCases: testRunCases,
              }
            : run
        )
      );
      setEditingRun(null);
      setRunForm({ name: "", date: "", environment: "", selectedSuites: [] });
    }
  };

  const deleteTestRun = (runId) => {
    setTestRuns(testRuns.filter((run) => run.id !== runId));
  };

  const updateTestCaseStatus = (runId, caseId, suiteId, status, comment) => {
    setTestRuns(
      testRuns.map((run) =>
        run.id === runId
          ? {
              ...run,
              testCases: run.testCases.map((testCase) =>
                testCase.id === caseId && testCase.suiteId === suiteId
                  ? { ...testCase, status, comment }
                  : testCase
              ),
            }
          : run
      )
    );
  };

  const markTestRunComplete = (runId) => {
    setTestRuns(
      testRuns.map((run) =>
        run.id === runId ? { ...run, completed: true } : run
      )
    );
  };

  // Print Report Functions
  const printReportPage = () => {
    const reportData = getReportData(selectedTestRun);
    const suiteData = selectedTestRun.suites.map((suite) => {
      const suiteCases = selectedTestRun.testCases.filter(
        (tc) => tc.suiteId === suite.id
      );
      const passed = suiteCases.filter((tc) => tc.status === "passed").length;
      const failed = suiteCases.filter((tc) => tc.status === "failed").length;
      const pending = suiteCases.filter((tc) => tc.status === "pending").length;
      const total = suiteCases.length;
      const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
      return { name: suite.name, passed, failed, pending, total, passRate };
    });

    const printWindow = window.open("", "", "height=600,width=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>Test Report - ${selectedTestRun?.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: white;
              color: black;
              line-height: 1.6;
            }
            .report-container { 
              max-width: 800px; 
              margin: 0 auto; 
            }
            .report-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            .report-title {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
            }
            .report-info {
              font-size: 14px;
              color: #666;
            }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 16px; 
              margin-bottom: 30px; 
            }
            .stat-card { 
              padding: 16px; 
              border-radius: 8px; 
              text-align: center; 
              color: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .stat-total { background-color: #3B82F6; }
            .stat-passed { background-color: #10B981; }
            .stat-failed { background-color: #EF4444; }
            .stat-pending { background-color: #F59E0B; }
            .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 4px; }
            .stat-label { font-size: 12px; opacity: 0.9; }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 15px;
              margin-top: 30px;
            }
            .suite-summary {
              margin-bottom: 30px;
            }
            .suite-item {
              background-color: #f8f9fa;
              padding: 12px;
              margin-bottom: 8px;
              border-radius: 6px;
              border-left: 4px solid #3B82F6;
            }
            .suite-name {
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 4px;
            }
            .suite-stats {
              font-size: 14px;
              color: #666;
            }
            .table-container { 
              margin-top: 20px;
              border: 1px solid #ddd; 
              border-radius: 8px; 
              overflow: hidden;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            th, td { 
              padding: 12px; 
              text-align: left; 
              border-bottom: 1px solid #eee; 
            }
            th { 
              background-color: #f8f9fa; 
              font-weight: bold; 
              color: #1f2937;
            }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .status-passed { 
              background-color: #10B981; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-failed { 
              background-color: #EF4444; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending { 
              background-color: #F59E0B; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: bold;
              text-transform: uppercase;
            }
            @media print {
              .no-print { display: none !important; }
              body { margin: 10px; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="report-header">
              <div class="report-title">Test Run Report</div>
              <div class="report-info">
                <strong>${selectedTestRun.name}</strong> • ${
      selectedTestRun.date
    } • ${selectedTestRun.environment} • 
                <span style="color: ${
                  selectedTestRun.completed ? "#10B981" : "#F59E0B"
                }">
                  ${selectedTestRun.completed ? "Completed" : "In Progress"}
                </span>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card stat-total">
                <div class="stat-value">${reportData.total}</div>
                <div class="stat-label">Total Cases</div>
              </div>
              <div class="stat-card stat-passed">
                <div class="stat-value">${reportData.passed}</div>
                <div class="stat-label">Passed</div>
              </div>
              <div class="stat-card stat-failed">
                <div class="stat-value">${reportData.failed}</div>
                <div class="stat-label">Failed</div>
              </div>
              <div class="stat-card stat-pending">
                <div class="stat-value">${reportData.pending}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>

            <div class="suite-summary">
              <div class="section-title">Test Suite Summary</div>
              ${suiteData
                .map(
                  (suite) => `
                <div class="suite-item">
                  <div class="suite-name">${suite.name}</div>
                  <div class="suite-stats">
                    Total: ${suite.total} | Passed: ${suite.passed} | Failed: ${suite.failed} | Pending: ${suite.pending} | Pass Rate: ${suite.passRate}%
                  </div>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="section-title page-break">Detailed Test Results</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Test Suite</th>
                    <th>Test Case</th>
                    <th>Status</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedTestRun.testCases
                    .map(
                      (tc) => `
                    <tr>
                      <td>${tc.suiteName}</td>
                      <td>${tc.name}</td>
                      <td><span class="status-${tc.status}">${
                        tc.status
                      }</span></td>
                      <td>${tc.comment || "No comment"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
  const getReportData = (run) => {
    const passed = run.testCases.filter((tc) => tc.status === "passed").length;
    const failed = run.testCases.filter((tc) => tc.status === "failed").length;
    const pending = run.testCases.filter(
      (tc) => tc.status === "pending"
    ).length;
    const total = run.testCases.length;

    return {
      passed,
      failed,
      pending,
      total,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
    };
  };

  const downloadReport = (run) => {
    const reportData = getReportData(run);

    // Create a comprehensive text report
    const reportText = `
TEST RUN REPORT
===============

Test Run: ${run.name}
Date: ${run.date}
Environment: ${run.environment}
Status: ${run.completed ? "Completed" : "In Progress"}

SUMMARY
=======
Total Test Cases: ${reportData.total}
Passed: ${reportData.passed}
Failed: ${reportData.failed}
Pending: ${reportData.pending}
Pass Rate: ${reportData.passRate}%

DETAILED RESULTS
================
${run.testCases
  .map(
    (tc) => `
Suite: ${tc.suiteName}
Test Case: ${tc.name}
Status: ${tc.status.toUpperCase()}
Comment: ${tc.comment || "No comment"}
---
`
  )
  .join("")}

SUITE BREAKDOWN
===============
${run.suites
  .map((suite) => {
    const suiteCases = run.testCases.filter((tc) => tc.suiteId === suite.id);
    const passed = suiteCases.filter((tc) => tc.status === "passed").length;
    const failed = suiteCases.filter((tc) => tc.status === "failed").length;
    const pending = suiteCases.filter((tc) => tc.status === "pending").length;
    const total = suiteCases.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    return `
${suite.name}:
  Total: ${total}
  Passed: ${passed}
  Failed: ${failed}
  Pending: ${pending}
  Pass Rate: ${passRate}%
`;
  })
  .join("")}
    `;

    // Create and download the report as a text file
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${run.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Data Management Functions
  const saveData = () => {
    const data = { testSuites, testRuns };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-management-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.testSuites) setTestSuites(data.testSuites);
          if (data.testRuns) setTestRuns(data.testRuns);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  // UI Components
  const renderTestSuites = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingSuite ? "Edit Test Suite" : "Add Test Suite"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Suite Name"
            value={suiteForm.name}
            onChange={(e) =>
              setSuiteForm({ ...suiteForm, name: e.target.value })
            }
            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            value={suiteForm.description}
            onChange={(e) =>
              setSuiteForm({ ...suiteForm, description: e.target.value })
            }
            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={editingSuite ? updateTestSuite : addTestSuite}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          {editingSuite ? "Update Suite" : "Add Suite"}
        </button>
      </div>

      <div className="space-y-4">
        {testSuites.map((suite) => (
          <div key={suite.id} className="bg-gray-800 rounded-lg">
            <div className="p-4 flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleSuite(suite.id)}
              >
                {expandedSuites[suite.id] ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
                <div>
                  <h4 className="text-white font-medium">{suite.name}</h4>
                  <p className="text-gray-400 text-sm">{suite.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSuite(suite);
                    setSuiteForm({
                      name: suite.name,
                      description: suite.description,
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteTestSuite(suite.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedSuites[suite.id] && (
              <div className="px-4 pb-4 border-t border-gray-700">
                {activeSuite === suite.id && (
                  <div className="mt-4 p-4 bg-gray-700 rounded">
                    <h5 className="text-white font-medium mb-3">
                      {editingCase ? "Edit Test Case" : "Add Test Case"}
                    </h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Test Case Name"
                        value={caseForm.name}
                        onChange={(e) =>
                          setCaseForm({ ...caseForm, name: e.target.value })
                        }
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 outline-none"
                      />
                      <textarea
                        placeholder="Test Steps"
                        value={caseForm.testSteps}
                        onChange={(e) =>
                          setCaseForm({
                            ...caseForm,
                            testSteps: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 outline-none"
                      />
                      <textarea
                        placeholder="Expected Results"
                        value={caseForm.expectedResults}
                        onChange={(e) =>
                          setCaseForm({
                            ...caseForm,
                            expectedResults: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            editingCase
                              ? updateTestCase(suite.id)
                              : addTestCase(suite.id)
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          {editingCase ? "Update" : "Add"} Test Case
                        </button>
                        <button
                          onClick={() => {
                            setActiveSuite(null);
                            setEditingCase(null);
                            setCaseForm({
                              name: "",
                              testSteps: "",
                              expectedResults: "",
                            });
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-white font-medium">
                      Test Cases ({suite.testCases.length})
                    </h5>
                    <button
                      onClick={() => setActiveSuite(suite.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Case
                    </button>
                  </div>

                  {suite.testCases.map((testCase) => (
                    <div
                      key={testCase.id}
                      className="bg-gray-600 p-3 rounded mb-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h6 className="text-white font-medium">
                            {testCase.name}
                          </h6>
                          <p className="text-gray-300 text-sm mt-1">
                            <strong>Steps:</strong> {testCase.testSteps}
                          </p>
                          <p className="text-gray-300 text-sm mt-1">
                            <strong>Expected:</strong>{" "}
                            {testCase.expectedResults}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingCase(testCase);
                              setActiveSuite(suite.id);
                              setCaseForm({
                                name: testCase.name,
                                testSteps: testCase.testSteps,
                                expectedResults: testCase.expectedResults,
                              });
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() =>
                              deleteTestCase(suite.id, testCase.id)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestRuns = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingRun ? "Edit Test Run" : "Add Test Run"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Run Name"
            value={runForm.name}
            onChange={(e) => setRunForm({ ...runForm, name: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
          <input
            type="date"
            value={runForm.date}
            onChange={(e) => setRunForm({ ...runForm, date: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Environment"
            value={runForm.environment}
            onChange={(e) =>
              setRunForm({ ...runForm, environment: e.target.value })
            }
            className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Select Test Suites:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {testSuites.map((suite) => (
              <label
                key={suite.id}
                className="flex items-center gap-2 text-white"
              >
                <input
                  type="checkbox"
                  checked={runForm.selectedSuites.includes(suite.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRunForm({
                        ...runForm,
                        selectedSuites: [...runForm.selectedSuites, suite.id],
                      });
                    } else {
                      setRunForm({
                        ...runForm,
                        selectedSuites: runForm.selectedSuites.filter(
                          (id) => id !== suite.id
                        ),
                      });
                    }
                  }}
                  className="rounded"
                />
                <span>
                  {suite.name} ({suite.testCases.length} cases)
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={editingRun ? updateTestRun : addTestRun}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Play size={16} />
          {editingRun ? "Update Run" : "Create Run"}
        </button>
      </div>

      <div className="space-y-4">
        {testRuns.map((run) => (
          <div key={run.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold text-lg">{run.name}</h4>
                <div className="text-gray-400 text-sm">
                  <span>Date: {run.date}</span> |
                  <span className="ml-2">Environment: {run.environment}</span> |
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      run.completed ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {run.completed ? "Completed" : "In Progress"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingRun(run);
                    setRunForm({
                      name: run.name,
                      date: run.date,
                      environment: run.environment,
                      selectedSuites: run.suites.map((s) => s.id),
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteTestRun(run.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-white font-medium mb-2">Test Cases:</h5>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {run.testCases.map((testCase) => (
                  <div
                    key={`${testCase.id}-${testCase.suiteId}`}
                    className="bg-gray-700 p-3 rounded"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-gray-300 text-sm">
                          {testCase.suiteName}
                        </span>
                        <h6 className="text-white font-medium">
                          {testCase.name}
                        </h6>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={testCase.status}
                          onChange={(e) =>
                            updateTestCaseStatus(
                              run.id,
                              testCase.id,
                              testCase.suiteId,
                              e.target.value,
                              testCase.comment
                            )
                          }
                          className={`px-2 py-1 rounded text-sm ${
                            testCase.status === "passed"
                              ? "bg-green-600"
                              : testCase.status === "failed"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          } text-white`}
                        >
                          <option value="pending">Pending</option>
                          <option value="passed">Passed</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>
                    <textarea
                      placeholder="Add comment..."
                      value={testCase.comment}
                      onChange={(e) =>
                        updateTestCaseStatus(
                          run.id,
                          testCase.id,
                          testCase.suiteId,
                          testCase.status,
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm"
                      rows="1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {!run.completed && (
              <button
                onClick={() => markTestRunComplete(run.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Mark as Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Test Run Reports
        </h3>
        <select
          value={selectedTestRun?.id || ""}
          onChange={(e) => {
            const run = testRuns.find((r) => r.id === parseInt(e.target.value));
            setSelectedTestRun(run);
          }}
          className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none w-full md:w-auto"
        >
          <option value="">Select a test run</option>
          {testRuns.map((run) => (
            <option key={run.id} value={run.id}>
              {run.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTestRun && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-white">
                Report: {selectedTestRun.name}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadReport(selectedTestRun)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <FileDown size={16} />
                  Download Report
                </button>
                <button
                  onClick={printReportPage}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
                >
                  <FileDown size={16} />
                  Print Report Page
                </button>
              </div>
            </div>

            {(() => {
              const reportData = getReportData(selectedTestRun);
              const pieData = [
                { name: "Passed", value: reportData.passed, color: "#10B981" },
                { name: "Failed", value: reportData.failed, color: "#EF4444" },
                {
                  name: "Pending",
                  value: reportData.pending,
                  color: "#F59E0B",
                },
              ].filter((item) => item.value > 0);

              const suiteData = selectedTestRun.suites.map((suite) => {
                const suiteCases = selectedTestRun.testCases.filter(
                  (tc) => tc.suiteId === suite.id
                );
                const passed = suiteCases.filter(
                  (tc) => tc.status === "passed"
                ).length;
                const failed = suiteCases.filter(
                  (tc) => tc.status === "failed"
                ).length;
                const pending = suiteCases.filter(
                  (tc) => tc.status === "pending"
                ).length;
                return {
                  name: suite.name,
                  passed,
                  failed,
                  pending,
                  total: suiteCases.length,
                };
              });

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-600 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {reportData.total}
                      </div>
                      <div className="text-blue-100">Total Cases</div>
                    </div>
                    <div className="bg-green-600 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {reportData.passed}
                      </div>
                      <div className="text-green-100">Passed</div>
                    </div>
                    <div className="bg-red-600 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {reportData.failed}
                      </div>
                      <div className="text-red-100">Failed</div>
                    </div>
                    <div className="bg-yellow-600 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {reportData.pending}
                      </div>
                      <div className="text-yellow-100">Pending</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h5 className="text-white font-semibold mb-4">
                        Test Results Distribution
                      </h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Tooltip />
                          <RechartsPieChart
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </RechartsPieChart>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h5 className="text-white font-semibold mb-4">
                        Results by Test Suite
                      </h5>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={suiteData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="passed" stackId="a" fill="#10B981" />
                          <Bar dataKey="failed" stackId="a" fill="#EF4444" />
                          <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h5 className="text-white font-semibold mb-4">
                      Pass Rate by Suite
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={suiteData.map((suite) => ({
                          ...suite,
                          passRate:
                            suite.total > 0
                              ? ((suite.passed / suite.total) * 100).toFixed(1)
                              : 0,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Line
                          type="monotone"
                          dataKey="passRate"
                          stroke="#3B82F6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <h5 className="text-white font-semibold p-4 bg-gray-600">
                      Detailed Test Results
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-600">
                          <tr>
                            <th className="text-white p-3 text-left">Suite</th>
                            <th className="text-white p-3 text-left">
                              Test Case
                            </th>
                            <th className="text-white p-3 text-left">Status</th>
                            <th className="text-white p-3 text-left">
                              Comment
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTestRun.testCases.map((testCase, index) => (
                            <tr
                              key={`${testCase.id}-${testCase.suiteId}`}
                              className={
                                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                              }
                            >
                              <td className="text-gray-300 p-3">
                                {testCase.suiteName}
                              </td>
                              <td className="text-white p-3">
                                {testCase.name}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    testCase.status === "passed"
                                      ? "bg-green-600"
                                      : testCase.status === "failed"
                                      ? "bg-red-600"
                                      : "bg-yellow-600"
                                  } text-white`}
                                >
                                  {testCase.status.charAt(0).toUpperCase() +
                                    testCase.status.slice(1)}
                                </span>
                              </td>
                              <td className="text-gray-300 p-3">
                                {testCase.comment || "No comment"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">
              Test Management Tool
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={saveData}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Save size={16} />
                Save Data
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
              >
                <Upload size={16} />
                Import Data
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "suites", label: "Test Suites", icon: <Edit2 size={16} /> },
              { id: "runs", label: "Test Runs", icon: <Play size={16} /> },
              {
                id: "reports",
                label: "Reports",
                icon: <BarChart3 size={16} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "suites" && renderTestSuites()}
        {activeTab === "runs" && renderTestRuns()}
        {activeTab === "reports" && renderReports()}
      </div>
    </div>
  );
};
export default TestManagementTool;
