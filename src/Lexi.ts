import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig } from "./types";

export class LexiClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #list_url = "";
  #words_url = "";
  #types_url = "";
  #search_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#list_url = `${config.baseUrl}/diction`;
    this.#words_url = `${config.baseUrl}/diction/list`;
    this.#types_url = `${config.baseUrl}/diction/list_types`;
    this.#search_url = `${config.baseUrl}/diction/search`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * List the available dictionaries
   */
  public list(lang?: string, type?: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#list_url, "", {
      params: { lang, type }
    });
  }

  /**
   * List the available types
   */
  public types(): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#types_url);
  }

  /**
   * Lists all the words contained in a dictionary
   */
  public words(dictId: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#words_url, dictId);
  }

  /**
   * Searches to see if a word is in any of the dictionaries
   */
  public search(word: string, language: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#search_url, `${word}/${language}`);
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-expect-error
    this.#RequestClass = undefined;
    this.#list_url = "";
    this.#words_url = "";
    this.#types_url = "";
    this.#search_url = "";
  }
}

export const Lexi = new LexiClass();
apiaudio.register(Lexi);
