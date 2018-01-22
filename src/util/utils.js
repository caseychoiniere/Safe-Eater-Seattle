import moment from 'moment';

export function generateUniqueKey() {
        let i, random;
        let uuid = '';
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & (3 | 8)) : random)).toString(16);
        }
        return uuid;
}

export function formatDate(date) {
    date !== null ? date = moment(date).format("MMMM Do, YYYY") : '';
    return date;
}

export function formatLongDate(date) {
    date !== null ? date = moment(date).format("LLL") : '';
    return date;
}

export function debounce(fn, time) {
    let timeout;
    return function() {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}