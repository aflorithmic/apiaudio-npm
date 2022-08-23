import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IDictionaryRegisterCustomWordBody } from "./types";

export class LexiClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #list_url = "";
  #custom_dict_url = "";
  #custom_word_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#list_url = `${config.baseUrl}/diction`;
    this.#custom_dict_url = `${config.baseUrl}/diction/custom`;
    this.#custom_word_url = `${config.baseUrl}/diction/custom/item`;
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
   * List words in a custom dictionary
   */
  public customWords(lang: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#custom_word_url, "", {
      params: { lang }
    });
  }

  /**
   * List of custom dictionaries
   */
  public customDicts(): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#custom_dict_url);
  }

  /**
   * register a word to a custom dictionary
   * @param data
   */
  public registerCustomWord(data: IDictionaryRegisterCustomWordBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    if (!data.specialization) data.specialization = "default";
    if (!data.contentType) data.contentType = "basic";
    return this.#RequestClass.putRequest(this.#custom_dict_url, data);
  }

  /**
   * Delete a custom word
   * @param word required
   * @param lang required
   * @param specialization optional
   */
  public deleteCustomWord(word: string, lang: string, specialization?: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.deleteRequest(this.#custom_dict_url, "", {
      params: { word, lang, specialization }
    });
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-expect-error
    this.#RequestClass = undefined;
    this.#list_url = "";
    this.#custom_dict_url = "";
    this.#custom_word_url = "";
  }
}

export const Lexi = new LexiClass();
apiaudio.register(Lexi);
