export function formatDateLocal(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export function getExpirationDateBounds(): { min: string; max: string } {
    const today = new Date()
    return {
        min: formatDateLocal(today),
        max: formatDateLocal(addDays(today, 30)),
    }
}

export function isExpirationDateInRange(dateStr: string, min: string, max: string): boolean {
    return dateStr >= min && dateStr <= max
}
