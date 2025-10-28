# PowerShell Best Practices

## Scripting Guidelines
- **Use Verb-Noun Cmdlet Naming**: Follow the standard `Verb-Noun` convention (e.g., `Get-Service`, `Set-Item`).
- **Parameter Validation**: Validate input parameters using `[ValidateNotNullOrEmpty()]` or `[ValidateSet()]`.
- **Error Handling**: Implement `try-catch-finally` blocks for robust error management.
- **Logging**: Use `Write-Host`, `Write-Output`, or `Write-Verbose` for informative logging.

## Security
- **Principle of Least Privilege**: Run scripts with the minimum necessary permissions.
- **Secure Credential Handling**: Avoid hardcoding credentials; use `Get-Credential` or secure vaults.

## Performance
- **Avoid Aliases in Scripts**: Use full cmdlet names for clarity and consistency.
- **Pipeline Efficiency**: Optimize pipeline usage to reduce object creation overhead.
