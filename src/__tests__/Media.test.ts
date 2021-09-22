import apiaudio, { Media } from "../index";
import { RequestBase } from "../RequestBase";
import { debug, apiKey } from "../../test-config";

describe("Media module initialization", () => {
  beforeEach(() => {
    apiaudio.reset();
  });

  test("It should return an error if not configured", () => {
    expect(() => Media.list()).toThrowError(/configure the package before using it/);
  });

  test("It should not allow submodule configuration", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(() => Media.configure({ apiKey: "1", baseUrl: "1" }, new RequestBase(""))).toThrowError(
      /has already been initialized/
    );
  });

  test("It should have some properties", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(Media).toHaveProperty("list");
    expect(Media).toHaveProperty("tags");
  });
});

describe("Media operations", () => {
  beforeEach(() => {
    apiaudio.reset();
    apiaudio.configure({ apiKey, debug });
  });

  test("It should list all the uploaded files", async () => {
    try {
      const rawResult: any = await Media.list();
      expect(rawResult).toHaveProperty("savedAudioFiles");
      expect(rawResult).toHaveProperty("totalCount");
      const { savedAudioFiles, totalCount } = rawResult;
      expect(Array.isArray(savedAudioFiles)).toBe(true);
      expect(typeof totalCount).toEqual("number");
      for (const file of savedAudioFiles) {
        expect(file).toHaveProperty("filename");
        expect(file).toHaveProperty("tags");
        expect(file).toHaveProperty("mediaId");
        expect(Array.isArray(file?.tags)).toBe(true);
      }
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should list all the tags", async () => {
    try {
      const rawResult: any = await Media.tags();
      expect(rawResult).toHaveProperty("uniqueTags");
      const { uniqueTags } = rawResult;
      expect(Array.isArray(uniqueTags)).toBe(true);
      for (const tag of uniqueTags) {
        expect(typeof tag).toEqual("string");
      }
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });
});
