import { LoggerService } from "./Logger";
import { DateUtilityService } from "./DateUtility";
import { ExecutionCountService } from "./ExecutionCount";
import { LogExecutionTimeOptions } from "./interfaces";
import { v4 as uuidv4 } from "uuid";

export { LogExecutionTimeOptions } from "./interfaces";

const executionCountService = new ExecutionCountService();
const dateUtilityService = new DateUtilityService();

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
    });

    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        executionCountService.set(key);
        const startTime = Date.now();
        try {
          const result = await originalMethod.apply(this, args);
          const endTime = Date.now();
          loggerService.log(startTime, endTime, executionCountService.get(key));
          return result;
        } catch (error) {
          const endTime = Date.now();
          loggerService.log(startTime, endTime, executionCountService.get(key));
          throw error;
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        executionCountService.set(key);
        const startTime = Date.now();
        try {
          const result = originalMethod.apply(this, args);
          const endTime = Date.now();
          loggerService.log(startTime, endTime, executionCountService.get(key));
          return result;
        } catch (error) {
          const endTime = Date.now();
          loggerService.log(startTime, endTime, executionCountService.get(key));
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
