/**
 * Formats a date to India Standard Time (IST)
 * @param date The date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string in IST
 */
export function formatIST(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...options
    });
}

/**
 * Formats a date for membership display (e.g., 3/26/2026) in IST
 */
export function formatMemberDate(date: Date | string | number): string {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    // Manual format to MM/DD/YYYY in IST
    const parts = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).formatToParts(d);
    
    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const year = parts.find(p => p.type === 'year')?.value;
    
    return `${month}/${day}/${year}`;
}

/**
 * Formats a timestamp for check-in display in IST
 */
export function formatCheckinTime(date: Date | string | number): string {
    return formatIST(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
