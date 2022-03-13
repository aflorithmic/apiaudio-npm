import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, ISpeechBody, PersonalisationParameters } from "./types";

export class SpeechClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/speech`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * Get speech url by script id, section and parameters
   * @param scriptId
   * @param section The script section name for the first section. The default name for a script section is "default". NOTE: At the moment, Only scripts with 1 section are supported. If the scripts contain more than one section, only the first section can be retrieved.
   * @param parameters Object containing the personalisation parameters for the first section of the script. This parameter depends on the parameters you used in your script's resource section. If this parameter is used, `section` must be specified.
   * @param version Version to be retrieved
   * @param requestId requestId to retrieve an async speech call
   */
  public retrieve(
    scriptId: string,
    section?: string,
    parameters?: PersonalisationParameters,
    version?: string,
    requestId?: string
  ): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#url, undefined, {
      params: { scriptId, version, requestId, section, parameters },
      timeout: 30000
    });
  }

  /**
   * Create a new speech
   * @param data
   */
  public create(data: ISpeechBody): Promise<unknown> {
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

export const Speech = new SpeechClass();
apiaudio.register(Speech);
