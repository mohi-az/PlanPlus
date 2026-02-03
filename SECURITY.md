# Security Policy

## Supported Versions

Currently, only the latest version of PlanPlus is being actively maintained and receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly. **Do not create a public GitHub issue.**

### How to Report

1. **Email**: Send details to the repository owner
2. **Include**: 
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Fix Timeline**: Varies based on severity
  - Critical: 1-7 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Best effort

## Security Best Practices

When deploying PlanPlus:

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, randomly generated secrets
   - Rotate secrets periodically

2. **Database**
   - Use strong database passwords
   - Restrict database access to necessary IPs only
   - Enable SSL/TLS for database connections

3. **Authentication**
   - Enable OAuth providers when possible
   - Use strong password policies
   - Implement rate limiting for login attempts

4. **Updates**
   - Keep dependencies up to date
   - Monitor for security advisories
   - Run `npm audit` regularly

5. **Deployment**
   - Use HTTPS only
   - Enable CORS properly
   - Implement proper logging and monitoring

## Known Security Considerations

1. **Dependency Vulnerabilities**: Run `npm audit` to check for known vulnerabilities in dependencies
2. **Input Validation**: All user inputs are validated using Zod schemas
3. **SQL Injection**: Prisma ORM provides protection against SQL injection
4. **XSS Protection**: React provides built-in XSS protection through JSX escaping

## Security Headers

Ensure your deployment includes proper security headers:

```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Regular Security Audits

- Dependencies are scanned for vulnerabilities
- Code is reviewed for security issues
- Regular updates are applied

Thank you for helping keep PlanPlus secure!
