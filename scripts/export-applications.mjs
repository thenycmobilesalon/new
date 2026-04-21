#!/usr/bin/env node
/**
 * Export all applications (tech + CEO) + leads to CSV files.
 *
 * Usage:
 *   node scripts/export-applications.mjs [OUTPUT_DIR]
 *
 * Defaults to ./exports/. Creates dated subfolder.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Load .env.local
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing Supabase env vars in .env.local')
  process.exit(1)
}

const outputBase = process.argv[2] || path.join(projectRoot, 'exports')
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const outputDir = path.join(outputBase, `export-${stamp}`)
fs.mkdirSync(outputDir, { recursive: true })

async function fetchAll(table) {
  // paginate in case of large tables
  const rows = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc&offset=${from}&limit=${pageSize}`,
      {
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
        },
      }
    )
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`${table}: ${res.status} ${text.slice(0, 200)}`)
    }
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    rows.push(...batch)
    if (batch.length < pageSize) break
    from += pageSize
  }
  return rows
}

function csvEscape(val) {
  if (val === null || val === undefined) return ''
  const s = typeof val === 'string' ? val : String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function toCSV(rows) {
  if (rows.length === 0) return ''
  const columns = Object.keys(rows[0])
  const header = columns.join(',')
  const body = rows.map((r) => columns.map((c) => csvEscape(r[c])).join(',')).join('\n')
  return header + '\n' + body + '\n'
}

console.log(`\nExporting to ${outputDir}\n`)

const tables = [
  { name: 'applications', label: 'Tech applicants (licensed pros)' },
  { name: 'ceo_applications', label: 'Founding CEO applicants' },
  { name: 'leads', label: 'Booking leads + contact form' },
]

let grandTotal = 0
for (const { name, label } of tables) {
  try {
    const rows = await fetchAll(name)
    const filename = path.join(outputDir, `${name}.csv`)
    fs.writeFileSync(filename, toCSV(rows))
    console.log(`  ${label.padEnd(40)} ${String(rows.length).padStart(5)} rows → ${path.basename(filename)}`)
    grandTotal += rows.length
  } catch (err) {
    console.log(`  ${label.padEnd(40)}   ERROR: ${err.message}`)
  }
}

console.log(`\n  Total: ${grandTotal} rows across ${tables.length} files.`)
console.log(`  Files live at: ${outputDir}\n`)
