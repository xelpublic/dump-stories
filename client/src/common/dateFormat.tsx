
export const ruDateFormatLong = (date: Date): string => {
    var Time = new Date(date); // Анализировать дату и возвращать целое число.
    var y = Time.getFullYear(); // год
    if (!y || isNaN(y)) {
        return '';
    }
    var m = Time.getMonth() + 1; // месяц
    var mStr = m < 10 ? ('0' + m) : m;
    var d = Time.getDate();// день
    var dStr = d < 10 ? ('0' + d) : d.toString();
    var h = Time.getHours(); // Час
    var minute = Time.getMinutes(); // минута
    var minuteStr = minute < 10 ? ('0' + minute) : minute.toString();
    // var Seconds = Time.getSeconds(); // секунда
    return dStr + '.' + mStr + '.' + y + ' ' + h + ':' + minuteStr;//    y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + Seconds
}

//module.exports = { ruDateFormatLong }