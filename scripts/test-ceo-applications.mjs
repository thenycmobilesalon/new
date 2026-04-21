#!/usr/bin/env node
/**
 * CEO Application Form Test Harness
 *
 * Submits 10 realistic CEO applications against the API, then queries Supabase
 * directly to verify every row landed. Also runs edge-case checks: honeypot,
 * rate limit, missing required fields.
 *
 * Usage:
 *   node scripts/test-ceo-applications.mjs [BASE_URL]
 *
 * Defaults to https://thenycmobilesalon.com if BASE_URL not provided.
 *
 * Requires in .env.local (auto-loaded):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// --- Load .env.local --------------------------------------------------------
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
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Unique run tag so we can find and clean up these test rows
const RUN_TAG = `test-${Date.now()}`
console.log(`\n=== CEO Application Test Harness ===`)
console.log(`Base URL: ${BASE_URL}`)
console.log(`Run tag:  ${RUN_TAG}`)
console.log('')

// --- Test applicants --------------------------------------------------------
const applicants = [
  {
    name: 'Sasha Patel',
    marketplace: 'Glamsquad',
    role: 'VP of Operations',
    company: 'Glamsquad',
    yearsExp: '5-10',
    platform: 'Glamsquad',
    pl: 'owned-full',
    teamSize: '50-200',
    biggestScale: 'Ran NYC + LA operations. Scaled from $400K to $4.8M monthly GMV over 22 months. 180 active providers.',
  },
  {
    name: 'Marcus Chen',
    marketplace: 'Soothe',
    role: 'Director of Supply',
    company: 'Soothe',
    yearsExp: '5-10',
    platform: 'Soothe',
    pl: 'owned-unit',
    teamSize: '15-50',
    biggestScale: 'Owned supply ops for 6 markets. 1,200 active therapists, $2.4M monthly GMV at peak.',
  },
  {
    name: 'Aisha Johnson',
    marketplace: 'StyleSeat',
    role: 'Head of Growth',
    company: 'StyleSeat',
    yearsExp: '10+',
    platform: 'StyleSeat',
    pl: 'owned-full',
    teamSize: '50-200',
    biggestScale: 'Led growth at StyleSeat from $18M to $62M ARR. Hired 40 people across growth and ops.',
  },
  {
    name: 'Daniel Rivera',
    marketplace: 'Priv',
    role: 'General Manager, NYC',
    company: 'Priv',
    yearsExp: '5-10',
    platform: 'Priv',
    pl: 'owned-unit',
    teamSize: '15-50',
    biggestScale: 'NYC market P&L at Priv. Scaled to $1.8M GMV/mo before acquisition. Hired 22-person ops team.',
  },
  {
    name: 'Emma Wright',
    marketplace: 'Urban Company',
    role: 'Director of Operations',
    company: 'Urban Company (formerly UrbanClap)',
    yearsExp: '10+',
    platform: 'Urban Company',
    pl: 'owned-full',
    teamSize: '200+',
    biggestScale: 'Ran beauty vertical globally at UC. $40M+ monthly GMV, 15,000 partners. Opened 4 new markets.',
  },
  {
    name: 'Kofi Mensah',
    marketplace: 'Handy',
    role: 'VP Ops',
    company: 'Handy',
    yearsExp: '10+',
    platform: 'Handy',
    pl: 'owned-full',
    teamSize: '50-200',
    biggestScale: 'Handy VP of Ops 2018-2022. Grew pro base from 3K to 28K, 11 metros, owned CAC/LTV and unit economics.',
  },
  {
    name: 'Leah Goldstein',
    marketplace: 'BeGlammed',
    role: 'COO',
    company: 'BeGlammed',
    yearsExp: '5-10',
    platform: 'BeGlammed',
    pl: 'owned-full',
    teamSize: '15-50',
    biggestScale: 'BeGlammed COO. 800 artists on platform at peak, $1.1M monthly GMV, profitable by year 2.',
  },
  {
    name: 'Carlos Duarte',
    marketplace: 'TaskRabbit',
    role: 'Director, East Coast',
    company: 'TaskRabbit / IKEA',
    yearsExp: '10+',
    platform: 'TaskRabbit',
    pl: 'owned-unit',
    teamSize: '50-200',
    biggestScale: 'East Coast regional lead at TaskRabbit post-IKEA acquisition. 8 markets, $14M annual GMV.',
  },
  {
    name: 'Priya Venkatesh',
    marketplace: 'Zeel',
    role: 'Head of Provider Ops',
    company: 'Zeel',
    yearsExp: '5-10',
    platform: 'Zeel',
    pl: 'contributed',
    teamSize: '15-50',
    biggestScale: 'Owned provider ops at Zeel across 10 metros. Recruited and onboarded 2,100 massage therapists.',
  },
  {
    name: 'James O\'Brien',
    marketplace: 'Booksy',
    role: 'GM, North America',
    company: 'Booksy',
    yearsExp: '10+',
    platform: 'Booksy',
    pl: 'owned-full',
    teamSize: '200+',
    biggestScale: 'GM North America at Booksy. Scaled US from 12K to 80K barbershops/salons on platform. Owned full P&L.',
  },
]

function payloadFor(a, i) {
  return {
    name: a.name,
    email: `${RUN_TAG}-${i + 1}@test.thenycmobilesalon.com`,
    phone: `(212) 555-${String(1000 + i).padStart(4, '0')}`,
    linkedinUrl: `https://linkedin.com/in/${a.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    location: i % 4 === 0 ? 'nyc-relocating' : 'nyc-current',
    currentRole: a.role,
    currentCompany: a.company,
    yearsExperience: a.yearsExp,
    marketplaceBackground: a.platform,
    otherPlatforms: i % 3 === 0 ? 'ClassPass, Rinse' : '',
    plExperience: a.pl,
    teamSize: a.teamSize,
    biggestScale: a.biggestScale,
    whySweatEquity: `At this stage of my career I'd rather trade cash comp for meaningful equity in a business with real traction. I've watched too many salary-only operator gigs end with zero skin in the game after 3 years of work. 21,100 indexed pages + $0 capital ask is exactly the shape of opportunity I'd bet a year on. [test-run=${RUN_TAG}]`,
    plan306090: `Days 1-30: full data access, shadow founder inbound pipeline, 1:1s with top 20 recent applicants. Write hiring plan. Days 31-60: Hire dispatcher + CX lead. Close top 10 inbound leads. Launch hotel concierge outreach. Days 61-90: First $50K revenue month. Operational playbook v1 shipped. Founder transitions out of day-to-day.`,
    anythingElse: `Test run tag: ${RUN_TAG} — applicant ${i + 1}/10`,
    videoUrl: `https://example.invalid/test-video-${RUN_TAG}-${i + 1}.mp4`,
    resumeUrl: i % 2 === 0 ? `https://example.invalid/test-resume-${RUN_TAG}-${i + 1}.pdf` : null,
  }
}

async function postOne(payload) {
  const res = await fetch(`${BASE_URL}/api/apply-ceo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { status: res.status, body: json }
}

async function querySupabase(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
    },
  })
  return res.json()
}

async function deleteTestRows() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ceo_applications?anything_else=like.*${RUN_TAG}*`,
    {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        Prefer: 'return=representation',
      },
    }
  )
  return res.json().catch(() => null)
}

// --- Main -------------------------------------------------------------------
let passed = 0
let failed = 0

function pass(label) {
  console.log(`  PASS  ${label}`)
  passed++
}
function fail(label, detail) {
  console.log(`  FAIL  ${label}`)
  if (detail) console.log(`        ${detail}`)
  failed++
}

console.log('--- Test 1: ceo_applications table exists ---')
{
  const probe = await fetch(
    `${SUPABASE_URL}/rest/v1/ceo_applications?select=id&limit=1`,
    {
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
    }
  )
  if (probe.status === 200) {
    pass('Table exists and is queryable')
  } else {
    fail(`Table probe returned ${probe.status}`, await probe.text())
    console.log('\nABORTING. Run supabase-ceo-applications.sql in the Supabase dashboard before retrying.')
    process.exit(1)
  }
}

console.log('\n--- Test 2: Submit 10 realistic applications ---')
const submissionResults = []
for (let i = 0; i < applicants.length; i++) {
  const payload = payloadFor(applicants[i], i)
  const { status, body } = await postOne(payload)
  if (status === 200 && body.success === true) {
    pass(`#${i + 1} ${payload.name} (${applicants[i].platform})`)
    submissionResults.push({ ok: true, email: payload.email, name: payload.name })
  } else {
    fail(
      `#${i + 1} ${payload.name} — status ${status}`,
      JSON.stringify(body).slice(0, 200)
    )
    submissionResults.push({ ok: false, email: payload.email, name: payload.name, status, body })
  }
}

console.log('\n--- Test 3: Verify all 10 rows landed in DB ---')
{
  const rows = await querySupabase(
    `ceo_applications?anything_else=like.*${RUN_TAG}*&select=id,name,email,marketplace_background,video_url,resume_url&order=created_at.desc`
  )
  if (Array.isArray(rows)) {
    if (rows.length === 10) {
      pass(`Exactly 10 rows found for this run`)
    } else {
      fail(`Expected 10 rows, found ${rows.length}`)
    }

    for (const result of submissionResults.filter((r) => r.ok)) {
      const row = rows.find((r) => r.email === result.email)
      if (row) {
        pass(`Row for ${result.name} — marketplace=${row.marketplace_background}`)
      } else {
        fail(`Missing row for ${result.name} (email=${result.email})`)
      }
    }
  } else {
    fail('DB query did not return an array', JSON.stringify(rows).slice(0, 200))
  }
}

console.log('\n--- Test 4: Honeypot blocks spam submission ---')
{
  const honeypotPayload = {
    ...payloadFor(applicants[0], 99),
    email: `${RUN_TAG}-honeypot@test.thenycmobilesalon.com`,
    website: 'http://spammer.example.com', // bot fills this
  }
  const { status, body } = await postOne(honeypotPayload)
  if (status === 200 && body.success === true) {
    // Now verify no row was actually inserted
    const rows = await querySupabase(
      `ceo_applications?email=eq.${honeypotPayload.email}&select=id`
    )
    if (Array.isArray(rows) && rows.length === 0) {
      pass('Honeypot returned 200 but did not insert (correct bot-repellent behavior)')
    } else {
      fail('Honeypot returned 200 AND inserted — honeypot is broken', JSON.stringify(rows))
    }
  } else {
    fail(`Honeypot expected 200 {success:true}, got ${status}`, JSON.stringify(body))
  }
}

console.log('\n--- Test 5: Rate limit — same email within 1 hour ---')
{
  const dupe = payloadFor(applicants[0], 0) // re-use applicant #1 email
  const { status, body } = await postOne(dupe)
  if (status === 200 && body.success === true) {
    // Should have returned success without creating a second row
    const rows = await querySupabase(
      `ceo_applications?email=eq.${dupe.email}&select=id`
    )
    if (Array.isArray(rows) && rows.length === 1) {
      pass('Rate limit silently succeeded (no duplicate row)')
    } else {
      fail(`Expected 1 row, got ${rows.length}`, JSON.stringify(rows))
    }
  } else {
    fail(`Rate limit retry expected 200 {success:true}, got ${status}`, JSON.stringify(body))
  }
}

console.log('\n--- Test 6: Missing required fields rejected with 400 ---')
{
  const bad = { name: 'Incomplete Person', email: 'incomplete@test.com' }
  const { status, body } = await postOne(bad)
  if (status === 400 && body.errors) {
    pass(`Returned 400 with ${Object.keys(body.errors).length} field errors`)
  } else {
    fail(`Expected 400 with errors object, got ${status}`, JSON.stringify(body))
  }
}

console.log('\n--- Test 7: No video URL rejected ---')
{
  const noVideo = { ...payloadFor(applicants[1], 100), email: `${RUN_TAG}-novideo@t.c`, videoUrl: null }
  const { status, body } = await postOne(noVideo)
  if (status === 400 && body.errors && body.errors.videoUrl) {
    pass('Returned 400 with videoUrl error')
  } else {
    fail(`Expected 400 with videoUrl error, got ${status}`, JSON.stringify(body))
  }
}

// --- Cleanup ----------------------------------------------------------------
console.log('\n--- Cleanup: delete test rows ---')
{
  const deleted = await deleteTestRows()
  if (Array.isArray(deleted)) {
    console.log(`  Deleted ${deleted.length} test rows.`)
  } else {
    console.log(`  Cleanup response: ${JSON.stringify(deleted).slice(0, 200)}`)
  }
}

// --- Summary ----------------------------------------------------------------
console.log('\n=== Summary ===')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}`)
if (failed > 0) {
  console.log('\n  One or more tests failed. Review output above.')
  process.exit(1)
}
console.log('\n  All tests passed. Form is production-ready.\n')
