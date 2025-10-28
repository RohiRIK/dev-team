# Database Admin Tools

This agent has access to the following tools to assist with database administration responsibilities:

## Run Shell Command

The `run_shell_command` tool can be used to execute various commands for database administration. This includes running SQL clients, managing database services, interacting with cloud database APIs, and executing custom scripts.

### Example Usage (Conceptual - actual commands would depend on specific database and environment setup)

```
# Example: Connect to a PostgreSQL database and execute a query
print(default_api.run_shell_command(command = "psql -U admin_user -d my_database -c \"SELECT * FROM users;\""))

# Example: Start a MySQL service
print(default_api.run_shell_command(command = "sudo systemctl start mysql"))

# Example: Perform a database backup using mysqldump
print(default_api.run_shell_command(command = "mysqldump -u root -p my_database > /backups/my_database_backup.sql"))

# Example: Restore a PostgreSQL database from a backup file
print(default_api.run_shell_command(command = "psql -U admin_user -d my_database < /backups/my_database_backup.sql"))

# Example: Interact with AWS RDS API to describe database instances
print(default_api.run_shell_command(command = "aws rds describe-db-instances --db-instance-identifier my-rds-instance"))

# Example: Execute a custom Python script for database automation
print(default_api.run_shell_command(command = "python /scripts/db_health_check.py --db_name production_db"))
```

## SQL Client Tools (Conceptual Tool)

This conceptual tool represents the ability to interact with various SQL database clients (e.g., `psql`, `mysql` CLI, `sqlcmd`) to execute SQL queries, DDL, DML, and DCL commands directly.

### Example Usage (Conceptual)

```
# Simulate executing a DDL command
print(default_api.run_shell_command(command = "sql_client_execute --db_type postgresql --command \"ALTER TABLE products ADD COLUMN description TEXT;\""))

# Simulate executing a DML command
print(default_api.run_shell_command(command = "sql_client_execute --db_type mysql --command \"UPDATE orders SET status='shipped' WHERE order_id=123;\""))
```

## Cloud Database Management Tools (Conceptual Tool)

This conceptual tool represents the ability to interact with cloud provider-specific database management tools and APIs (e.g., AWS RDS, Google Cloud SQL, Azure SQL Database) for provisioning, scaling, monitoring, and managing cloud database instances.

### Example Usage (Conceptual)

```
# Simulate scaling up an AWS RDS instance
print(default_api.run_shell_command(command = "cloud_db_manage --provider aws --service rds --action scale_up --instance_id my-rds-instance --new_class db.m5.large"))

# Simulate checking Google Cloud SQL instance status
print(default_api.run_shell_command(command = "cloud_db_manage --provider gcp --service cloud_sql --action get_status --instance_id my-gcp-sql-instance"))
```

## Database Monitoring Tools (Conceptual Tool)

This conceptual tool represents the ability to use specialized database monitoring solutions (e.g., Prometheus, Grafana, Datadog, database-native monitoring dashboards) to track key performance metrics, set up alerts, and analyze database health.

### Example Usage (Conceptual)

```
# Simulate checking database CPU utilization
print(default_api.run_shell_command(command = "db_monitor --metric cpu_utilization --db_instance production_db --time_range 1h"))

# Simulate setting up an alert for high query latency
print(default_api.run_shell_command(command = "db_monitor --action set_alert --metric query_latency --threshold 500ms --db_instance production_db"))
```
