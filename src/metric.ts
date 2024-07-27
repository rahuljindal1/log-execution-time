import { DataSourceEntity } from "./LogExecutionTime/interfaces";

export class MetricService {
  #dataSource: DataSourceEntity[] = [];
  static instance: MetricService;

  constructor() {
    if (MetricService.instance) {
      throw new Error("Multiple instances of singleton MetricService exist");
    }
    MetricService.instance = this;
  }

  public static getInstance() {
    if (!MetricService.instance) {
      const instance = new MetricService();
      MetricService.instance = instance;
    }
    return MetricService.instance;
  }

  public addEntity(data: DataSourceEntity) {
    this.#dataSource.push(data);
  }
}
