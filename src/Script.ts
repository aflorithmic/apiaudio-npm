import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig, IScriptBody, IScriptListBody } from "./types";

export class ScriptClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";
  #random_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/script`;
    this.#random_url = `${config.baseUrl}/script/random`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * Lists scripts with filtering support
   * @param filters
   */
  public list(filters?: IScriptListBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#url, "", { params: filters });
  }

  /**
   * Get script by id
   * @param scriptId
   * @param version
   */
  public retrieve(scriptId: string, version?: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#url, scriptId, { params: { version } });
  }

  /**
   * Retrieve random text from a list of categories
   * @param category The category from which the random text is retrieved. If no category is specified, the function defaults to "FunFact" - Categories currently available: "BibleVerse", "FunFact", "InspirationalQuote", "Joke", "MovieSynopsis", "Poem", "PhilosophicalQuestion", "Recipe", "TriviaQuestion"
   */
  public random(category?: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#random_url, "", { params: { category } });
  }

  /**
   * Create a new script
   * @param data
   */
  public create(data: IScriptBody): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.postRequest(this.#url, data);
  }

  /**
   * Delete script by scriptId
   * @param scriptId
   * @param version Version to be deleted
   */
  public delete(scriptId: string, version?: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.deleteRequest(this.#url, "", { params: { scriptId, version } });
  }

  /**
   * Return a script with the dictionary highlighting applied.
   * @param scriptId
   * @param lang Determines which dictionary language should be used. The format should be compliant with ISO Language Code standard (e.g. en-GB)
   */
  public preview(scriptId: string, lang: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#url, scriptId, { params: { preview: true, lang } });
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-expect-error
    this.#RequestClass = undefined;
    this.#url = "";
    this.#random_url = "";
  }
}

export const Script = new ScriptClass();
apiaudio.register(Script);
