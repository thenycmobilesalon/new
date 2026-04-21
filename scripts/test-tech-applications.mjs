#!/usr/bin/env node
/**
 * Tech (Beauty Pro) Application Form Test Harness
 *
 * Submits 5 realistic licensed-pro applications, verifies rows land in DB
 * with video_url populated, checks honeypot + rate-limit + field validation.
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

const BASE_URL = process.argv[2] || 'https://thenycmobilesalon.com'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const RUN_TAG = `test-${Date.now()}`
console.log(`\n=== Tech Application Test Harness ===`)
console.log(`Base URL: ${BASE_URL}`)
console.log(`Run tag:  ${RUN_TAG}\n`)

const applicants = [
  { name: 'Jasmine Torres', specialty: 'Hairstylist', exp: '5-10', avail: 'full-time', insta: 'jasminecuts' },
  { name: 'Marcus DeLuca', specialty: 'Barber', exp: '10+', avail: 'weekends', insta: 'marcusfades' },
  { name: 'Priya Kapoor', specialty: 'Nail Technician', exp: '2-5', avail: 'part-time', insta: 'priyanails' },
  { name: 'Danielle Ramirez', specialty: 'Makeup Artist', exp: '5-10', avail: 'flexible', insta: 'danielleglam' },
  { name: 'Sophia Lin', specialty: 'Esthetician', exp: '1-2', avail: 'full-time', insta: 'sophiaskin' },
]

function payloadFor(a, i) {
  return {
    name: a.name,
    phone: `(212) 555-${String(2000 + i).padStart(4, '0')}`,
    specialty: a.specialty,
    instagram: a.insta,
    experience: a.exp,
    availability: a.avail,
    message: `Tech test run ${RUN_TAG} — applicant ${i + 1}/5. Excited to join the mobile salon team.`,
    videoUrl: `https://example.invalid/tech-test-video-${RUN_TAG}-${i + 1}.mp4`,
  }
}

async function postOne(payload) {
  const res = await fetch(`${BASE_URL}/api/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text } }
  return { status: res.status, body: json }
}

async function querySupabase(url) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${url}`, {
    headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
  })
  return res.json()
}

async function deleteTestRows() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/applications?message=like.*${RUN_TAG}*`,
    {
      method: 'DELETE',
      headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}`, Prefer: 'return=representation' },
    }
  )
  return res.json().catch(() => null)
}

let passed = 0, failed = 0
const pass = (l) => { console.log(`  PASS  ${l}`); passed++ }
const fail = (l, d) => { console.log(`  FAIL  ${l}`); if (d) console.log(`        ${d}`); failed++ }

console.log('--- Submit 5 realistic tech applications ---')
const results = []
for (let i = 0; i < applicants.length; i++) {
  const p = payloadFor(applicants[i], i)
  const { status, body } = await postOne(p)
  if (status === 200 && body.success === true) {
    pass(`#${i + 1} ${p.name} (${p.specialty})`)
    results.push({ ok: true, phone: p.phone, name: p.name })
  } else {
    fail(`#${i + 1} ${p.name} — status ${status}`, JSON.stringify(body).slice(0, 200))
    results.push({ ok: false, phone: p.phone, name: p.name })
  }
}

console.log('\n--- Verify all 5 rows landed in DB with video_url ---')
{
  const rows = await querySupabase(
    `applications?message=like.*${RUN_TAG}*&select=id,name,specialty,video_url,created_at&order=created_at.desc`
  )
  if (Array.isArray(rows)) {
    if (rows.length === 5) pass('Exactly 5 rows found')
    else fail(`Expected 5 rows, found ${rows.length}`)

    for (const r of rows) {
      if (r.video_url && r.video_url.startsWith('https://')) {
        pass(`video_url present for ${r.name}`)
      } else {
        fail(`video_url missing for ${r.name}`)
      }
    }
  } else {
    fail('DB query did not return array', JSON.stringify(rows).slice(0, 200))
  }
}

console.log('\n--- Honeypot blocks spam ---')
{
  const hp = { ...payloadFor(applicants[0], 99), phone: '(212) 555-9999', website: 'http://spam.example' }
  const { status, body } = await postOne(hp)
  if (status === 200 && body.success === true) {
    const rows = await querySupabase(`applications?phone=eq.${encodeURIComponent(hp.phone)}&select=id`)
    if (Array.isArray(rows) && rows.length === 0) pass('Honeypot returned 200 + did not insert')
    else fail('Honeypot inserted a row', JSON.stringify(rows))
  } else {
    fail(`Honeypot expected 200, got ${status}`, JSON.stringify(body))
  }
}

console.log('\n--- Rate limit: same phone within 1hr returns 200 without duplicate ---')
{
  const dupe = payloadFor(applicants[0], 0)
  const { status, body } = await postOne(dupe)
  if (status === 200 && body.success === true) {
    const rows = await querySupabase(`applications?phone=eq.${encodeURIComponent(dupe.phone)}&select=id`)
    if (Array.isArray(rows) && rows.length === 1) pass('No duplicate row inserted')
    else fail(`Expected 1 row, got ${rows.length}`)
  } else {
    fail(`Expected 200, got ${status}`, JSON.stringify(body))
  }
}

console.log('\n--- Missing required fields rejected 400 ---')
{
  const bad = { name: 'Nobody' }
  const { status, body } = await postOne(bad)
  if (status === 400 && body.errors) pass(`400 with ${Object.keys(body.errors).length} field errors`)
  else fail(`Expected 400 + errors, got ${status}`, JSON.stringify(body))
}

console.log('\n--- Cleanup ---')
{
  const deleted = await deleteTestRows()
  console.log(`  Deleted ${Array.isArray(deleted) ? deleted.length : '?'} test rows`)
}

console.log(`\n=== Summary ===\n  Passed: ${passed}\n  Failed: ${failed}`)
if (failed > 0) process.exit(1)
console.log('\n  Tech application form is production-ready.\n')
