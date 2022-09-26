import { apiaudio } from "./apiaudio";
import { Script } from "./Script";
import { Speech } from "./Speech";
import { SyncTTS } from "./SyncTTS";
import { Voice } from "./Voice";
import { Sound } from "./Sound";
import { Mastering } from "./Mastering";
import { Media } from "./Media";
import { Birdcache } from "./Birdcache";
import { Connector } from "./Connector";
import { Lexi } from "./Lexi";
import { Webhooks } from "./Webhooks";
import { Pipeline } from "./Pipeline";

apiaudio.Script = Script;
apiaudio.Speech = Speech;
apiaudio.Voice = Voice;
apiaudio.Sound = Sound;
apiaudio.Mastering = Mastering;
apiaudio.SyncTTS = SyncTTS;
apiaudio.Media = Media;
apiaudio.Birdcache = Birdcache;
apiaudio.Connector = Connector;
apiaudio.Lexi = Lexi;
apiaudio.Webhooks = Webhooks;
apiaudio.Pipeline = Pipeline;

export default apiaudio;
export {
  Script,
  Speech,
  Voice,
  Sound,
  Mastering,
  SyncTTS,
  Media,
  Birdcache,
  Connector,
  Lexi,
  Webhooks,
  Pipeline
};
