import { MetricService } from "../metric";

const metricService = MetricService.getInstance();

export class LoggerService {
  #key: string;
  #label: string;
  #disable: boolean;
  #showExecutionCount: boolean;

  constructor({
    key,
    label,
    disable = false,
    showExecutionCount = false,
  }: {
    key: string;
    label: string;
    disable?: boolean;
    showExecutionCount?: boolean;
  }) {
    this.#key = key;
    this.#label = label;
    this.#disable = disable;
    this.#showExecutionCount = showExecutionCount;
  }

  log(startTimestamp: number, endTimestamp: number, count: number) {
    if (this.#disable) {
      return;
    }

    let executionCount = "";
    if (this.#showExecutionCount) {
      if (count > 1) {
        executionCount = `   x${count}`;
      }
    }

    const timeSpent = endTimestamp - startTimestamp;
    const displayTime = this.timeWithUnits(timeSpent);
    metricService.addEntity({
      key: this.#key,
      label: this.#label,
      displayTime,
      timeSpent,
    });

    console.log(`${this.#label}: ${displayTime}${executionCount}`);
  }

  private timeWithUnits(spentTime: number) {
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
}
