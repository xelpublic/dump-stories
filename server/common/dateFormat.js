
function ruDateFormatLong(date) {
    var Time = new Date(date) // Анализировать дату и возвращать целое число.
    var y = Time.getFullYear() // год
    var m = Time.getMonth() + 1 // месяц
    m = m < 10 ? ('0' + m) : m
    var d = Time.getDate() // день
    d = d < 10 ? ('0' + d) : d
    var h = Time.getHours() // Час
    var minute = Time.getMinutes() // минута
    minute = minute < 10 ? ('0' + minute) : minute
    var Seconds = Time.getSeconds() // секунда
    return d + '.' + m + '.' + y + ' ' + h + ':' + minute//    y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + Seconds
}

module.exports = { ruDateFormatLong }