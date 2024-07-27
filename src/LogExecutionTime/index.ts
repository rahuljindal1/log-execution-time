export interface LogExecutionTimeOptions {
  keyName?: string;
}

export function LogExecutionTime(options?: LogExecutionTimeOptions) {
  const { keyName } = options || {};

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const key = keyName || propertyKey;
    const label = `${getFormattedDate(new Date())} | ${key}`;

    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        try {
          const startTime = Date.now();
          const result = await originalMethod.apply(this, args);
          const endTime = Date.now();
          logTimeSpent(startTime, endTime, label);
          return result;
        } catch (error) {
          console.timeEnd(label);
          throw error;
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        try {
          const startTime = Date.now();
          const result = originalMethod.apply(this, args);
          const endTime = Date.now();
          logTimeSpent(startTime, endTime, label);
          return result;
        } catch (error) {
          console.timeEnd(label);
          throw error;
        }
      };
    }

    return descriptor;
  };
}

function getFormattedDate(date: Date) {
  const padTo2Digits = (num: number) => num.toString().padStart(2, "0");

  const day = padTo2Digits(date.getDate());
  const month = padTo2Digits(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear().toString().slice(-2);
  const hours = padTo2Digits(date.getHours());
  const minutes = padTo2Digits(date.getMinutes());
  const seconds = padTo2Digits(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function logTimeSpent(
  startTimestamp: number,
  endTimestamp: number,
  label: string
) {
  const spentTime = endTimestamp - startTimestamp;
  console.log(`${label}: ${timeWithUnits(spentTime)}`);
}

function timeWithUnits(spentTime: number) {
  const units = [
    { label: "s", limit: 60 * 1000, factor: 1000 },
    { label: "mins", limit: 60 * 60 * 1000, factor: 60 * 1000 },
    { label: "hrs", limit: Infinity, factor: 60 * 60 * 1000 },
  ];

  for (const unit of units) {
    if (spentTime < unit.limit) {
      const time = (spentTime / unit.factor).toPrecision(3);
      return `${time}${unit.label}`;
    }
  }

  return "--";
}

function isAsyncFunction(fn: Function): boolean {
  return fn.constructor.name === "AsyncFunction";
}
