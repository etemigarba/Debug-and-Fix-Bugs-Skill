// Verification Script Template
// Copy to scripts/verify-fixes.ts and customize for your engagement

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { validateApiContract } from './validate-contract.js'; // Implement per project

interface Check {
  name: string;
  fn: () => boolean | Promise<boolean>;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const checks: Check[] = [
  // ==========================================
  // FORBIDDEN PATTERNS (should be GONE)
  // ==========================================
  {
    name: 'No empty catch blocks',
    fn: () => !grepPattern('catch\\s*\\{\\s*\\}', '**/*.ts'),
    severity: 'critical',
  },
  {
    name: 'No console.log in production code',
    fn: () => !grepPattern('console\\.(log|debug|info)', 'src/**/*.ts'),
    severity: 'high',
  },
  {
    name: 'No TODO/FIXME in production code',
    fn: () => !grepPattern('(TODO|FIXME|XXX|HACK)', 'src/**/*.ts'),
    severity: 'medium',
  },
  {
    name: 'No hardcoded mock data arrays',
    fn: () => !grepPattern('MOCK_|mockData|fakeData', 'src/**/*.ts'),
    severity: 'high',
  },
  {
    name: 'No inline magic numbers',
    fn: () => !grepPattern('\\b(1000|5000|30000|60000)\\b', 'src/**/*.ts'),
    severity: 'medium',
  },

  // ==========================================
  // REQUIRED HANDLERS/ENDPOINTS (should EXIST)
  // ==========================================
  {
    name: 'Request sequence token in auth service',
    fn: () => fileContains('src/services/auth.ts', 'requestSequenceToken'),
    severity: 'critical',
  },
  {
    name: 'Abort controller for stale responses',
    fn: () => fileContains('src/services/auth.ts', 'AbortController'),
    severity: 'critical',
  },
  {
    name: 'Field mapping layer in API client',
    fn: () => fileContains('src/api/client.ts', 'fieldMapping') || fileContains('src/api/client.ts', 'transformResponse'),
    severity: 'critical',
  },
  {
    name: 'Structured error logging',
    fn: () => fileContains('src/hooks/useAuth.ts', 'logger.error') || fileContains('src/hooks/useAuth.ts', 'pino'),
    severity: 'high',
  },
  {
    name: 'User-facing error surfacing',
    fn: () => fileContains('src/hooks/useAuth.ts', 'toast') || fileContains('src/hooks/useAuth.ts', 'setError'),
    severity: 'high',
  },
  {
    name: 'RFC-compliant email validator',
    fn: () => fileContains('src/utils/validation.ts', '@validateur/email') || fileContains('src/utils/validation.ts', 'validator.isEmail'),
    severity: 'high',
  },
  {
    name: 'Idempotency key generation',
    fn: () => fileContains('src/services/payment.ts', 'idempotencyKey') || fileContains('src/services/payment.ts', 'Idempotency-Key'),
    severity: 'critical',
  },
  {
    name: 'Timeout config on external calls',
    fn: () => fileContains('src/api/client.ts', 'timeout') && fileContains('src/api/client.ts', 'retries'),
    severity: 'high',
  },
  {
    name: 'Circuit breaker implementation',
    fn: () => fileExists('src/utils/circuit-breaker.ts') || fileContains('src/services/auth.ts', 'circuitBreaker'),
    severity: 'high',
  },
  {
    name: 'All 4 resource states rendered',
    fn: () => {
      const content = readFileSync('src/components/UserProfile.tsx', 'utf-8');
      return content.includes('loading') && content.includes('error') && content.includes('empty') && content.includes('ready');
    },
    severity: 'medium',
  },

  // ==========================================
  // SCHEMA VALIDATION
  // ==========================================
  {
    name: 'User API contract valid',
    fn: () => validateApiContract('src/api/contracts/user.json'),
    severity: 'critical',
  },
  {
    name: 'Auth API contract valid',
    fn: () => validateApiContract('src/api/contracts/auth.json'),
    severity: 'critical',
  },
  {
    name: 'Payment API contract valid',
    fn: () => validateApiContract('src/api/contracts/payment.json'),
    severity: 'critical',
  },

  // ==========================================
  // TESTS
  // ==========================================
  {
    name: 'Unit tests pass',
    fn: () => runCommand('npm test -- --run'),
    severity: 'critical',
  },
  {
    name: 'Integration tests pass',
    fn: () => runCommand('npm run test:integration'),
    severity: 'high',
  },
  {
    name: 'Type checking passes',
    fn: () => runCommand('npm run typecheck'),
    severity: 'high',
  },
  {
    name: 'Linting passes',
    fn: () => runCommand('npm run lint'),
    severity: 'medium',
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function grepPattern(pattern: string, glob: string): boolean {
  try {
    const result = execSync(`rg "${pattern}" --glob "${glob}"`, { encoding: 'utf-8', stdio: 'pipe' });
    return result.trim().length > 0;
  } catch {
    return false; // rg returns non-zero if no matches
  }
}

function fileContains(filePath: string, search: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return content.includes(search);
  } catch {
    return false;
  }
}

function fileExists(filePath: string): boolean {
  try {
    statSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function runCommand(cmd: string): boolean {
  try {
    execSync(cmd, { stdio: 'ignore', timeout: 120000 });
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// MAIN EXECUTION
// ==========================================

async function main() {
  console.log('🔍 Running verification checks...\n');

  let passed = 0;
  let failed = 0;
  const failedChecks: string[] = [];

  for (const check of checks) {
    try {
      const result = await check.fn();
      if (result) {
        console.log(`  ✅ ${check.name}`);
        passed++;
      } else {
        console.log(`  ❌ ${check.name} [${check.severity}]`);
        failed++;
        failedChecks.push(`${check.name} (${check.severity})`);
      }
    } catch (error) {
      console.log(`  💥 ${check.name} [ERROR: ${error}]`);
      failed++;
      failedChecks.push(`${check.name} (error)`);
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('\n❌ Failed checks:');
    failedChecks.forEach(f => console.log(`  - ${f}`));
    process.exit(1);
  }

  console.log('\n✅ All verification checks passed!');
}

main().catch(console.error);