export type LogExecutionTimeOptions = {
  keyName?: string;
  disable?: boolean;
  showExecutionCount?: boolean;
};

export type Logger = {
  key: string;
  label: string;
  startTimestamp: number;
  endTimestamp: number;
  showExecutionCount?: boolean;
};

export type DataSourceEntity = {
  key: string;
  label: string;
  timeSpent: number;
  displayTime: string;
};
