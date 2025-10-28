# Database Admin Prometheus Tools

This agent has access to the following Prometheus tools to assist with monitoring and alerting for database systems.

## Prometheus Server (Conceptual Tool)

The core component that scrapes metrics from exporters, stores them in its time-series database, and makes them available for querying. DBAs configure Prometheus to scrape metrics from database exporters.

### Example Usage (Conceptual)

```
# Simulate configuring Prometheus to scrape a MySQL exporter
print(default_api.run_shell_command(command = "prometheus_configure_scrape_target --job_name mysql --target localhost:9104"))

# Simulate querying Prometheus for a metric
print(default_api.run_shell_command(command = "promtool query \"mysql_global_status_threads_connected\""))
```

## Database Exporters (Conceptual Tool)

Specialized agents that run alongside or near the database, collect database-specific statistics, and translate them into a Prometheus-compatible format. There are numerous exporters for various database systems (MySQL, PostgreSQL, Oracle DB, MSSQL, MongoDB, Redis, etc.).

### Example Usage (Conceptual)

```
# Simulate deploying a PostgreSQL exporter
print(default_api.run_shell_command(command = "deploy_exporter --db_type postgresql --exporter_name postgres_exporter --target_db_host pg_server"))

# Simulate configuring a generic SQL exporter for custom metrics
print(default_api.run_shell_command(command = "sql_exporter_configure --config_file custom_metrics.yml"))
```

## PromQL (Prometheus Query Language) (Conceptual Tool)

PromQL is a powerful query language that allows DBAs to select, aggregate, and transform time-series data. It is essential for analyzing database performance, identifying trends, and defining alert conditions.

### Example Usage (Conceptual)

```
# Simulate a PromQL query for average CPU utilization over the last 5 minutes
print(default_api.run_shell_command(command = "promql_query \"avg_over_time(node_cpu_usage_percent[5m])\""))

# Simulate a PromQL query to find instances with high query latency
print(default_api.run_shell_command(command = "promql_query \"database_query_latency_seconds{job=\"mysql\"} > 0.5\""))
```

## Alertmanager (Conceptual Tool)

Alertmanager handles alerts triggered by Prometheus. DBAs define alerting rules based on PromQL queries. Alertmanager then manages the routing, silencing, and notification of these alerts through various channels (e.g., email, Slack, PagerDuty).

### Example Usage (Conceptual)

```
# Simulate configuring an alert rule for low disk space
print(default_api.run_shell_command(command = "alertmanager_configure_rule --rule_name \"LowDiskSpace\" --promql_expression \"node_filesystem_free_bytes < 10GB\" --severity critical"))

# Simulate silencing an alert
print(default_api.run_shell_command(command = "alertmanager_silence_alert --alert_name \"HighCPULoad\" --duration 1h"))
```

## Grafana (Conceptual Tool)

Grafana is the de facto visualization tool used with Prometheus. It provides native support for Prometheus, allowing DBAs to create rich, interactive dashboards for visualizing database metrics over time.

### Example Usage (Conceptual)

```
# Simulate creating a Grafana dashboard for database performance
print(default_api.run_shell_command(command = "grafana_create_dashboard --title \"Database Performance Overview\" --data_source Prometheus --panels \"cpu_graph,memory_graph,query_latency_table\""))

# Simulate adding a panel to an existing Grafana dashboard
print(default_api.run_shell_command(command = "grafana_add_panel --dashboard_id 123 --panel_type graph --metric \"mysql_connections_current\""))
```