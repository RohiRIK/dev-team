# Data Analysis Cheat Sheet

This document provides a cheat sheet of common data analysis tasks.

## Data Cleaning

-   **Handling missing values:** `df.dropna()`, `df.fillna()`
-   **Handling outliers:** `df[(np.abs(stats.zscore(df)) < 3).all(axis=1)]`
-   **Handling duplicates:** `df.drop_duplicates()`

## Data Visualization

-   **Bar charts:** `df.plot.bar()`
-   **Line charts:** `df.plot.line()`
-   **Pie charts:** `df.plot.pie()`
-   **Scatter plots:** `df.plot.scatter()`
-   **Histograms:** `df.plot.hist()`

## Statistical Analysis

-   **Descriptive statistics:** `df.describe()`
-   **t-test:** `scipy.stats.ttest_ind()`
-   **ANOVA:** `scipy.stats.f_oneway()`
-   **Chi-squared test:** `scipy.stats.chi2_contingency()`
