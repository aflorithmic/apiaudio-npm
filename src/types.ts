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
  alreadyInitializedModule = "The package has already been initialized and configured. Do not try to configure it again. If you want to reset it, use apiaudio.reset() - apiaudio"
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
}

export interface ISpeechBody extends SectionConfig {
  scriptId: string;
  speed?: string; // re-defining this because it can only be string in speech body, but it must be a number in section config
  /** List of objects containing the personalisation parameters as key-value pairs. This parameter depends on the number of parameters you used in your script resource. For instance, if in the script resource you have `scriptText="Hello {{name}} {{lastname}}"`, the audience should be: `[{"username": "Elon", "lastname": "Musk"}]` */
  audience?: Audience;
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
export type PersonalisationParameters = Record<string, string>;
export type Audience = [PersonalisationParameters];
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
  audience?: Audience;
  /** To store the mastered file in a public s3 folder. Default value is `false`. Warning - This will cause your mastered files to be public to anyone in the internet. Use this at your own risk. */
  public?: boolean;
  /** To create a VAST file of your mastered file. The `vast` flag only works if `public` is `True`. */
  vast?: boolean;
  /** Media files to be used in the SSML tags */
  mediaFiles?: Audience;
  /** List of audio formats to be produced. Valid formats are: `["wav", "mp3", "mp3_c_128", "flac", "ogg"]` */
  endFormat?: EndFormats[];
  /** force the audio length of the mastered track (in seconds). */
  forceLength?: number;
}

export interface IVoiceFilteringBody {
  /** Try with one of: amazon polly, google, microsoft azure, aflorithmic labs */
  providerFullName?: string;
  /** Try one of: google, polly, azure, msnr */
  provider?: string;
  /** Try with one of: male, female */
  gender?: string;
  /** Try with one of: english, spanish, french, german */
  language?: string;
  /** Try with one of: american, british, neutral, portuguese/brazilian, american soft, mexican, australian */
  accent?: string;
  /** Try with one of: adult, child, senior */
  ageBracket?: string;
  /** Try with one or more (separated by commas) of: steady, confident, balanced, informative, serious, storytelling, calm, deep, formal, sad, thin, energetic, upbeat, fun, tense, flat, low pitched, high pitched, fast, slow */
  tags?: string;
  /** Try with one or more (separated by commas) of: fitness, business, commercial, fashion, travel, audiobook, real estate, faith, health industry, kids entertainment, games, customer service, education, storytelling, entertainment, kids */
  industryExamples?: string;
  [key: string]: any;
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
}
