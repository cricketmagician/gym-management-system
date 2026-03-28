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
 * Returns the current date/time adjusted to IST for display
 */
export function getISTNow(): Date {
    const now = new Date();
    // Offset for IST (+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
}

/**
 * Returns a UTC Date object that represents the START of the current IST day/month
 * Crucial for Prisma queries like { gte: startOfISTMonth }
 */
export function getISTBoundary(type: 'day' | 'month'): Date {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(new Date());
    const val = (p: string) => parts.find(x => x.type === p)?.value;
    
    // MM/DD/YYYY format from en-US
    const year = val('year');
    const month = val('month');
    const day = type === 'month' ? '01' : val('day');
    
    // Construct ISO string with IST offset
    const isoString = `${year}-${month}-${day}T00:00:00+05:30`;
    return new Date(isoString);
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
