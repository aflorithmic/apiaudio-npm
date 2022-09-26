import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IPipelineBody } from "./types";

export class PipelineClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/pipeline`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * create a single production request with pipelines
   * @param data
   */
  public create(data: IPipelineBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.postRequest(this.#url, data);
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-expect-error
    this.#RequestClass = undefined;
    this.#url = "";
  }
}

export const Pipeline = new PipelineClass();
apiaudio.register(Pipeline);
