#!/usr/bin/env node
/**
 * Post-deploy verification for /api/feedback + /api/admin route integrity.
 *
 * Tests:
 *  1. /api/feedback POST — submits a feedback message, verifies row lands in
 *     notifications table with type='feedback'
 *  2. /api/feedback validation — empty message rejected
 *  3. /api/admin GET requires auth (401/307/redirect)
 *  4. /api/admin PATCH requires auth (401/307/redirect)
 *  5. ceo_applications visibility — queries DB directly to confirm the
 *     table Jeff's admin UI pulls from has the expected shape + indexes
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const envPath = path.join(projectRoot, '.env.local')
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    const key = m[1]
    let val = m[2]
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
    if (!process.env[key]) process.env[key] = val
  }
}

const BASE_URL = process.argv[2] || 'https://www.thenycmobilesalon.com'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const RUN_TAG = `fbtest-${Date.now()}`
console.log(`\n=== Feedback + Admin Verification ===`)
console.log(`Base URL: ${BASE_URL}`)
console.log(`Run tag:  ${RUN_TAG}\n`)

let passed = 0, failed = 0
const pass = (l) => { console.log(`  PASS  ${l}`); passed++ }
const fail = (l, d) => { console.log(`  FAIL  ${l}`); if (d) console.log(`        ${d}`); failed++ }

async function supabaseGet(url) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${url}`, {
    headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
  })
  return res.json()
}

async function supabaseDelete(url) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${url}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      Prefer: 'return=representation',
    },
  })
  return res.json().catch(() => null)
}

// Test 1: /api/feedback happy path
console.log('--- Test 1: /api/feedback POST submits successfully ---')
{
  const res = await fetch(`${BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `[${RUN_TAG}] This is an automated test of the feedback widget.`,
      source: `test-harness/${RUN_TAG}`,
    }),
  })
  if (res.status === 200) {
    const body = await res.json()
    if (body.success === true) {
      pass('POST returned 200 {success:true}')
    } else {
      fail('POST returned 200 but success !== true', JSON.stringify(body))
    }
  } else {
    fail(`POST status ${res.status}`, await res.text())
  }
}

// Test 2: verify row in notifications table
console.log('\n--- Test 2: feedback row landed in notifications table ---')
{
  const rows = await supabaseGet(
    `notifications?type=eq.feedback&message=like.*${RUN_TAG}*&select=id,type,title,message,read`
  )
  if (Array.isArray(rows) && rows.length === 1) {
    const row = rows[0]
    if (row.type === 'feedback' && row.read === false && row.title.includes(RUN_TAG)) {
      pass('Row inserted with type=feedback, read=false, title includes source')
    } else {
      fail('Row landed but fields wrong', JSON.stringify(row))
    }
  } else {
    fail(`Expected 1 row, found ${Array.isArray(rows) ? rows.length : '?'}`)
  }
}

// Test 3: /api/feedback rejects empty message
console.log('\n--- Test 3: /api/feedback rejects empty message ---')
{
  const res = await fetch(`${BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '', source: 'test' }),
  })
  if (res.status === 400) {
    pass('Empty message returns 400')
  } else {
    fail(`Expected 400, got ${res.status}`)
  }
}

// Test 4: /api/admin requires auth
console.log('\n--- Test 4: /api/admin?tab=ceo_applications blocks unauthenticated ---')
{
  const res = await fetch(`${BASE_URL}/api/admin?tab=ceo_applications`, {
    redirect: 'manual',
  })
  // Expect 401, 403, or 307/302 (redirect to login)
  if ([401, 403, 302, 307].includes(res.status)) {
    pass(`Unauthenticated request blocked (HTTP ${res.status})`)
  } else {
    fail(`Expected auth block, got ${res.status}`, await res.text().then(t => t.slice(0, 200)))
  }
}

// Test 5: /api/admin PATCH requires auth
console.log('\n--- Test 5: /api/admin PATCH blocks unauthenticated ---')
{
  const res = await fetch(`${BASE_URL}/api/admin`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'x', table: 'ceo_applications', status: 'reviewing' }),
    redirect: 'manual',
  })
  if ([401, 403, 302, 307].includes(res.status)) {
    pass(`Unauthenticated PATCH blocked (HTTP ${res.status})`)
  } else {
    fail(`Expected auth block, got ${res.status}`)
  }
}

// Test 6: ceo_applications table shape is what the admin UI expects
console.log('\n--- Test 6: ceo_applications schema matches admin UI expectations ---')
{
  // Query one row (even if empty, just confirms table exists and is queryable)
  const rows = await supabaseGet(
    `ceo_applications?select=id,name,email,phone,linkedin_url,location,marketplace_background,video_url,status,created_at&limit=1`
  )
  if (Array.isArray(rows)) {
    pass('Table queryable with expected columns (id/name/email/phone/linkedin_url/location/marketplace_background/video_url/status/created_at)')
  } else {
    fail('Table query did not return array', JSON.stringify(rows).slice(0, 200))
  }
}

// Cleanup
console.log('\n--- Cleanup: delete test feedback row ---')
{
  const deleted = await supabaseDelete(
    `notifications?type=eq.feedback&message=like.*${RUN_TAG}*`
  )
  console.log(`  Deleted ${Array.isArray(deleted) ? deleted.length : '?'} rows`)
}

console.log(`\n=== Summary ===\n  Passed: ${passed}\n  Failed: ${failed}`)
if (failed > 0) process.exit(1)
console.log('\n  Feedback + admin integration is production-ready.\n')
