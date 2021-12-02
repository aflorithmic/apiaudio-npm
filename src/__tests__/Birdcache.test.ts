import apiaudio, { Birdcache } from "../index";
import { RequestBase } from "../RequestBase";
import { debug, apiKey } from "../../test-config";

describe("Birdcache module initialization", () => {
  beforeEach(() => {
    apiaudio.reset();
  });

  test("It should return an error if not configured", () => {
    expect(() => Birdcache.create({ type: "speech", voice: "linda", text: "text" })).toThrowError(
      /configure the package before using it/
    );
  });

  test("It should not allow submodule configuration", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(() =>
      Birdcache.configure({ apiKey: "1", baseUrl: "1" }, new RequestBase(""))
    ).toThrowError(/has already been initialized/);
  });

  test("It should have some properties", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(Birdcache).toHaveProperty("create");
  });
});

describe("Birdcache operations", () => {
  beforeEach(() => {
    apiaudio.reset();
    apiaudio.configure({ apiKey, debug });
  });
  const voice = "linda";
  const text =
    "hello {{username|friend}}, {{city|istanbul}} is {{weather|sunny}} today. have a good {{day|day}}";
  const audience = { day: ["sunday", "monday"], username: ["salih"], weather: ["stormy", "windy"] };

  test("It should be able to create birdcache speech call", async () => {
    try {
      const result = await Birdcache.create({
        type: "speech",
        text,
        voice,
        audience
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty("ready");
      expect(result[0]).toHaveProperty("text");
      expect(result[0]).toHaveProperty("hashed");
      expect(result[0]["text"]).toEqual("hello friend, istanbul is sunny today. have a good day");
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });

  test("It should be throw an error if no sound template is passed for mastering", async () => {
    try {
      await Birdcache.create({
        type: "mastering",
        text,
        voice,
        audience
      });

      throw new Error("test failed");
    } catch (e) {
      expect(e.error).toEqual("Sound template must be passed for mastering event type");
    }
  });

  test("It should be able to create birdcache mastering call", async () => {
    try {
      const result = await Birdcache.create({
        type: "mastering",
        text,
        voice,
        audience,
        soundTemplate: "openup"
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty("ready");
      expect(result[0]).toHaveProperty("text");
      expect(result[0]).toHaveProperty("hashed");
      expect(result[0]["text"]).toEqual("hello friend, istanbul is sunny today. have a good day");
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });
});
