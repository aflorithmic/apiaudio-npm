export interface IInputConfig {
  apiKey?: string;
  bearer?: string;
  debug?: boolean;
  [key: string]: any;
}

export interface IConfig extends IInputConfig {
  baseUrl: string;
}

export enum ErrorTypes {
  validAuth = "API key or Bearer token must be a valid string. - apiaudio",
  notInitialized = "You should configure the package before using it. - apiaudio",
  alreadyInitializedSubmodule = "This submobule has already been initialized and configured, do not try to configure it directly. - apiaudio",
  alreadyInitializedModule = "The package has already been initialized and configured. Do not try to configure it again. If you want to reset it, use apiaudio.reset() - apiaudio",
  sdkVersionNotUpToDate = `You are not using the latest version of apiaudio. Consider upgrading, as you might be missing out on new features and bug fixes. - apiaudio`
}

export interface IScriptListBody {
  /** The name of your project. */
  projectName?: string;
  /** The name of your module. */
  moduleName?: string;
  /** The name of your script. */
  scriptName?: string;
  /** The id of your script. */
  scriptId?: string;
}

export interface IScriptBody {
  /** Text for your script. A script can contain multiple sections and SSML tags. Learn more about scriptText details [here](https://docs.api.audio/docs/script-2) */
  scriptText: string;
  /** The name of your project. Default value is "default" */
  projectName?: string;
  /** The name of your module. Default value is "default" */
  moduleName?: string;
  /** The name of your script. Default value is "default" */
  scriptName?: string;
  /** Custom identifier for your script. If scriptId parameter is used, then projectName, moduleName and scriptName are required parameters. */
  scriptId?: string;
  /** An object containing different versions of your script text, whereby the key is the version name, and its value is the associated `scriptText`. Version name `v0` is reserved as the default `scriptText`. Default value is "{}" */
  versions?: { [key: string]: string };
}

export interface ISpeechBody extends SectionConfig {
  scriptId: string;
  speed?: string; // re-defining this because it can only be string in speech body, but it must be a number in section config
  /** List of objects containing the personalisation parameters as key-value pairs. This parameter depends on the number of parameters you used in your script resource. For instance, if in the script resource you have `scriptText="Hello {{name}} {{lastname}}"`, the audience should be: `[{"username": "Elon", "lastname": "Musk"}]` */
  audience?: PersonalisationParameters;
  /** An object (key-value pairs), where the key is a section name, and the value is another object with the section configuration (valid parameters are: voice, speed, effect, silence_padding). If a section is not found here, the section will automatically inherit the voice, speed, effect and silence_padding values you defined above (or the default ones if you don't provide them). See an example below with 2 sections and different configuration parameters being used.
    ```{
      "firstsection": {
          "voice": "Matthew",
          "speed": 110,
          "silence_padding": 100,
          "effect": "dark_father"
      },
      "anothersection": {
          "voice": "en-GB-RyanNeural",
          "speed": 100
      }
    }```
  */
  sections?: Record<string, SectionConfig>;
  /** Allow sync or async speech creation. Defaults to true. If false, speech create call will return a success message when the speech creation is triggered */
  sync?: boolean;
  /** Version to be produced. Defaults to empty string */
  version?: string;
}

export interface ISoundBody {
  scriptId: string;
  backgroundTrackId: string;
}

export interface ISoundTemplatesFilteringBody {
  /** Try with one or more (separated by commas) of: news, travel, business, relaxation, fitness, relax, children stories */
  industryExamples?: string;
  /** Try with one or more (separated by commas) of: intro, main, outro, effect1, effect2, main outro, droid_main, chewie_main, effect3, ambience, only effects */
  contents?: string;
  /** Try with one of: electronic, acoustic, atmospheric, abstract, rock */
  genre?: string;
  /** Try with one of: mid, up, down, uptempo */
  tempo?: string;
  /** Try with one or more (separated by commas) of: intense, minimal, reflective, melodic, happy, nostalgic, focus, energetic, uplifting, active, relaxed, ambience, mysterious, positive, informative, workout, work, meditation, travel, full silence */
  tags?: string;
  [key: string]: any;
}

export type SectionConfig = {
  /** Voice name. See the list of available voices using Voice resource. Default voice is "Joanna".
   */
  voice?: string;
  /** Voice speed. Default speed is 100. */
  speed?: string | number;
  /** Put a funny effect in your voice. You can try the following ones: dark_father, chewie, 88b, 2r2d, volume_boost_low volume_boost_middle volume_boost_high (Volume boost allows you to adjust the volume of speech. NOTE! Volume boost effect only applies to speech creation and will be overwritten by the mastering process) */
  effect?: EffectOptions;
  /** Add a silence padding to your speech tracks (in milliseconds). Default is 0 (no padding) */
  silence_padding?: string | number;
};

/** For backwards compatibility, [{}] type is still allowed, however the documented type is {}. */
export type PersonalisationParameters = Record<string, string> | [Record<string, string>];
export type EffectOptions =
  | "dark_father"
  | "chewie"
  | "88b"
  | "2r2d"
  | "volume_boost_low"
  | "volume_boost_middle"
  | "volume_boost_high";
export type EndFormats = "wav" | "mp3" | "mp3_c_128" | "flac" | "ogg";
export interface IMasteringBody {
  scriptId: string;
  /** The sound template name. For the list of available sound templates check `Sound.templates()` call
   */
  soundTemplate?: string;
  /** List of objects containing the personalisation parameters. This parameter depends on the number of parameters you used in your script resource. */
  audience?: PersonalisationParameters;
  /** To store the mastered file in a public s3 folder. Default value is `false`. Warning - This will cause your mastered files to be public to anyone in the internet. Use this at your own risk. */
  public?: boolean;
  /** To create a VAST file of your mastered file. The `vast` flag only works if `public` is `True`. */
  vast?: boolean;
  /** Media files to be used in the SSML tags */
  mediaFiles?: PersonalisationParameters;
  /** List of audio formats to be produced. Valid formats are: `["wav", "mp3", "mp3_c_128", "flac", "ogg"]` */
  endFormat?: EndFormats[];
  /** force the audio length of the mastered track (in seconds). */
  forceLength?: number;
  /** Version to be produced. Defaults to empty string */
  version?: string;
  /** If you would like to have a sharable link created with your audio file, use this flag. */
  share?: boolean;
}

type VoiceAttributes =
  | "provider"
  | "gender"
  | "language"
  | "accent"
  | "ageBracket"
  | "tags"
  | "industryExamples"
  | "sectionCharacterLimit"
  | "timePerformance";

type VoiceComparisonOperators = "$gt" | "$gte" | "$lt" | "$lte" | "$contains" | "$is_in" | "$ne";

export type IVoiceFilteringBody = {
  [key in VoiceAttributes]: Record<VoiceComparisonOperators, string | string[]> | string;
};

export interface IVoiceListParams {
  sort?: "priority" | VoiceAttributes;
  limit?: number;
  offset?: number;
}

export interface ISyncTTSBody {
  /** voice id */
  voice: string;
  /** text to be converted to speech */
  text: string;
  /** metadata to be returned */
  metadata?: "full" | "none";
}

export interface IMediaListBody {
  /** If passed, will only return that file, or an empty object if it does not exist. */
  mediaId?: string;
  /** Comma separated tags. If passed, will return all files that at least contain those tags. */
  tags?: string;
  /** if true, a presigned url is added to each item on the array. This is slow for large amount of files (around 1s each). */
  downloadUrl?: boolean;
  /** If true, the media files listed will be the public media files provided by api.audio; defaults false. */
  public: boolean;
}

export interface IBirdcacheBody {
  /** Type of the event. */
  type: "mastering" | "speech" | "sync_tts";
  /** The text you want to do speech/mastering with. */
  text: string;
  /** The voice for speech creation. */
  voice: string;
  /** The key pair object for personalisation parameters. */
  audience?: Record<string, string[]>;
  /** The sound template for mastering creation. Only needed when the type is mastering. */
  soundTemplate?: string;
}

export interface IDictionaryRegisterCustomWordBody {
  /** Language family, e.g. en or es.dictionary - use global to register a word globally. */
  lang: string;
  /** The word that will be replaced */
  word: string;
  /** The replacement token. Can be either a plain string or a IPA token. */
  replacement: string;
  /** The content type of the supplied replacement, can be either basic (default) or ipa for phonetic replacements. */
  contentType?: string;
  /** by default the supplied replacement will apply regardless of the supplied voice, language code or provider. However edge cases can be supplied, these can be either a valid; provider name, language code (i.e. en-gb) or voice name. */
  specialization?: string;
}

export interface IPipelineBody {
  /** Type of the event. */
  type: "mastering" | "speech";
  /** The script ids you want to do speech/mastering with. */
  scripts: string[];
  /** The voice or voices for speech creation. */
  voice: string | string[];
  /** The sound template or templates for mastering creation. Only needed when the type is mastering. */
  soundTemplate?: string | string[];
}
