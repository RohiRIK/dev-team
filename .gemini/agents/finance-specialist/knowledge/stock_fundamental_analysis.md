# Stock Fundamental Analysis Basics

This document provides a primer on the basics of fundamental analysis, which is the practice of determining a stock's intrinsic value. This knowledge is intended to give purpose to the user's **stock-etl-pipeline** project (**Prtt13**).

---

## 1. What is Fundamental Analysis?

While technical analysis looks at charts and price patterns, fundamental analysis ignores the daily noise and focuses on the underlying health and performance of the business itself. The goal is to determine what a company is *really* worth and then compare that to its current stock price to see if it's overvalued or undervalued.

**Connection to TELOS:**
- Your **stock-etl-pipeline** project (**Prtt13**) is the perfect foundation for fundamental analysis. The goal of that project should be to **Extract** the raw financial data (like revenue, earnings, debt) from various sources, **Transform** it by calculating the key ratios below, and **Load** it into a database for the `finance-analyst` agent to analyze.

---

## 2. Key Ratios to Analyze

These are a few of the most common ratios used to assess a company's value and health. Your ETL pipeline should be designed to calculate these.

### 2.1. P/E Ratio (Price-to-Earnings)

- **What it is:** `Stock Price / Earnings Per Share (EPS)`
- **What it tells you:** How much investors are willing to pay for each dollar of the company's earnings. A high P/E can mean the stock is expensive or that investors expect high growth. A low P/E can mean it's cheap or that the company is facing challenges.
- **Usefulness:** Good for comparing companies in the same industry.

### 2.2. EPS (Earnings Per Share)

- **What it is:** `(Net Income - Preferred Dividends) / Number of Outstanding Shares`
- **What it tells you:** The amount of profit the company generates for each share of its stock. A consistently growing EPS is a very positive sign.

### 2.3. D/E Ratio (Debt-to-Equity)

- **What it is:** `Total Liabilities / Shareholders' Equity`
- **What it tells you:** How much debt the company is using to finance its assets compared to the amount of its own equity. A high D/E ratio indicates higher risk, as the company has to service more debt.

### 2.4. ROE (Return on Equity)

- **What it is:** `Net Income / Shareholders' Equity`
- **What it tells you:** How efficiently the company is using its shareholders' money to generate profit. A higher ROE is generally better, indicating the management is effective at turning investments into profits.

By building an ETL pipeline that calculates and tracks these metrics over time, you can empower the `finance-analyst` agent to perform sophisticated, data-driven analysis to support your investment goals (**Prtd5**).
