import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, ISoundBody, ISoundTemplatesFilteringBody } from "./types";

export class SoundClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";
  #file_url = "";
  #bg_url = "";
  #template_url = "";
  #template_url_v2 = "";
  #parameters_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/sound`;
    this.#file_url = `${config.baseUrl}/file/sound`;
    this.#bg_url = `${config.baseUrl}/file/background_track`;
    this.#template_url = `${config.baseUrl}/file/soundtemplates`;
    this.#template_url_v2 = `${config.baseUrl}/sound/list`;
    this.#parameters_url = `${config.baseUrl}/sound/parameters`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * Get sound by script id
   * @param scriptId
   * @param parameters
   */
  public retrieve(scriptId: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#file_url, "", { params: { scriptId } });
  }

  /**
   * create a sound template
   * @param data
   */
  public create(data: ISoundBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.postRequest(this.#url, data);
  }

  /**
   * List all background tracks including a 15 seconds audio snippet
   */
  public list(): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#bg_url);
  }

  /**
   * List all the available sound templates
   */
  public templates(): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#template_url);
  }

  /**
   * List all the available sound templates (newer version, allows optional filtering)
   */
  public list_v2(params?: ISoundTemplatesFilteringBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#template_url_v2, "", { params });
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
    // @ts-ignore
    this.#RequestClass = undefined;
    this.#url = "";
    this.#file_url = "";
    this.#bg_url = "";
    this.#template_url = "";
    this.#template_url_v2 = "";
    this.#parameters_url = "";
  }
}

export const Sound = new SoundClass();
apiaudio.register(Sound);
