import { Timestamp } from 'firebase/firestore';

/**
 * Calculate the end date based on the start date and package duration
 */
export function calculateEndDate(
    startDate: Date,
    duration: number,
    durationType: 'day' | 'week' | 'month' | 'year'
): Date {
    const endDate = new Date(startDate);

    switch (durationType) {
        case 'day':
            endDate.setDate(endDate.getDate() + duration);
            break;
        case 'week':
            endDate.setDate(endDate.getDate() + duration * 7);
            break;
        case 'month':
            // Fixed: 1 month = 30 days
            endDate.setDate(endDate.getDate() + duration * 30);
            break;
        case 'year':
            // Fixed: 1 year = 365 days
            endDate.setDate(endDate.getDate() + duration * 365);
            break;
    }

    return endDate;
}

/**
 * Check if a subscription is expiring soon (within 7 days)
 */
/**
 * Check if a subscription is expiring soon (within 7 days)
 */
export function isExpiringSoon(endDate: Date): boolean {
    const daysUntilExpiry = getDaysUntilExpiry(endDate);
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
}

/**
 * Determine the status based on the end date
 */
export function getStatus(endDate: Date): 'active' | 'expired' | 'expiring-soon' {
    const daysUntilExpiry = getDaysUntilExpiry(endDate);

    if (daysUntilExpiry < 0) {
        return 'expired';
    } else if (daysUntilExpiry <= 7) {
        return 'expiring-soon';
    } else {
        return 'active';
    }
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | Timestamp | any): string {
    // Handle Firestore Timestamp or localStorage mock with toDate() method
    let dateObj = (date && typeof date.toDate === 'function') ? date.toDate() : date;

    // Handle serialized Timestamp { seconds, nanoseconds }
    if (date && typeof date.seconds === 'number') {
        dateObj = new Date(date.seconds * 1000);
    }

    // Handle string input (from API)
    if (typeof dateObj === 'string') {
        dateObj = new Date(dateObj);
    }

    // Ensure we have a valid Date object
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | Timestamp | any): string {
    // Handle Firestore Timestamp or localStorage mock with toDate() method
    let dateObj = (date && typeof date.toDate === 'function') ? date.toDate() : date;

    // Handle serialized Timestamp { seconds, nanoseconds }
    if (date && typeof date.seconds === 'number') {
        dateObj = new Date(date.seconds * 1000);
    }

    // Handle string input (from API)
    if (typeof dateObj === 'string') {
        dateObj = new Date(dateObj);
    }

    // Ensure we have a valid Date object
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return '';
    }

    return dateObj.toISOString().split('T')[0];
}

/**
 * Get the number of days until expiration
 */
export function getDaysUntilExpiry(endDate: Date): number {
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
