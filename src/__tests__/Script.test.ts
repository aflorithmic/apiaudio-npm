import apiaudio, { Script } from "../index";
import { RequestBase } from "../RequestBase";
import { debug, apiKey } from "../../test-config";

describe("Script module initialization", () => {
  beforeEach(() => {
    apiaudio.reset();
  });

  test("It should return an error if not configured", () => {
    expect(() => Script.list()).toThrowError(/configure the package before using it/);
  });

  test("It should not allow submodule configuration", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(() => Script.configure({ apiKey: "1", baseUrl: "1" }, new RequestBase(""))).toThrowError(
      /has already been initialized/
    );
  });

  test("It should have some properties", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(Script).toHaveProperty("list");
    expect(Script).toHaveProperty("create");
    expect(Script).toHaveProperty("retrieve");
  });
});

describe("Script operations", () => {
  beforeEach(() => {
    apiaudio.reset();
    apiaudio.configure({ apiKey, debug });
  });
  const testScriptText = "Hey testing testing!";
  const testValues = "test7";
  let createdScriptId: string;

  test("It should create a new script", async () => {
    try {
      // @ts-expect-error
      const { scriptId, scriptText, scriptName, moduleName, projectName } = await Script.create({
        scriptText: testScriptText,
        scriptName: testValues,
        moduleName: testValues,
        projectName: testValues
      });
      createdScriptId = scriptId;
      expect(scriptText).toMatch(testScriptText); // since section names are added automatically, we dont do exact check
      expect(scriptName).toBe(testValues);
      expect(moduleName).toBe(testValues);
      expect(projectName).toBe(testValues);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should retrieve the created script", async () => {
    try {
      // @ts-expect-error
      const { scriptText, scriptName, moduleName, projectName } = await Script.retrieve(
        createdScriptId
      );
      expect(scriptText).toMatch(testScriptText); // since section names are added automatically, we dont do exact check
      expect(scriptName).toBe(testValues);
      expect(moduleName).toBe(testValues);
      expect(projectName).toBe(testValues);
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should list all of the scripts and find the created one", async () => {
    try {
      const scripts = await Script.list();
      expect(Array.isArray(scripts)).toBe(true);
      expect(scripts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            scriptText: expect.stringMatching(testScriptText),
            scriptName: testValues,
            moduleName: testValues,
            projectName: testValues
          })
        ])
      );
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should retrieve a random script text", async () => {
    try {
      const randomText = await Script.random();
      expect(randomText).toBeDefined();
      expect(typeof randomText).toBe("string");
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should retrieve a random script text with category", async () => {
    try {
      const randomText = await Script.random("BibleVerse");
      expect(randomText).toBeDefined();
      expect(typeof randomText).toBe("string");
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should fail to retrieve a random script text with non-existing category", async () => {
    try {
      await Script.random("~");

      throw new Error("test failed");
    } catch (e) {
      expect(e).toHaveProperty("message");
      expect(e?.message).toMatch("category provided does not exist");
    }
  });
});
