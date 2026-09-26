#!/usr/bin/env node

/**
 * Skill Validation Script
 * Validates the debug-and-fix-bugs skill structure and frontmatter
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SKILL_PATH = resolve('skill/SKILL.md');

function validateSkill() {
  console.log('🔍 Validating skill/SKILL.md...\n');

  if (!existsSync(SKILL_PATH)) {
    console.error('❌ skill/SKILL.md not found');
    process.exit(1);
  }

  const content = readFileSync(SKILL_PATH, 'utf-8');
  let errors = 0;
  let warnings = 0;

  // Check frontmatter
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (!frontmatterMatch) {
    console.error('❌ Missing frontmatter (--- ... ---)');
    errors++;
  } else {
    const frontmatter = frontmatterMatch[0];
    console.log('✅ Frontmatter present');

    // Required fields
    const requiredFields = ['name', 'description'];
    for (const field of requiredFields) {
      const regex = new RegExp(`^${field}:`, 'm');
      if (!regex.test(frontmatter)) {
        console.error(`❌ Missing required frontmatter field: ${field}`);
        errors++;
      } else {
        console.log(`✅ Frontmatter field: ${field}`);
      }
    }

    // Check name matches expected
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    if (nameMatch && nameMatch[1].trim() !== 'debug-and-fix-bugs') {
      console.warn(`⚠️  Skill name mismatch: expected 'debug-and-fix-bugs', got '${nameMatch[1].trim()}'`);
      warnings++;
    }
  }

  // Check for required phases
  const requiredPhases = [
    'Phase 0',
    'Phase 1',
    'Phase 2',
    'Phase 3',
    'Phase 4',
    'Phase 5',
    'Phase 6',
  ];

  for (const phase of requiredPhases) {
    if (content.includes(phase)) {
      console.log(`✅ Phase present: ${phase}`);
    } else {
      console.error(`❌ Missing required phase: ${phase}`);
      errors++;
    }
  }

  // Check for Operating Rules
  if (content.includes('Operating Rules')) {
    console.log('✅ Operating Rules section present');
  } else {
    console.error('❌ Missing Operating Rules section');
    errors++;
  }

  // Check for companion skill reference
  if (content.includes('production-ready-workflow')) {
    console.log('✅ Companion skill reference present');
  } else {
    console.warn('⚠️  Companion skill reference not found');
    warnings++;
  }

  // Check for invocation instruction
  if (content.includes('/debug-and-fix-bugs')) {
    console.log('✅ Invocation instruction present');
  } else {
    console.warn('⚠️  Invocation instruction not found');
    warnings++;
  }

  // Check for Phase 0 confidence gate percentage
  if (content.includes('96%') || content.includes('≥96%')) {
    console.log('✅ Phase 0 confidence gate specified');
  } else {
    console.warn('⚠️  Phase 0 confidence gate percentage not found');
    warnings++;
  }

  // Check for evidence-based language
  const evidenceKeywords = ['file/line', 'file:line', 'evidence', 'reproduction', 'capture real'];
  let evidenceFound = false;
  for (const keyword of evidenceKeywords) {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      evidenceFound = true;
      break;
    }
  }
  if (evidenceFound) {
    console.log('✅ Evidence-based language present');
  } else {
    console.warn('⚠️  Evidence-based language not strongly present');
    warnings++;
  }

  // Check for surgical discipline language
  if (content.toLowerCase().includes('surgical')) {
    console.log('✅ Surgical discipline language present');
  } else {
    console.warn('⚠️  Surgical discipline language not found');
    warnings++;
  }

  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`   Errors: ${errors}`);
  console.log(`   Warnings: ${warnings}`);

  if (errors > 0) {
    console.log('\n❌ Validation FAILED');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Validation PASSED with warnings');
    process.exit(0);
  } else {
    console.log('\n✅ Validation PASSED');
    process.exit(0);
  }
}

validateSkill();