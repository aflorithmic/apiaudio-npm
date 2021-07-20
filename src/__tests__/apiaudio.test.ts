import { API_BASE_URL, API_BASE_URL_STAGING } from "../constants";
import apiaudio from "../index";
import { debug, apiKey } from "../../test-config";

describe("Main module initialization", () => {
  beforeEach(() => apiaudio.reset());

  test("It should require apiKey in configuration", () => {
    // @ts-ignore
    expect(() => apiaudio.configure().toThrowError(/must be a valid string/));
  });

  test("It should throw an error if configured twice", () => {
    apiaudio.configure({ apiKey, debug });
    expect(() => apiaudio.configure({ apiKey, debug })).toThrowError(
      /has already been initialized/
    );
  });

  test("It should NOT throw an error if configured twice after resetting", () => {
    apiaudio.configure({ apiKey, debug });
    apiaudio.reset();
    expect(() => apiaudio.configure({ apiKey, debug })).not.toThrow();
  });

  test("It should return if initialized", () => {
    expect(apiaudio.isInitialized()).toBe(false);
    apiaudio.configure({ apiKey, debug });
    expect(apiaudio.isInitialized()).toBe(true);
    apiaudio.reset();
    expect(apiaudio.isInitialized()).toBe(false);
  });

  test("It should set base url correctly according to debug value", () => {
    const { baseUrl: stagingBaseUrl } = apiaudio.configure({ apiKey, debug: true });
    expect(stagingBaseUrl).toBe(API_BASE_URL_STAGING);
    apiaudio.reset();
    const { baseUrl: prodBaseUrl } = apiaudio.configure({ apiKey, debug: false });
    expect(prodBaseUrl).toBe(API_BASE_URL);
  });

  test("It should allow bearer token configuration", () => {
    apiaudio.configure({ bearer: "some token", debug });
    apiaudio.reset();
    expect(() => apiaudio.configure({ apiKey, debug })).not.toThrow();
  });
});
