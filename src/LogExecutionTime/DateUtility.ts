export class DateUtilityService {
  public labelDate(date: Date) {
    const padTo2Digits = (num: number) => String(num).padStart(2, "0");

    const day = padTo2Digits(date.getDate());
    const month = padTo2Digits(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear().toString().slice(-2);
    const hours = padTo2Digits(date.getHours());
    const minutes = padTo2Digits(date.getMinutes());
    const seconds = padTo2Digits(date.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
}
