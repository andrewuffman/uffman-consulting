# Uffman Consulting Group - Cash Flow Dashboard

A modern, interactive dashboard for Uffman Consulting Group, specializing in order-to-cash and accounts receivable consulting for growing businesses across the Dallas–Fort Worth metroplex.

## Features

### Accounts Receivable Aging Dashboard
- **AR Aging Calculator**: Input customer invoices with dates and amounts
- **Automatic Aging Calculation**: Automatically categorizes invoices by aging buckets (Current, 1-30 days, 31-60 days, 61-90 days, 90+ days)
- **Visual Summary**: Color-coded summary cards and interactive charts
- **Real-time Updates**: Calculations update automatically as you input data

### Cash Flow Forecasting Model
- **12-Month Forecast**: Complete monthly cash flow projection
- **Multiple Categories**: Track inflows (AR Collections, New Sales, Other Inflows) and outflows (Payroll, Rent, Inventory, Other Expenses)
- **Automatic Calculations**: Net cash flow and ending balance calculations
- **Interactive Charts**: Visual representation of cash flow trends

## Getting Started

1. **Open the Application**: Simply open `index.html` in any modern web browser
2. **No Installation Required**: The application runs entirely in the browser using CDN-hosted libraries

## How to Use

### AR Aging Dashboard
1. Set the "As-of Date" to determine the aging calculation point
2. Add customer invoices using the "Add Row" button
3. Enter customer name, invoice number, invoice date, due date, and amount
4. Click "Calculate Aging" to automatically categorize invoices
5. View the summary cards and chart for visual insights
6. Use "Add Sample Data" to see the dashboard in action

### Cash Flow Forecast
1. Set the starting cash balance
2. Input monthly values for each category (inflows and outflows)
3. View automatic calculations for totals, net cash flow, and ending balances
4. Analyze trends using the interactive chart

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Charts**: Chart.js for interactive visualizations
- **Styling**: Modern CSS with gradient backgrounds and glassmorphism effects
- **Responsive**: Works on desktop, tablet, and mobile devices
- **No Backend**: All calculations performed client-side

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

The dashboard is designed to be easily customizable:

- **Colors**: Modify the CSS variables in `styles.css`
- **Categories**: Add or remove cash flow categories in `script.js`
- **Aging Buckets**: Adjust aging periods in the `calculateAging()` function
- **Charts**: Customize chart types and styling in the chart creation functions

## Data Privacy

- All data is stored locally in the browser
- No data is sent to external servers
- Data persists only during the browser session

## Support

For questions or customization requests, contact Uffman Consulting Group.

---

*Built with modern web technologies for professional financial analysis and reporting. Elevate your cash flow with expert order-to-cash consulting.* 