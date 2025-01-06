export function formatDate(date = new Date(), type = "date") {
    if (typeof date === "string") date = new Date(date);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    const format_date = [year, month, day].map(n => n < 10 ? '0' + n : n).join('-');
    let format_time = type === "datetime" ? [hour, min, sec].map(n => n < 10 ? '0' + n : n).join(':') : null;

    if (type === 'date') {
        return format_date;
    }

    return `${ format_date } ${ format_time }`;
}