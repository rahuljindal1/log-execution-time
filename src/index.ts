export function LogExecutionTime(keyName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const key = keyName || propertyKey;

    if (isAsyncFunction(originalMethod)) {
      descriptor.value = async function (...args: any[]) {
        const label = `${new Date().toISOString()} ${key}`;
        try {
          console.time(label);
          const result = await originalMethod.apply(this, args);
          console.timeEnd(label);
          return result;
        } catch (error) {
          console.timeEnd(label);
          throw error;
        }
      };
    } else {
      descriptor.value = function (...args: any[]) {
        const label = `${new Date().toISOString()} ${key}`;
        try {
          console.time(label);
          const result = originalMethod.apply(this, args);
          console.timeEnd(label);
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
