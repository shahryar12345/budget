import moment from 'moment'

export function convertUTCDateToLocalDate(date) {
    console.log('tareekh',date)
    var recDate=parseDate(date);
console.log(recDate)
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  console.log('parts' , parts)
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}


export function convertUTCDateToLocalDateLocalString(date, format, showTime) {
  var updatedate = moment.utc(date).local().format(format.toUpperCase());
  updatedate = updatedate + (showTime? " " + getTime(date) : "");
  return updatedate;   
}


export function getTime(date){
  var dateTime = moment.utc(date).toDate();  
  return dateTime.toLocaleTimeString("en-US");
}