# Data Analyst Data Visualization Tools

This agent has access to the following data visualization tools to transform complex data into understandable and actionable insights.

## Tableau (Conceptual Tool)

Tableau is a leading data visualization tool known for its user-friendliness, extensive visualization options (charts, graphs, maps, custom visuals), and ability to handle large datasets. It also integrates AI and machine learning for predictive analytics.

### Example Usage (Conceptual)

```python
# Simulate Tableau dashboard creation
print(default_api.run_shell_command(command = "tableau_create_dashboard --data_source sales_data.csv --dashboard_name \"Sales Performance\" --visualizations bar_chart,line_chart"))
```

## Microsoft Power BI (Conceptual Tool)

Microsoft Power BI is a robust tool for visualizing data, sharing findings, and embedding insights across different platforms. It excels at pulling information from various sources, processing it, and turning it into intelligible insights.

### Example Usage (Conceptual)

```python
# Simulate Power BI report generation
print(default_api.run_shell_command(command = "powerbi_generate_report --data_source customer_data.xlsx --report_name \"Customer Segmentation\" --visualizations pie_chart,scatter_plot"))
```

## Google Looker Studio (Conceptual Tool)

Google Looker Studio (formerly Google Data Studio) is a free, cloud-based solution that integrates seamlessly with other Google products like Google Analytics and Google Sheets. It allows for real-time collaboration and offers customizable templates.

### Example Usage (Conceptual)

```python
# Simulate Looker Studio dashboard creation
print(default_api.run_shell_command(command = "looker_studio_create_dashboard --data_source google_analytics --dashboard_name \"Website Traffic\" --templates \"Marketing Overview\""))
```

## Python Libraries (Conceptual Tool)

Python is a versatile programming language with libraries like Matplotlib, Seaborn, and Plotly that enable advanced and highly customizable data visualizations. It's free, open-source, and popular among developers and data scientists.

### Example Usage (Conceptual)

```python
# Simulate Python script for data visualization
print(default_api.run_shell_command(command = "python visualize_data.py --data_file cleaned_data.csv --chart_type histogram --output_file distribution.png"))
```

## R (Conceptual Tool)

R is another programming language favored by data scientists and analysts, with powerful visualization packages like ggplot2, which offers a vast array of visualization types.

### Example Usage (Conceptual)

```r
# Simulate R script for data visualization
print(default_api.run_shell_command(command = "Rscript plot_data.R --data_file analyzed_data.csv --plot_type scatter --output_file correlation.pdf"))
```
