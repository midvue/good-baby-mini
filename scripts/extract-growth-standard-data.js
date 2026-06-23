const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..', '..')
const markdownPath = path.join(rootDir, '.tmp_pdf', 'deepseek_markdown_20260622_a9af02.md')
const outputPath = path.join(
  rootDir,
  'good-baby-mini',
  'packages',
  'core',
  'src',
  'pages',
  'sub-summary',
  'chart',
  'data.ts'
)

const percentiles = ['3%', '10%', '25%', '50%', '75%', '90%', '97%']

function readTables() {
  const markdown = fs.readFileSync(markdownPath, 'utf8')
  const blocks = markdown.split(/\n\s*\n/)
  const tables = []

  for (const block of blocks) {
    const rows = []
    const lines = block
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith('|'))

    for (const line of lines) {
      const cells = line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim())

      if (cells.length !== 8 || !/^\d+(?:\.\d+)?$/.test(cells[1] || '')) continue
      rows.push(cells.slice(1).map(Number))
    }

    if (rows.length) tables.push(rows)
  }

  return tables
}

function toPercentileData(rows) {
  const data = {}
  percentiles.forEach((key, index) => {
    data[key] = rows.map((row) => row[index])
  })
  return data
}

function formatNumber(value) {
  return Number.isInteger(value) ? value.toFixed(1) : String(value)
}

function formatArray(values, indent = '    ') {
  const lines = []
  for (let index = 0; index < values.length; index += 12) {
    lines.push(
      `${indent}${values
        .slice(index, index + 12)
        .map(formatNumber)
        .join(', ')}`
    )
  }
  return `[\n${lines.join(',\n')}\n  ]`
}

function formatStringArray(values) {
  const lines = []
  for (let index = 0; index < values.length; index += 12) {
    lines.push(
      `  ${values
        .slice(index, index + 12)
        .map((value) => `'${value}'`)
        .join(', ')}`
    )
  }
  return `[\n${lines.join(',\n')}\n]`
}

function formatData(name, data) {
  const entries = percentiles
    .map((key) => `  '${key}': ${formatArray(data[key])}`)
    .join(',\n')
  return `export let ${name}: PercentileData = {\n${entries}\n}`
}

const tables = readTables()
if (tables.length < 12) {
  throw new Error(`Expected at least 12 numeric tables, got ${tables.length}`)
}

const month = '\u6708'
const year = '\u5c81'

const heightWeightLabels = [
  ...Array.from({ length: 12 }, (_, index) => `${index}${month}`),
  `1${year}`,
  ...Array.from({ length: 11 }, (_, index) => `1${year}${index + 1}${month}`),
  `2${year}`,
  `2${year}3${month}`,
  `2${year}6${month}`,
  `2${year}9${month}`,
  `3${year}`,
  `3${year}3${month}`,
  `3${year}6${month}`,
  `3${year}9${month}`,
  `4${year}`,
  `4${year}3${month}`,
  `4${year}6${month}`,
  `4${year}9${month}`,
  `5${year}`,
  `5${year}3${month}`,
  `5${year}6${month}`,
  `5${year}9${month}`,
  `6${year}`,
  `6${year}3${month}`,
  `6${year}6${month}`,
  `6${year}9${month}`
]

const headCircumferenceLabels = [
  ...Array.from({ length: 12 }, (_, index) => `${index}${month}`),
  `1${year}`,
  ...Array.from({ length: 11 }, (_, index) => `1${year}${index + 1}${month}`),
  `2${year}`,
  `2${year}3${month}`,
  `2${year}6${month}`,
  `2${year}9${month}`,
  `3${year}`
]

const heightWeightAgeMonths = [
  ...Array.from({ length: 25 }, (_, index) => index),
  27,
  30,
  33,
  36,
  39,
  42,
  45,
  48,
  51,
  54,
  57,
  60,
  63,
  66,
  69,
  72,
  75,
  78,
  81
]

const headCircumferenceAgeMonths = [
  ...Array.from({ length: 25 }, (_, index) => index),
  27,
  30,
  33,
  36
]

const datasets = {
  maleWeight: toPercentileData(tables[0]),
  femaleWeight: toPercentileData(tables[1]),
  maleHeight: toPercentileData(tables[2]),
  femaleHeight: toPercentileData(tables[3]),
  maleHeadCircumference: toPercentileData(tables[10]),
  femaleHeadCircumference: toPercentileData(tables[11])
}

const output = `/**
 * WS/T 423-2022 growth percentile reference data.
 * Source: .tmp_pdf/deepseek_markdown_20260622_a9af02.md
 *
 * Height and weight use 44 age rows: monthly from 0-24 months,
 * then quarterly from 2y3m through 6y9m.
 * Head circumference uses 29 age rows: monthly from 0-24 months,
 * then quarterly from 2y3m through 3y.
 */
export type PercentileKey = '3%' | '10%' | '25%' | '50%' | '75%' | '90%' | '97%'

export type PercentileData = Record<PercentileKey, number[]>

export const heightWeightAgeLabels = ${formatStringArray(heightWeightLabels)}

export const headCircumferenceAgeLabels = ${formatStringArray(headCircumferenceLabels)}

export const heightWeightAgeMonths = ${formatArray(heightWeightAgeMonths, '  ')}

export const headCircumferenceAgeMonths = ${formatArray(headCircumferenceAgeMonths, '  ')}

${formatData('femaleHeight', datasets.femaleHeight)}

${formatData('maleHeight', datasets.maleHeight)}

${formatData('femaleWeight', datasets.femaleWeight)}

${formatData('maleWeight', datasets.maleWeight)}

${formatData('femaleHeadCircumference', datasets.femaleHeadCircumference)}

${formatData('maleHeadCircumference', datasets.maleHeadCircumference)}
`

fs.writeFileSync(outputPath, output, 'utf8')
console.log(`Generated ${path.relative(rootDir, outputPath)}`)
