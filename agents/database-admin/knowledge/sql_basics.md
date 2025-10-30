# SQL Basics for Database Administrators

SQL (Structured Query Language) is the standard language for managing and manipulating relational databases. For database administrators (DBAs), a strong understanding of SQL is crucial for tasks ranging from database creation and maintenance to performance tuning and security management.

## 1. Data Definition Language (DDL)

DDL commands are used to define, modify, and delete database objects like tables, indexes, and users.

-   **`CREATE`**: Used to create new database objects.
    -   `CREATE DATABASE database_name;`
    -   `CREATE TABLE table_name (column1 datatype, column2 datatype, ...);`
    -   `CREATE INDEX index_name ON table_name (column_name);`
    -   `CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';`
-   **`ALTER`**: Used to modify the structure of existing database objects.
    -   `ALTER TABLE table_name ADD column_name datatype;`
    -   `ALTER TABLE table_name MODIFY COLUMN column_name new_datatype;`
    -   `ALTER TABLE table_name DROP COLUMN column_name;`
-   **`DROP`**: Used to delete existing database objects.
    -   `DROP DATABASE database_name;`
    -   `DROP TABLE table_name;`
    -   `DROP INDEX index_name ON table_name;`
    -   `DROP USER 'username'@'localhost';`
-   **`TRUNCATE`**: Removes all rows from a table, but keeps the table structure. It's faster than `DELETE` for removing all rows and cannot be rolled back.
    -   `TRUNCATE TABLE table_name;`
-   **`RENAME`**: Used to rename a database object.
    -   `ALTER TABLE old_table_name RENAME TO new_table_name;`

## 2. Data Manipulation Language (DML)

DML commands are used for managing data within schema objects.

-   **`SELECT`**: Used to retrieve data from one or more tables.
    -   `SELECT column1, column2 FROM table_name WHERE condition;`
    -   `SELECT * FROM table_name;`
    -   **Clauses**: `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `JOIN` (INNER, LEFT, RIGHT, FULL).
-   **`INSERT`**: Used to add new rows of data into a table.
    -   `INSERT INTO table_name (column1, column2) VALUES (value1, value2);`
    -   `INSERT INTO table_name VALUES (value1, value2, ...);`
-   **`UPDATE`**: Used to modify existing data in a table.
    -   `UPDATE table_name SET column1 = new_value1 WHERE condition;`
-   **`DELETE`**: Used to remove rows from a table.
    -   `DELETE FROM table_name WHERE condition;`

## 3. Data Control Language (DCL)

DCL commands are used to control permissions and access rights to the database.

-   **`GRANT`**: Used to give users specific privileges on database objects.
    -   `GRANT SELECT, INSERT ON database_name.table_name TO 'username'@'localhost';`
    -   `GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';`
-   **`REVOKE`**: Used to remove granted privileges from users.
    -   `REVOKE SELECT ON database_name.table_name FROM 'username'@'localhost';`

## 4. Transaction Control Language (TCL)

TCL commands are used to manage transactions in the database. A transaction is a sequence of operations performed as a single logical unit of work.

-   **`COMMIT`**: Saves all changes made during the current transaction permanently to the database.
-   **`ROLLBACK`**: Undoes all changes made during the current transaction, restoring the database to its state before the transaction began.
-   **`SAVEPOINT`**: Sets a point within a transaction to which you can later roll back.

## 5. Basic SQL Functions and Operators

-   **Aggregate Functions**: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.
-   **Scalar Functions**: `UCASE()`, `LCASE()`, `MID()`, `LEN()`, `ROUND()`, `NOW()`.
-   **Operators**:
    -   **Arithmetic**: `+`, `-`, `*`, `/`, `%`.
    -   **Comparison**: `=`, `!=` (or `<>`), `>`, `<`, `>=`, `<=`, `BETWEEN`, `LIKE`, `IN`, `IS NULL`.
    -   **Logical**: `AND`, `OR`, `NOT`.

## 6. Indexing

Indexes are special lookup tables that the database search engine can use to speed up data retrieval. DBAs use indexes to improve query performance.

-   **`CREATE INDEX`**: As shown in DDL.
-   **`DROP INDEX`**: As shown in DDL.
-   **Types**: Clustered, Non-clustered, Unique.
-   **Considerations**: While indexes speed up `SELECT` operations, they can slow down `INSERT`, `UPDATE`, and `DELETE` operations because the index also needs to be updated.

## 7. Views, Stored Procedures, and Triggers

-   **Views**: Virtual tables based on the result-set of a SQL query. They simplify complex queries and can be used for security (restricting access to certain columns/rows).
    -   `CREATE VIEW view_name AS SELECT column1, column2 FROM table_name WHERE condition;`
-   **Stored Procedures**: Pre-compiled SQL code that can be executed multiple times. They improve performance, reduce network traffic, and enhance security.
    -   `CREATE PROCEDURE procedure_name (parameters) BEGIN SQL_statements END;`
-   **Triggers**: Special types of stored procedures that automatically execute (or "fire") when a specific event occurs in the database (e.g., `INSERT`, `UPDATE`, `DELETE` on a table).
    -   `CREATE TRIGGER trigger_name BEFORE/AFTER INSERT/UPDATE/DELETE ON table_name FOR EACH ROW BEGIN SQL_statements END;`

## 8. Common SQL Clients/Tools

DBAs use various tools to interact with databases:

-   **Command-line interfaces**: `mysql` client, `psql`, `sqlplus`.
-   **Graphical User Interfaces (GUIs)**: DBeaver, SQL Developer, MySQL Workbench, pgAdmin, SSMS (SQL Server Management Studio).
