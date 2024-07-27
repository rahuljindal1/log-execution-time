import { v4 as uuidv4 } from "uuid";

export interface LogExecutionTimeOptions {
  keyName?: string;
  disable?: boolean;
  showExecutionCount?: boolean;
}

interface Logger {
  key: string;
  label: string;
  startTimestamp: number;
  endTimestamp: number;
  showExecutionCount?: boolean;
}

/**
 * A decorator for logging execution time of methods.
 * @param options Optional options to be used in the log output.
 *
 * @keyName Set custom key for the logged entity
 *
 * @disable Conditionally disable logging
 *
 * @showExecutionCount Add a count for how many times a function being called
 *
 * @returns A decorator function.
 */
const propertyExecutionCountMap = new Map<string, number>();

export function LogExecutionTime(options?: LogExecutionTimeOptions) {
  const { keyName, disable, showExecutionCount } = options || {};

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const key = keyName || propertyKey || uuidv4();
    const label = `${getFormattedDate(new Date())} | ${key}`;
    const logger = buildLogger({
      key,
      label,
      disable,
      showExecutionCount,
    });

    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        setPropertyExecutionCount(propertyExecutionCountMap, key);
        try {
          const startTime = Date.now();
          const result = await originalMethod.apply(this, args);
          const endTime = Date.now();
          logger(startTime, endTime);
          return result;
        } catch (error) {
          console.timeEnd(label);
          throw error;
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        setPropertyExecutionCount(propertyExecutionCountMap, key);
        try {
          const startTime = Date.now();
          const result = originalMethod.apply(this, args);
          const endTime = Date.now();
          logger(startTime, endTime);
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
  const padTo2Digits = (num: number) => String(num).padStart(2, "0");

  const day = padTo2Digits(date.getDate());
  const month = padTo2Digits(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear().toString().slice(-2);
  const hours = padTo2Digits(date.getHours());
  const minutes = padTo2Digits(date.getMinutes());
  const seconds = padTo2Digits(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function buildLogger({
  key,
  label,
  disable,
  showExecutionCount,
}: {
  key: string;
  label: string;
  disable?: boolean;
  showExecutionCount?: boolean;
}) {
  return function (startTimestamp: number, endTimestamp: number) {
    if (disable) {
      return;
    }
    const options: Logger = {
      key,
      label,
      startTimestamp,
      endTimestamp,
      showExecutionCount,
    };
    logger.call(null, options);
  };
}

function setPropertyExecutionCount(
  propertyExecutionCountMap: Map<string, number>,
  key: string
) {
  if (propertyExecutionCountMap.has(key)) {
    const existingCount = propertyExecutionCountMap.get(key) || 0;
    propertyExecutionCountMap.set(key, existingCount + 1);
  } else {
    propertyExecutionCountMap.set(key, 1);
  }
}

function logger({
  key,
  label,
  startTimestamp,
  endTimestamp,
  showExecutionCount,
}: Logger) {
  let executionCount = "";
  if (showExecutionCount) {
    const count = propertyExecutionCountMap.get(key) || 0;
    if (count > 1) {
      executionCount = `   x${count}`;
    }
  }

  const spentTime = endTimestamp - startTimestamp;
  console.log(`${label}: ${timeWithUnits(spentTime)}${executionCount}`);
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
