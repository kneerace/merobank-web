/**
 * Resolves a dot-notation path against an object
 * e.g. getValue({ caseDetails: { caseTypeName: "auto" } }, "caseDetails.caseTypeName")
 * returns "auto"
 */
export function getValue(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((obj: unknown, key: string) => {
    if (obj && typeof obj === 'object') {
      return (obj as Record<string, unknown>)[key]
    }
    return undefined
  }, data)
}

/**
 * Formats a value based on formatter name
 * Mirrors the primaryValueFormatter pattern in enterprise refdata
 */
export function formatValue(value: unknown, formatter?: string): string {
  if (value === null || value === undefined) return '—'

  switch (formatter) {
    case 'startCase':
      return String(value)
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())

    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(Number(value))

    case 'date':
      return new Date(String(value)).toLocaleDateString()

    case 'dateTime':
      return new Date(String(value)).toLocaleString()

    default:
      return String(value)
  }
}