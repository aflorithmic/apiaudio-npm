import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, ISoundBody, ISoundTemplatesFilteringBody } from "./types";

export class SoundClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";
  #file_url = "";
  #template_url = "";
  #list_sound_templates_filtering = "";
  #parameters_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/sound`;
    this.#file_url = `${config.baseUrl}/file/sound`;
    this.#template_url = `${config.baseUrl}/file/soundtemplates`;
    this.#list_sound_templates_filtering = `${config.baseUrl}/sound/template`;
    this.#parameters_url = `${config.baseUrl}/sound/parameter`;
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
   * List all the available sound templates (allows optional filtering)
   */
  public list(params?: ISoundTemplatesFilteringBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#list_sound_templates_filtering, "", { params });
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
    this.#file_url = "";
    this.#template_url = "";
    this.#list_sound_templates_filtering = "";
    this.#parameters_url = "";
  }
}

export const Sound = new SoundClass();
apiaudio.register(Sound);
