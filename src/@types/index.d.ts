// src/index.d.ts

/**
 * A decorator for logging execution time of methods.
 * @param keyName Optional custom key to be used in the log output.
 * @returns A decorator function.
 */
export function LogExecutionTime(keyName?: string): MethodDecorator;
