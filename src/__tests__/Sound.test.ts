import apiaudio, { Script, Speech, Sound } from "../index";
import { RequestBase } from "../RequestBase";
import { debug, apiKey } from "../../test-config";

describe("Sound module initialization", () => {
  beforeEach(() => {
    apiaudio.reset();
  });

  test("It should return an error if not configured", () => {
    expect(() => Sound.retrieve("some-id")).toThrowError(/configure the package before using it/);
  });

  test("It should not allow submodule configuration", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(() => Sound.configure({ apiKey: "1", baseUrl: "1" }, new RequestBase(""))).toThrowError(
      /has already been initialized/
    );
  });

  test("It should have some properties", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(Sound).toHaveProperty("create");
    expect(Sound).toHaveProperty("retrieve");
    expect(Sound).toHaveProperty("list");
  });
});

describe("Sound operations", () => {
  let allTemplatesCount: number;
  beforeEach(() => {
    apiaudio.reset();
    apiaudio.configure({ apiKey, debug });
  });
  const testScriptText = "Hey testing testing!";
  const testValues = "test10";
  let createdScriptId: string;

  test("It should create a speech from a new script to test the sound", async () => {
    try {
      // @ts-ignore
      const { scriptId } = await Script.create({
        scriptText: testScriptText,
        scriptName: testValues,
        moduleName: testValues,
        projectName: testValues
      });
      createdScriptId = scriptId;

      const result: any = await Speech.create({
        scriptId: createdScriptId,
        voice: "Joanna",
        speed: "100"
      });

      expect(result.message).toBeDefined();
      expect(result.message).toMatch(/success/i);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should retrieve the created speech", async () => {
    try {
      const rawResult: any = await Speech.retrieve(createdScriptId);
      expect(rawResult.default).toBeDefined();
      expect(rawResult.default.startsWith("https://")).toBe(true);
      expect(rawResult.default).toMatch(`${testValues}/${testValues}/${testValues}`);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  }, 30000);

  test("It should create the sound template", async () => {
    try {
      const bg_tracks: any = await Sound.list();
      expect(bg_tracks).toHaveProperty("templates");
      const { templates } = bg_tracks;
      const backgroundTrackId = templates[0]["soundTemplateId"];
      const rawResult: any = await Sound.create({
        scriptId: createdScriptId,
        backgroundTrackId
      });
      expect(rawResult.url.startsWith("https://")).toBe(true);
      expect(rawResult.url).toMatch(`${testValues}/${testValues}/${testValues}`);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  }, 30000);

  test("It should retrieve the sound template", async () => {
    try {
      const rawResult: any = await Sound.retrieve(createdScriptId);
      expect(rawResult.url.startsWith("https://")).toBe(true);
      expect(rawResult.url).toMatch(`${testValues}/${testValues}/${testValues}`);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  }, 30000);

  test("It should list all the sound templates", async () => {
    try {
      const rawResult: any = await Sound.templates();
      expect(rawResult).toHaveProperty("templates");
      const { templates } = rawResult;
      expect(Array.isArray(templates)).toBe(true);
      for (const template of templates) {
        expect(template).toHaveProperty("name");
        expect(template).toHaveProperty("contents");
        if (template?.contents) {
          expect(Array.isArray(template.contents)).toBe(true);
        }
      }
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should list all the sound template allowed filtering parameters", async () => {
    try {
      const parameters: any = await Sound.parameters();
      expect(typeof parameters).toEqual("object");
      for (const parameter in parameters) {
        expect(Array.isArray(parameters[parameter])).toBe(true);
        for (const value of parameters[parameter]) {
          expect(typeof value).toEqual("string");
        }
      }
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should list all the sound templates", async () => {
    try {
      const rawResult: any = await Sound.list();
      expect(rawResult).toHaveProperty("templates");
      const { templates } = rawResult;
      expect(Array.isArray(templates)).toBe(true);
      allTemplatesCount = templates.length;
      for (const template of templates) {
        expect(template).toHaveProperty("templateName");
        expect(template).toHaveProperty("description");
        expect(Array.isArray(template?.contents)).toBe(true);
        expect(Array.isArray(template?.tags)).toBe(true);
      }
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should list all the sound templates that match some filtering parameters", async () => {
    try {
      const rawResult: any = await Sound.list({ tags: "melodic,happy", genre: "electronic" });
      expect(rawResult).toHaveProperty("templates");
      const { templates } = rawResult;
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeLessThanOrEqual(allTemplatesCount);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should return an error when sending a wrong filtering parameter", async () => {
    const bad_tag_name = "bad_tag_name";
    try {
      await Sound.list({ bad_tag_name });

      throw new Error("test failed");
    } catch (e) {
      expect(e).toHaveProperty("message");
      expect(e).toHaveProperty("allowedFilteringParameters");
      const { message, allowedFilteringParameters } = e;
      expect(Array.isArray(allowedFilteringParameters)).toBe(true);
      expect(typeof message).toEqual("string");
      expect(message).toMatch(bad_tag_name);
    }
  });
});
