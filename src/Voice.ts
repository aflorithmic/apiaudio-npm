import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IVoiceFilteringBody, IVoiceListParams } from "./types";

export class VoiceClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";
  #parameters_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/voice`;
    this.#parameters_url = `${config.baseUrl}/voice/parameter`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * List all voices with filtering options
   */
  public list(data?: IVoiceFilteringBody, params?: IVoiceListParams): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.postRequest(this.#url, data, { params });
  }

  /**
   * List all allowed filtering parameters
   */
  public parameters(): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#parameters_url);
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-expect-error
    this.#RequestClass = undefined;
    this.#url = "";
  }
}

export const Voice = new VoiceClass();
apiaudio.register(Voice);
