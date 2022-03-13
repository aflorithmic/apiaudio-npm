import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, ISyncTTSBody } from "./types";

export class SyncTTSClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/speech/sync`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * Create a new speech
   * @param data
   */
  public create(data: ISyncTTSBody): Promise<unknown> {
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

export const SyncTTS = new SyncTTSClass();
apiaudio.register(SyncTTS);
