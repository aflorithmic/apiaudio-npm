import { apiaudio } from "./apiaudio";
import { Script } from "./Script";
import { Speech } from "./Speech";
import { Voice } from "./Voice";
import { Sound } from "./Sound";
import { Mastering } from "./Mastering";

apiaudio.Script = Script;
apiaudio.Speech = Speech;
apiaudio.Voice = Voice;
apiaudio.Sound = Sound;
apiaudio.Mastering = Mastering;

export default apiaudio;
export { Script, Speech, Voice, Sound, Mastering };
