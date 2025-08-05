// Global variables
let arChart = null;
let cashFlowChart = null;
let arData = [];
let cashFlowData = {
    startingBalance: 10000,
    inflows: {
        arCollections: [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200],
        newSales: [7000, 7300, 7600, 7900, 8200, 8500, 8800, 9100, 9400, 9700, 10000, 10300],
        otherInflows: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
    },
    outflows: {
        payroll: [8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000],
        rent: [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000],
        inventoryPurchases: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000],
        otherExpenses: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500]
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeARTable();
    initializeCashFlowTable();
    updateARSummary();
    updateCashFlowSummary();
    createARChart();
    createCashFlowChart();
    
    // Set up event listeners
    document.getElementById('as-of-date').addEventListener('change', calculateAging);
    document.getElementById('starting-balance').addEventListener('input', updateCashFlowSummary);
});

// Navigation functionality
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab
            tabContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// AR Aging Calculator
function initializeARTable() {
    const tbody = document.getElementById('ar-table-body');
    
    // Add initial rows
    for (let i = 0; i < 5; i++) {
        addARRow();
    }
}

function addARRow() {
    const tbody = document.getElementById('ar-table-body');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" placeholder="Customer Name" onchange="updateARSummary()"></td>
        <td><input type="text" placeholder="Invoice #" onchange="updateARSummary()"></td>
        <td><input type="date" onchange="updateARSummary()"></td>
        <td><input type="date" onchange="updateARSummary()"></td>
        <td><input type="number" placeholder="0.00" step="0.01" onchange="updateARSummary()"></td>
        <td class="aging-cell current">$0.00</td>
        <td class="aging-cell overdue-30">$0.00</td>
        <td class="aging-cell overdue-60">$0.00</td>
        <td class="aging-cell overdue-90">$0.00</td>
        <td class="aging-cell overdue-90plus">$0.00</td>
    `;
    
    tbody.appendChild(row);
}

function calculateAging() {
    const asOfDate = new Date(document.getElementById('as-of-date').value);
    const rows = document.querySelectorAll('#ar-table-body tr');
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const invoiceDate = new Date(inputs[2].value);
        const dueDate = new Date(inputs[3].value);
        const amount = parseFloat(inputs[4].value) || 0;
        
        if (amount > 0 && dueDate) {
            const daysOverdue = Math.floor((asOfDate - dueDate) / (1000 * 60 * 60 * 24));
            
            // Clear all aging cells
            row.querySelectorAll('.aging-cell').forEach(cell => {
                cell.textContent = '$0.00';
            });
            
            // Assign to appropriate aging bucket
            if (daysOverdue <= 0) {
                row.querySelector('.aging-cell.current').textContent = formatCurrency(amount);
            } else if (daysOverdue <= 30) {
                row.querySelector('.aging-cell.overdue-30').textContent = formatCurrency(amount);
            } else if (daysOverdue <= 60) {
                row.querySelector('.aging-cell.overdue-60').textContent = formatCurrency(amount);
            } else if (daysOverdue <= 90) {
                row.querySelector('.aging-cell.overdue-90').textContent = formatCurrency(amount);
            } else {
                row.querySelector('.aging-cell.overdue-90plus').textContent = formatCurrency(amount);
            }
        }
    });
    
    updateARSummary();
}

function updateARSummary() {
    const rows = document.querySelectorAll('#ar-table-body tr');
    let totals = {
        current: 0,
        overdue30: 0,
        overdue60: 0,
        overdue90: 0,
        overdue90plus: 0
    };
    
    rows.forEach(row => {
        const current = parseFloat(row.querySelector('.aging-cell.current').textContent.replace('$', '').replace(',', '')) || 0;
        const overdue30 = parseFloat(row.querySelector('.aging-cell.overdue-30').textContent.replace('$', '').replace(',', '')) || 0;
        const overdue60 = parseFloat(row.querySelector('.aging-cell.overdue-60').textContent.replace('$', '').replace(',', '')) || 0;
        const overdue90 = parseFloat(row.querySelector('.aging-cell.overdue-90').textContent.replace('$', '').replace(',', '')) || 0;
        const overdue90plus = parseFloat(row.querySelector('.aging-cell.overdue-90plus').textContent.replace('$', '').replace(',', '')) || 0;
        
        totals.current += current;
        totals.overdue30 += overdue30;
        totals.overdue60 += overdue60;
        totals.overdue90 += overdue90;
        totals.overdue90plus += overdue90plus;
    });
    
    const totalAR = totals.current + totals.overdue30 + totals.overdue60 + totals.overdue90 + totals.overdue90plus;
    
    // Update summary cards
    document.getElementById('total-ar').textContent = formatCurrency(totalAR);
    document.getElementById('current-amount').textContent = formatCurrency(totals.current);
    document.getElementById('overdue-30-amount').textContent = formatCurrency(totals.overdue30);
    document.getElementById('overdue-60-amount').textContent = formatCurrency(totals.overdue60);
    document.getElementById('overdue-90-amount').textContent = formatCurrency(totals.overdue90);
    document.getElementById('overdue-90plus-amount').textContent = formatCurrency(totals.overdue90plus);
    
    // Update chart
    updateARChart([totals.current, totals.overdue30, totals.overdue60, totals.overdue90, totals.overdue90plus]);
}

// Cash Flow Forecast
function initializeCashFlowTable() {
    const tbody = document.getElementById('cash-flow-table-body');
    
    // Create table structure
    const categories = [
        { name: 'Inflows', type: 'header' },
        { name: 'AR Collections', type: 'inflow', data: cashFlowData.inflows.arCollections },
        { name: 'New Sales', type: 'inflow', data: cashFlowData.inflows.newSales },
        { name: 'Other Inflows', type: 'inflow', data: cashFlowData.inflows.otherInflows },
        { name: 'Total Inflows', type: 'total-inflow' },
        { name: 'Outflows', type: 'header' },
        { name: 'Payroll', type: 'outflow', data: cashFlowData.outflows.payroll },
        { name: 'Rent', type: 'outflow', data: cashFlowData.outflows.rent },
        { name: 'Inventory Purchases', type: 'outflow', data: cashFlowData.outflows.inventoryPurchases },
        { name: 'Other Expenses', type: 'outflow', data: cashFlowData.outflows.otherExpenses },
        { name: 'Total Outflows', type: 'total-outflow' },
        { name: 'Net Cash Flow', type: 'net' },
        { name: 'Ending Cash Balance', type: 'ending' }
    ];
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        row.className = category.type;
        
        if (category.type === 'header') {
            row.innerHTML = `<td colspan="13" class="category-header">${category.name}</td>`;
        } else {
            let cells = `<td class="category-name">${category.name}</td>`;
            
            for (let i = 0; i < 12; i++) {
                if (category.data) {
                    cells += `<td><input type="number" value="${category.data[i]}" step="100" onchange="updateCashFlowSummary()"></td>`;
                } else {
                    cells += `<td class="calculated-cell">$0.00</td>`;
                }
            }
            row.innerHTML = cells;
        }
        
        tbody.appendChild(row);
    });
    
    updateCashFlowSummary();
}

function updateCashFlowSummary() {
    const startingBalance = parseFloat(document.getElementById('starting-balance').value) || 0;
    const rows = document.querySelectorAll('#cash-flow-table-body tr');
    
    let monthlyData = {
        inflows: Array(12).fill(0),
        outflows: Array(12).fill(0),
        netFlow: Array(12).fill(0),
        endingBalance: Array(12).fill(0)
    };
    
    let currentBalance = startingBalance;
    
    // Calculate monthly totals
    rows.forEach(row => {
        const categoryName = row.querySelector('.category-name')?.textContent;
        if (!categoryName) return;
        
        const inputs = row.querySelectorAll('input');
        inputs.forEach((input, index) => {
            const value = parseFloat(input.value) || 0;
            
            if (categoryName === 'AR Collections' || categoryName === 'New Sales' || categoryName === 'Other Inflows') {
                monthlyData.inflows[index] += value;
            } else if (categoryName === 'Payroll' || categoryName === 'Rent' || categoryName === 'Inventory Purchases' || categoryName === 'Other Expenses') {
                monthlyData.outflows[index] += value;
            }
        });
    });
    
    // Calculate net flow and ending balances
    for (let i = 0; i < 12; i++) {
        monthlyData.netFlow[i] = monthlyData.inflows[i] - monthlyData.outflows[i];
        currentBalance += monthlyData.netFlow[i];
        monthlyData.endingBalance[i] = currentBalance;
    }
    
    // Update calculated cells
    updateCalculatedCells(monthlyData);
    
    // Update summary cards
    const totalInflows = monthlyData.inflows.reduce((sum, val) => sum + val, 0);
    const totalOutflows = monthlyData.outflows.reduce((sum, val) => sum + val, 0);
    const netCashFlow = totalInflows - totalOutflows;
    const endingBalance = startingBalance + netCashFlow;
    
    document.getElementById('total-inflows').textContent = formatCurrency(totalInflows);
    document.getElementById('total-outflows').textContent = formatCurrency(totalOutflows);
    document.getElementById('net-cash-flow').textContent = formatCurrency(netCashFlow);
    document.getElementById('ending-balance').textContent = formatCurrency(endingBalance);
    
    // Update chart
    updateCashFlowChart(monthlyData);
}

function updateCalculatedCells(monthlyData) {
    const rows = document.querySelectorAll('#cash-flow-table-body tr');
    
    rows.forEach(row => {
        const categoryName = row.querySelector('.category-name')?.textContent;
        if (!categoryName) return;
        
        const calculatedCells = row.querySelectorAll('.calculated-cell');
        
        if (categoryName === 'Total Inflows') {
            calculatedCells.forEach((cell, index) => {
                cell.textContent = formatCurrency(monthlyData.inflows[index]);
            });
        } else if (categoryName === 'Total Outflows') {
            calculatedCells.forEach((cell, index) => {
                cell.textContent = formatCurrency(monthlyData.outflows[index]);
            });
        } else if (categoryName === 'Net Cash Flow') {
            calculatedCells.forEach((cell, index) => {
                cell.textContent = formatCurrency(monthlyData.netFlow[index]);
            });
        } else if (categoryName === 'Ending Cash Balance') {
            calculatedCells.forEach((cell, index) => {
                cell.textContent = formatCurrency(monthlyData.endingBalance[index]);
            });
        }
    });
}

// Charts
function createARChart() {
    const ctx = document.getElementById('ar-chart').getContext('2d');
    
    arChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
            datasets: [{
                label: 'Amount',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545',
                    '#6f42c1'
                ],
                borderColor: [
                    '#28a745',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545',
                    '#6f42c1'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'AR Aging Summary',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateARChart(data) {
    if (arChart) {
        arChart.data.datasets[0].data = data;
        arChart.update();
    }
}

function createCashFlowChart() {
    const ctx = document.getElementById('cash-flow-chart').getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    cashFlowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Inflows',
                    data: Array(12).fill(0),
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Outflows',
                    data: Array(12).fill(0),
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Ending Balance',
                    data: Array(12).fill(0),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Cash Flow Forecast',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Monthly Cash Flow ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Ending Balance ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function updateCashFlowChart(monthlyData) {
    if (cashFlowChart) {
        cashFlowChart.data.datasets[0].data = monthlyData.inflows;
        cashFlowChart.data.datasets[1].data = monthlyData.outflows;
        cashFlowChart.data.datasets[2].data = monthlyData.endingBalance;
        cashFlowChart.update();
    }
}

// Utility functions
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Add some sample data for demonstration
function addSampleData() {
    const rows = document.querySelectorAll('#ar-table-body tr');
    const sampleData = [
        { customer: 'ABC Corporation', invoice: 'INV-2025-001', invoiceDate: '2025-07-01', dueDate: '2025-07-31', amount: 5000 },
        { customer: 'XYZ Industries', invoice: 'INV-2025-002', invoiceDate: '2025-06-15', dueDate: '2025-07-15', amount: 3500 },
        { customer: 'DEF Manufacturing', invoice: 'INV-2025-003', invoiceDate: '2025-05-20', dueDate: '2025-06-20', amount: 2800 },
        { customer: 'GHI Solutions', invoice: 'INV-2025-004', invoiceDate: '2025-04-10', dueDate: '2025-05-10', amount: 4200 },
        { customer: 'JKL Enterprises', invoice: 'INV-2025-005', invoiceDate: '2025-03-01', dueDate: '2025-04-01', amount: 1500 }
    ];
    
    rows.forEach((row, index) => {
        if (sampleData[index]) {
            const inputs = row.querySelectorAll('input');
            inputs[0].value = sampleData[index].customer;
            inputs[1].value = sampleData[index].invoice;
            inputs[2].value = sampleData[index].invoiceDate;
            inputs[3].value = sampleData[index].dueDate;
            inputs[4].value = sampleData[index].amount;
        }
    });
    
    calculateAging();
}

// Add sample data button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add sample data button to AR section
    const arActions = document.querySelector('.table-actions');
    const sampleDataBtn = document.createElement('button');
    sampleDataBtn.className = 'btn btn-secondary';
    sampleDataBtn.textContent = 'Add Sample Data';
    sampleDataBtn.onclick = addSampleData;
    arActions.appendChild(sampleDataBtn);
    
    // Auto-populate with sample data for demo
    setTimeout(() => {
        addSampleData();
    }, 500);
});

// Excel Export Functions
function exportToExcel() {
    const asOfDate = document.getElementById('as-of-date').value;
    const workbook = XLSX.utils.book_new();
    
    // AR Aging Data
    const arData = getARDataForExport();
    const arWorksheet = XLSX.utils.aoa_to_sheet(arData);
    XLSX.utils.book_append_sheet(workbook, arWorksheet, "AR Aging Report");
    
    // AR Summary Data
    const summaryData = getARSummaryForExport();
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "AR Summary");
    
    // Format the workbook
    formatARWorkbook(workbook, asOfDate);
    
    // Save the file
    const fileName = `AR_Aging_Report_${asOfDate || 'as_of_date'}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

function getARDataForExport() {
    const rows = document.querySelectorAll('#ar-table-body tr');
    const data = [
        ['Customer', 'Invoice #', 'Invoice Date', 'Due Date', 'Invoice Amount', 'Current', '1-30 days', '31-60 days', '61-90 days', '90+ days']
    ];
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const agingCells = row.querySelectorAll('.aging-cell');
        
        if (inputs.length > 0) {
            const rowData = [
                inputs[0].value || '',
                inputs[1].value || '',
                inputs[2].value || '',
                inputs[3].value || '',
                parseFloat(inputs[4].value) || 0,
                parseFloat(agingCells[0].textContent.replace('$', '').replace(',', '')) || 0,
                parseFloat(agingCells[1].textContent.replace('$', '').replace(',', '')) || 0,
                parseFloat(agingCells[2].textContent.replace('$', '').replace(',', '')) || 0,
                parseFloat(agingCells[3].textContent.replace('$', '').replace(',', '')) || 0,
                parseFloat(agingCells[4].textContent.replace('$', '').replace(',', '')) || 0
            ];
            data.push(rowData);
        }
    });
    
    return data;
}

function getARSummaryForExport() {
    const data = [
        ['AR Aging Summary'],
        [''],
        ['Bucket', 'Amount'],
        ['Current', parseFloat(document.getElementById('current-amount').textContent.replace('$', '').replace(',', '')) || 0],
        ['1-30 Days', parseFloat(document.getElementById('overdue-30-amount').textContent.replace('$', '').replace(',', '')) || 0],
        ['31-60 Days', parseFloat(document.getElementById('overdue-60-amount').textContent.replace('$', '').replace(',', '')) || 0],
        ['61-90 Days', parseFloat(document.getElementById('overdue-90-amount').textContent.replace('$', '').replace(',', '')) || 0],
        ['90+ Days', parseFloat(document.getElementById('overdue-90plus-amount').textContent.replace('$', '').replace(',', '')) || 0],
        [''],
        ['Total AR', parseFloat(document.getElementById('total-ar').textContent.replace('$', '').replace(',', '')) || 0]
    ];
    
    return data;
}

function formatARWorkbook(workbook, asOfDate) {
    // Format AR Aging Report sheet
    const arSheet = workbook.Sheets["AR Aging Report"];
    
    // Set column widths
    arSheet['!cols'] = [
        { width: 20 }, // Customer
        { width: 15 }, // Invoice #
        { width: 12 }, // Invoice Date
        { width: 12 }, // Due Date
        { width: 15 }, // Invoice Amount
        { width: 12 }, // Current
        { width: 12 }, // 1-30 days
        { width: 12 }, // 31-60 days
        { width: 12 }, // 61-90 days
        { width: 12 }  // 90+ days
    ];
    
    // Add header styling
    const headerRange = XLSX.utils.decode_range(arSheet['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!arSheet[cellAddress]) arSheet[cellAddress] = {};
        arSheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1e3a8a" } },
            alignment: { horizontal: "center" }
        };
    }
    
    // Format currency columns
    const currencyColumns = [4, 5, 6, 7, 8, 9]; // Invoice Amount and aging columns
    currencyColumns.forEach(col => {
        for (let row = 1; row <= headerRange.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (arSheet[cellAddress] && arSheet[cellAddress].v !== undefined) {
                if (!arSheet[cellAddress].s) arSheet[cellAddress].s = {};
                arSheet[cellAddress].s.numFmt = '"$"#,##0.00';
            }
        }
    });
    
    // Format AR Summary sheet
    const summarySheet = workbook.Sheets["AR Summary"];
    summarySheet['!cols'] = [{ width: 15 }, { width: 15 }];
    
    // Style summary headers
    summarySheet['A1'].s = { font: { bold: true, size: 16 }, alignment: { horizontal: "center" } };
    summarySheet['A3'].s = { font: { bold: true }, fill: { fgColor: { rgb: "f3f4f6" } } };
    summarySheet['B3'].s = { font: { bold: true }, fill: { fgColor: { rgb: "f3f4f6" } } };
    
    // Format summary amounts
    for (let row = 3; row <= 10; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 1 });
        if (summarySheet[cellAddress] && summarySheet[cellAddress].v !== undefined) {
            if (!summarySheet[cellAddress].s) summarySheet[cellAddress].s = {};
            summarySheet[cellAddress].s.numFmt = '"$"#,##0.00';
        }
    }
}

function exportCashFlowToExcel() {
    const workbook = XLSX.utils.book_new();
    
    // Cash Flow Data
    const cashFlowData = getCashFlowDataForExport();
    const cashFlowWorksheet = XLSX.utils.aoa_to_sheet(cashFlowData);
    XLSX.utils.book_append_sheet(workbook, cashFlowWorksheet, "Cash Flow Forecast");
    
    // Cash Flow Summary
    const summaryData = getCashFlowSummaryForExport();
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Cash Flow Summary");
    
    // Format the workbook
    formatCashFlowWorkbook(workbook);
    
    // Save the file
    const fileName = `Cash_Flow_Forecast_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

function getCashFlowDataForExport() {
    const rows = document.querySelectorAll('#cash-flow-table-body tr');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [['Category', ...months]];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const categoryName = row.querySelector('.category-name')?.textContent || '';
            if (categoryName) {
                const rowData = [categoryName];
                cells.forEach((cell, index) => {
                    if (index > 0) { // Skip the category name cell
                        const value = cell.textContent || cell.querySelector('input')?.value || '0';
                        rowData.push(parseFloat(value.replace('$', '').replace(',', '')) || 0);
                    }
                });
                data.push(rowData);
            }
        }
    });
    
    return data;
}

function getCashFlowSummaryForExport() {
    const data = [
        ['Cash Flow Summary'],
        [''],
        ['Metric', 'Value'],
        ['Total Inflows', parseFloat(document.getElementById('total-inflows').textContent.replace('$', '').replace(',', '')) || 0],
        ['Total Outflows', parseFloat(document.getElementById('total-outflows').textContent.replace('$', '').replace(',', '')) || 0],
        ['Net Cash Flow', parseFloat(document.getElementById('net-cash-flow').textContent.replace('$', '').replace(',', '')) || 0],
        ['Ending Balance', parseFloat(document.getElementById('ending-balance').textContent.replace('$', '').replace(',', '')) || 0]
    ];
    
    return data;
}

function formatCashFlowWorkbook(workbook) {
    // Format Cash Flow Forecast sheet
    const cfSheet = workbook.Sheets["Cash Flow Forecast"];
    
    // Set column widths
    cfSheet['!cols'] = [
        { width: 25 }, // Category
        { width: 12 }, // Jan
        { width: 12 }, // Feb
        { width: 12 }, // Mar
        { width: 12 }, // Apr
        { width: 12 }, // May
        { width: 12 }, // Jun
        { width: 12 }, // Jul
        { width: 12 }, // Aug
        { width: 12 }, // Sep
        { width: 12 }, // Oct
        { width: 12 }, // Nov
        { width: 12 }  // Dec
    ];
    
    // Add header styling
    const headerRange = XLSX.utils.decode_range(cfSheet['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!cfSheet[cellAddress]) cfSheet[cellAddress] = {};
        cfSheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1e3a8a" } },
            alignment: { horizontal: "center" }
        };
    }
    
    // Format currency columns (all except first column)
    for (let col = 1; col <= headerRange.e.c; col++) {
        for (let row = 1; row <= headerRange.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (cfSheet[cellAddress] && cfSheet[cellAddress].v !== undefined) {
                if (!cfSheet[cellAddress].s) cfSheet[cellAddress].s = {};
                cfSheet[cellAddress].s.numFmt = '"$"#,##0.00';
            }
        }
    }
    
    // Format Cash Flow Summary sheet
    const summarySheet = workbook.Sheets["Cash Flow Summary"];
    summarySheet['!cols'] = [{ width: 20 }, { width: 20 }];
    
    // Style summary headers
    summarySheet['A1'].s = { font: { bold: true, size: 16 }, alignment: { horizontal: "center" } };
    summarySheet['A3'].s = { font: { bold: true }, fill: { fgColor: { rgb: "f3f4f6" } } };
    summarySheet['B3'].s = { font: { bold: true }, fill: { fgColor: { rgb: "f3f4f6" } } };
    
    // Format summary amounts
    for (let row = 3; row <= 6; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 1 });
        if (summarySheet[cellAddress] && summarySheet[cellAddress].v !== undefined) {
            if (!summarySheet[cellAddress].s) summarySheet[cellAddress].s = {};
            summarySheet[cellAddress].s.numFmt = '"$"#,##0.00';
        }
    }
} 