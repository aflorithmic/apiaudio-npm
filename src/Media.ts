import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IMediaListBody } from "./types";

export class MediaClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";
  #tags_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/file/customaudio`;
    this.#tags_url = `${config.baseUrl}/file/customaudio/tags`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * List all files the organisation has
   */
  public list(options?: IMediaListBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#url, "", {
      params: { ...options, target: options?.downloadUrl ? "download" : null }
    });
  }

  /**
   * List with all unique user defined tags
   */
  public tags(): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#tags_url);
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-expect-error
    this.#RequestClass = undefined;
    this.#url = "";
    this.#tags_url = "";
  }
}

export const Media = new MediaClass();
apiaudio.register(Media);
