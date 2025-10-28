# Introduction to Financial ETL Pipelines

This document provides a high-level plan for building the **stock-etl-pipeline** project (**Prtt13**). An ETL (Extract, Transform, Load) pipeline is a system that automatically gathers raw data, processes it into a useful format, and saves it to a database for analysis.

This process is the engine that will feed the `finance-analyst` agent with the data it needs.

---

## 1. Extract: Getting the Raw Data

**Goal:** To pull raw daily stock data from a public source.

- **Tool:** The `yfinance` Python library is an excellent and free starting point. It allows you to download historical and daily price data from Yahoo Finance.
- **Data to Extract:** For each stock ticker you want to track, you'll need to extract:
  - Daily price data (Open, High, Low, Close, Volume).
  - Company financial statements (Income Statement, Balance Sheet) to get access to data like total revenue, net income, total debt, and total equity.

**Example Python Snippet:**
```python
import yfinance as yf

aapl = yf.Ticker("AAPL")

# Get historical market data
hist = aapl.history(period="1y")

# Get financial statements
incomestmt = aapl.income_stmt
balancesheet = aapl.balance_sheet
```

---

## 2. Transform: Creating Valuable Metrics

**Goal:** To convert the raw data into the key ratios needed for fundamental analysis.

- **Tool:** The `pandas` library in Python is the industry standard for this kind of data manipulation.
- **Process:** This is where you implement the logic from the `stock_fundamental_analysis.md` knowledge file. Your Python script will:
  1. Load the raw data into pandas DataFrames.
  2. Calculate the key ratios (P/E, EPS, D/E, ROE, etc.).
  3. Calculate other useful metrics like moving averages or daily percentage changes.
  4. Structure the final, clean data into a new DataFrame, ready to be loaded into a database.

---

## 3. Load: Storing the Processed Data

**Goal:** To save the transformed, valuable data into a database for easy querying.

- **Tool:** As mentioned in your project description, **PostgreSQL** is a robust choice. You would use a Python library like `sqlalchemy` or `psycopg2` to connect to the database and append the new data each day.
- **Structure:** You might have a table for daily prices and another table for the calculated fundamental ratios, with each row indexed by the stock ticker and the date.

---

## 4. Orchestration: Automating the Pipeline

**Goal:** To run the entire ETL process automatically on a schedule (e.g., once per day).

- **Tool:** This is a perfect use case for your primary automation tool, **n8n** (**Ts6**), or for **GitHub Actions** (**SdJ3**).
- **n8n Method:** You can create a workflow that has a "Cron" trigger to run daily. This trigger would execute a shell command that runs your main Python ETL script (`python run_etl.py`).
- **GitHub Actions Method:** You can create a workflow file in your project's `.github/workflows` directory that runs on a `schedule` trigger, checks out your code, and executes the Python script.

**Connection to TELOS:**
- By orchestrating this pipeline, you are directly applying your skills as an AI Automations Engineer (**SdJ1**) to a personal project that supports your financial goals (**M5**).
