import { LoggerService } from "./Logger";
import { ExecutionCountService } from "./ExecutionCount";
import { LogExecutionTimeOptions } from "./interfaces";

export { LogExecutionTimeOptions } from "./interfaces";

const executionCountService = new ExecutionCountService();

export function LogExecutionTime(options?: LogExecutionTimeOptions) {
  const { keyName, disable, showExecutionCount } = options || {};

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const key = keyName || propertyKey || "(undefined key)";
    const loggerService = new LoggerService({
      key,
      disable,
      showExecutionCount
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

function isAsyncFunction(fn: () => void): boolean {
  return fn.constructor.name === "AsyncFunction";
}
