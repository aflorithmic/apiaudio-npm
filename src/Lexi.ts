import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IDictionaryRegisterCustomWordBody } from "./types";

export class LexiClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #list_url = "";
  #words_url = "";
  #types_url = "";
  #search_url = "";
  #custom_dict_path = "";
  #custom_word_path = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#list_url = `${config.baseUrl}/diction`;
    this.#words_url = `${config.baseUrl}/diction/list`;
    this.#types_url = `${config.baseUrl}/diction/list_types`;
    this.#search_url = `${config.baseUrl}/diction/search`;
    this.#custom_dict_path = `${config.baseUrl}/diction/custom`;
    this.#custom_word_path = `${config.baseUrl}/diction/custom/item`;
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

  /**
   * List words in a custom dictionary
   */
  public customWords(lang: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#custom_word_path, "", {
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
    return this.#RequestClass.getRequest(this.#custom_dict_path);
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
    return this.#RequestClass.putRequest(this.#custom_word_path, data);
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
    return this.#RequestClass.deleteRequest(this.#custom_word_path, "", {
      params: { word, lang, specialization }
    });
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
