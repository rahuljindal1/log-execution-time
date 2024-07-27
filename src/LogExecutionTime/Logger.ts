import { ExecutionCountService } from "./ExecutionCount";
export class LoggerService {
  #key: string;
  #label: string;
  #disable: boolean;
  #showExecutionCount: boolean;
  #executionCountService: ExecutionCountService;

  constructor({
    key,
    label,
    disable = false,
    showExecutionCount = false,
    executionCountService,
  }: {
    key: string;
    label: string;
    disable?: boolean;
    showExecutionCount?: boolean;
    executionCountService: ExecutionCountService;
  }) {
    this.#key = key;
    this.#label = label;
    this.#disable = disable;
    this.#showExecutionCount = showExecutionCount;
    this.#executionCountService = executionCountService;
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

    const spentTime = endTimestamp - startTimestamp;
    console.log(
      `${this.#label}: ${this.timeWithUnits(spentTime)}${executionCount}`
    );
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
