import { API_BASE_URL, API_BASE_URL_STAGING } from "./constants";
import { isInitializedError, isModuleAlreadyInitializedError, isValidAuthError } from "./Errors";
import { IConfig, IInputConfig } from "./types";
import { RequestBase } from "./RequestBase";
import { ScriptClass } from "./Script";
import { SpeechClass } from "./Speech";
import { VoiceClass } from "./Voice";
import { SoundClass } from "./Sound";
import { MasteringClass } from "./Mastering";
import { SyncTTSClass } from "./SyncTTS";
import { MediaClass } from "./Media";
import { BirdcacheClass } from "./Birdcache";
import { ConnectorClass } from "./Connector";
import { LexiClass } from "./Lexi";

interface IComponent {
  configure(config: IConfig, requestClass: RequestBase): void | Promise<never>;
  reset(): void;
}

class apiaudioClass {
  public Script!: ScriptClass;
  public Speech!: SpeechClass;
  public Voice!: VoiceClass;
  public SyncTTS!: SyncTTSClass;
  public Sound!: SoundClass;
  public Mastering!: MasteringClass;
  public Media!: MediaClass;
  public Birdcache!: BirdcacheClass;
  public Connector!: ConnectorClass;
  public Lexi!: LexiClass;
  #config!: IConfig;
  #assumeOrgId: string | null = null;
  #components: IComponent[] = [];
  #initialized = false;

  public register(comp: IComponent): void {
    this.#components.push(comp);
  }

  public isInitialized(): boolean {
    return this.#initialized;
  }

  /**
   * Configure the SDK before using it. Make sure you call this function
   * before any of the calls
   * @param config
   */
  public configure(config: IInputConfig): IConfig {
    if (!config || !(config?.apiKey || config?.bearer)) {
      isValidAuthError();
    } else if (this.#initialized) {
      isModuleAlreadyInitializedError();
    }

    const baseUrl = config.debug ? API_BASE_URL_STAGING : API_BASE_URL;

    this.#config = { ...config, baseUrl };
    this.#initialized = true;
    const requestClass = new RequestBase(this.#config.apiKey, this.#config.bearer);
    this.#components.map(comp => comp.configure(this.#config, requestClass));

    return this.#config;
  }

  /**
   * For super organisations to assume one of their child orgs. To stop assuming, simply call this function with null.
   * @param orgId - org id of one of child orgs or null
   */
  public setAssumeOrgId(orgId: string | null) {
    if (!this.#initialized) {
      isInitializedError();
    }
    this.#assumeOrgId = orgId;
    this.#components.map(comp => comp.reset());
    const requestClass = new RequestBase(
      this.#config.apiKey,
      this.#config.bearer,
      this.#assumeOrgId
    );
    this.#components.map(comp => comp.configure(this.#config, requestClass));
  }

  /**
   * Reset the initialization
   */
  public reset(): void {
    // @ts-expect-error
    this.#config = {};
    this.#components.map(comp => comp.reset());
    this.#assumeOrgId = null;
    this.#initialized = false;
  }
}

export const apiaudio = new apiaudioClass();
