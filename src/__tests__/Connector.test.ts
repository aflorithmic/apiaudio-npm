import apiaudio, { Connector } from "../index";
import { RequestBase } from "../RequestBase";
import { debug, apiKey } from "../../test-config";

describe("Connector module initialization", () => {
  beforeEach(() => {
    apiaudio.reset();
  });

  test("It should return an error if not configured", () => {
    expect(() => Connector.retrieve("")).toThrowError(/configure the package before using it/);
  });

  test("It should not allow submodule configuration", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(() =>
      Connector.configure({ apiKey: "1", baseUrl: "1" }, new RequestBase(""))
    ).toThrowError(/has already been initialized/);
  });

  test("It should have some properties", () => {
    apiaudio.configure({ apiKey: "some-api-key" });
    expect(Connector).toHaveProperty("retrieve");
    expect(Connector).toHaveProperty("connection");
  });
});

describe("Connector operations", () => {
  beforeEach(() => {
    apiaudio.reset();
    apiaudio.configure({ apiKey, debug });
  });

  test("It should retrieve connector status", async () => {
    try {
      const rawResult: any = await Connector.retrieve("Spotify");
      expect(rawResult).toHaveProperty("message");
    } catch (e) {
      console.error(e);
      expect(e).toHaveProperty("error");
    }
  });

  test("It should get a connection status by id", async () => {
    try {
      const rawResult: any = await Connector.connection("connection-id");
      expect(Array.isArray(rawResult)).toBe(true);
      for (const connection of rawResult) {
        expect(connection).toHaveProperty("connectionId");
        expect(connection).toHaveProperty("status");
        expect(connection).toHaveProperty("connector");
      }
    } catch (e) {
      console.error(e);
      throw new Error("test failed");
    }
  });
});
