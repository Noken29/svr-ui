export const formatDate = (rawDate: string): string => {
    const date = new Date(rawDate)
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
};