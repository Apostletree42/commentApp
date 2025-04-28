import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
};

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
};