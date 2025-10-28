# Database Administrator Cheat Sheet

This cheat sheet provides a quick reference for essential commands, concepts, and best practices across various critical areas of database management for DBAs.

## I. SQL Basics (Universal)

### A. Data Definition Language (DDL)

-   **CREATE:** `CREATE DATABASE`, `CREATE TABLE`, `CREATE INDEX`, `CREATE VIEW`, `CREATE USER`
-   **ALTER:** `ALTER TABLE ... ADD/DROP/MODIFY COLUMN`, `ALTER TABLE ... RENAME TO`
-   **DROP:** `DROP DATABASE`, `DROP TABLE`, `DROP INDEX`, `DROP USER`
-   **TRUNCATE:** `TRUNCATE TABLE table_name;`

### B. Data Manipulation Language (DML)

-   **SELECT:** `SELECT column1, column2 FROM table_name WHERE condition;`
-   **INSERT:** `INSERT INTO table_name (column1, column2) VALUES (value1, value2);`
-   **UPDATE:** `UPDATE table_name SET column1 = new_value1 WHERE condition;`
-   **DELETE:** `DELETE FROM table_name WHERE condition;`

### C. Data Control Language (DCL)

-   **GRANT:** `GRANT privilege_name ON object_name TO user_name;`
-   **REVOKE:** `REVOKE privilege_name ON object_name FROM user_name;`

### D. Transaction Control Language (TCL)

-   **COMMIT:** Saves changes permanently.
-   **ROLLBACK:** Undoes changes since last COMMIT or SAVEPOINT.
-   **SAVEPOINT:** Sets a point to which you can later roll back.

## II. Backup and Recovery

### A. Concepts

-   **Full Backup:** Complete copy of the database.
-   **Incremental Backup:** Changes since last backup.
-   **Differential Backup:** Changes since last *full* backup.
-   **RPO (Recovery Point Objective):** Max acceptable data loss.
-   **RTO (Recovery Time Objective):** Max acceptable downtime.
-   **Point-in-Time Recovery:** Restore to a specific moment.

### B. Best Practices

-   **3-2-1 Rule:** 3 copies, 2 different media, 1 off-site.
-   **Automate & Schedule:** Regular, automated backups.
-   **Test Recovery:** Regularly test restoration process.
-   **Off-site Storage:** For disaster recovery.

## III. Performance Tuning

### A. Query Optimization

-   **Analyze Execution Plans:** Use `EXPLAIN` to identify bottlenecks.
-   **Select Only Necessary Columns:** Avoid `SELECT *`.
-   **Optimize `JOIN`s:** Use appropriate types and order.
-   **Effective `WHERE` Clauses:** Filter data early.
-   **Avoid Wildcards:** Especially leading wildcards in `LIKE`.

### B. Indexing

-   **Create Appropriate Indexes:** For `WHERE`, `JOIN`, `ORDER BY`, `GROUP BY` columns.
-   **Avoid Over-indexing:** Can slow down writes.
-   **Regular Maintenance:** Rebuild/defragment indexes.
-   **Update Statistics:** Keep query optimizer informed.

### C. Hardware & Resource Optimization

-   **Monitor CPU, Memory, Disk I/O:** Ensure adequate resources.
-   **Tune Configuration:** Adjust database parameters (e.g., `innodb_buffer_pool_size` for MySQL, `shared_buffers` for PostgreSQL).

### D. Caching

-   **Implement Caching Layers:** For frequently accessed data (e.g., Redis, Memcached).
-   **Database Query Caching:** Utilize database-level caching.

## IV. Security

### A. Access Control

-   **Least Privilege:** Grant minimum necessary permissions.
-   **Strong Authentication:** Strong passwords, MFA.
-   **RBAC:** Role-Based Access Control.
-   **Audit & Revoke:** Regularly review and revoke unused access.

### B. Encryption

-   **Data at Rest:** Encrypt sensitive data on disk.
-   **Data in Transit:** Use TLS/SSL for connections.
-   **Key Management:** Securely manage encryption keys.

### C. Network Security

-   **Separate Servers:** Isolate database servers.
-   **Firewalls:** Restrict network access to database ports.
-   **Avoid Default Ports:** Change default port numbers.

### D. Patch Management

-   **Keep Software Updated:** Apply security patches regularly.

### E. Monitoring & Auditing

-   **Continuous Activity Monitoring:** Track and log all database activities.
-   **Audit Logs:** Regularly review for suspicious activity.

## V. Monitoring and Troubleshooting

### A. Key Metrics to Monitor

-   **Resource Utilization:** CPU, memory, disk I/O.
-   **Performance:** Query execution times, latency, throughput.
-   **Connections:** Active connections, connection pool utilization.
-   **Errors:** Error rates, failed logins.

### B. Tools & Commands

-   **Database-specific Monitoring Tools:** (e.g., SQL Server Management Studio Activity Monitor, Oracle Enterprise Manager, `pg_stat_statements` for PostgreSQL, `SHOW PROCESSLIST` for MySQL).
-   **`EXPLAIN ANALYZE`:** For detailed query execution analysis.
-   **Slow Query Logs:** Enable and review.
-   **System Logs:** Monitor database error logs, trace files, OS logs.

### C. Alerting

-   Set up alerts for critical thresholds (e.g., high CPU, low disk space, long-running queries).

## VI. General Best Practices & Concepts

-   **Documentation:** Maintain detailed documentation.
-   **Automation:** Automate routine tasks.
-   **Environment Separation:** Separate Dev, Test, Prod environments.
-   **Continuous Learning:** Stay updated with technologies.
-   **Testing:** Thoroughly test all changes.
