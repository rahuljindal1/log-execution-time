// src/index.d.ts

import { LogExecutionTimeOptions } from "..";

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
   * @returns A decorator function.
   */
  export function LogExecutionTime(
    options?: LogExecutionTimeOptions
  ): MethodDecorator;
}
