import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IBirdcacheBody } from "./types";

export class BirdcacheClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/birdcache`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * create a single production request with birdcache
   * @param data
   */
  public create(data: IBirdcacheBody): Promise<unknown> {
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

export const Birdcache = new BirdcacheClass();
apiaudio.register(Birdcache);
