import { ZonedDate } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/all';

export function getOffsetByTimezone(timezone: string): number {
  return ZonedDate.fromLocalDate(new Date(), timezone).timezoneOffset;
}

function getDateStringByOffset(
  offset: number,
  year: number,
  month: number,
  date: number,
  hours: number,
  minutes: number
): string {
  return `${month + 1} ${date} ${year} ${hours}:${minutes}:00 ${getGMTString(
    offset
  )}`;
}

function getGMTString(offset: number) {
  if (offset > 0) {
    return `-${getTwoDigitNumber(offset / 60)}${getTwoDigitNumber(
      offset % 60
    )}`;
  } else {
    return `+${getTwoDigitNumber(offset / 60)}${getTwoDigitNumber(
      offset % 60
    )}`;
  }
}

function getTwoDigitNumber(number: Number): string {
  if (!number) {
    return '00';
  }
  if (number == 0) {
    return '00';
  }
  if (number < 10) {
    return `0${number}`;
  }
  return `${number}`;
}

export function GetUTCDateForLocalDateValues(date: Date): Date {
    date = new Date(date);
    const utcDateString: string = getDateStringByOffset(0, date.getFullYear(), date.getMonth(), date.getDate(),
    date.getHours(), date.getMinutes()
    );
    return new Date(utcDateString);
}

export function GetLocalDateFromUTCDateValue(utcDate: Date): Date{
    utcDate = new Date(utcDate);
    return new Date(utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(), utcDate.getUTCDate(),
    utcDate.getUTCHours(), utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds(), utcDate.getUTCMilliseconds());
}
