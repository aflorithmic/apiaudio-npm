import { apiaudio } from "./apiaudio";
import { Script } from "./Script";
import { Speech } from "./Speech";
import { SyncTTS } from "./SyncTTS";
import { Voice } from "./Voice";
import { Sound } from "./Sound";
import { Mastering } from "./Mastering";
import { Media } from "./Media";
import { Birdcache } from "./Birdcache";

apiaudio.Script = Script;
apiaudio.Speech = Speech;
apiaudio.Voice = Voice;
apiaudio.Sound = Sound;
apiaudio.Mastering = Mastering;
apiaudio.SyncTTS = SyncTTS;
apiaudio.Media = Media;
apiaudio.Birdcache = Birdcache;

export default apiaudio;
export { Script, Speech, Voice, Sound, Mastering, SyncTTS, Media, Birdcache };
