// src/index.d.ts

declare module "log-execution-time-new" {
  /**
   * Options for the LogExecutionTime decorator.
   */
  export interface LogExecutionTimeOptions {
    keyName?: string;
    disable?: boolean;
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
  export function LogExecutionTime(
    options?: LogExecutionTimeOptions
  ): MethodDecorator;
}
