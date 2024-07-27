export class ExecutionCountService {
  #propertyExecutionCountMap = new Map<string, number>();

  public set(key: string) {
    if (this.#propertyExecutionCountMap.has(key)) {
      const existingCount = this.#propertyExecutionCountMap.get(key) || 0;
      this.#propertyExecutionCountMap.set(key, existingCount + 1);
    } else {
      this.#propertyExecutionCountMap.set(key, 1);
    }
  }

  public get(key: string) {
    return this.#propertyExecutionCountMap.get(key) || 0;
  }
}
