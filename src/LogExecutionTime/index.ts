import { LoggerService } from "./Logger";
import { DateUtilityService } from "./DateUtility";
import { ExecutionCountService } from "./ExecutionCount";
import { LogExecutionTimeOptions, Logger } from "./interfaces";
import { v4 as uuidv4 } from "uuid";

export { LogExecutionTimeOptions } from "./interfaces";

const executionCountService = new ExecutionCountService();
const dateUtilityService = new DateUtilityService();

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
export function LogExecutionTime(options?: LogExecutionTimeOptions) {
  const { keyName, disable, showExecutionCount } = options || {};

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const key = keyName || propertyKey || uuidv4();
    const label = `${dateUtilityService.labelDate(new Date())} | ${key}`;
    const loggerService = new LoggerService({
      key,
      label,
      disable,
      showExecutionCount,
      executionCountService,
    });

    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        executionCountService.set(key);
        try {
          const startTime = Date.now();
          const result = await originalMethod.apply(this, args);
          const endTime = Date.now();
          loggerService.log(startTime, endTime, executionCountService.get(key));
          return result;
        } catch (error) {
          console.timeEnd(label);
          throw error;
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        executionCountService.set(key);
        try {
          const startTime = Date.now();
          const result = originalMethod.apply(this, args);
          const endTime = Date.now();
          loggerService.log(startTime, endTime, executionCountService.get(key));
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

function isAsyncFunction(fn: Function): boolean {
  return fn.constructor.name === "AsyncFunction";
}
