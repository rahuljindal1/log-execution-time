export interface LogExecutionTimeOptions {
  keyName?: string;
  disable?: boolean;
  showExecutionCount?: boolean;
}

export interface Logger {
  key: string;
  label: string;
  startTimestamp: number;
  endTimestamp: number;
  showExecutionCount?: boolean;
}
