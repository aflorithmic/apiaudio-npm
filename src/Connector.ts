import { apiaudio } from "./apiaudio";
import { isInitializedError, isSubmoduleAlreadyInitializedError } from "./Errors";
import { RequestBase } from "./RequestBase";
import { IConfig } from "./types";

export class ConnectorClass {
  #initialized = false;
  #RequestClass!: RequestBase;
  #url = "";
  #connection_url = "";

  public configure(config: IConfig, requestClass: RequestBase): void {
    if (this.#initialized) {
      isSubmoduleAlreadyInitializedError();
    }
    this.#url = `${config.baseUrl}/connector`;
    this.#connection_url = `${config.baseUrl}/connection`;
    this.#initialized = true;
    this.#RequestClass = requestClass;
  }

  /**
   * Check if a connector setup is made before
   */
  public retrieve(connectorName: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#url, connectorName);
  }

  /**
   * Check the status of a connection
   */
  public connection(connectionId: string): Promise<unknown> {
    if (!this.#initialized) {
      isInitializedError();
    }
    return this.#RequestClass.getRequest(this.#connection_url, connectionId);
  }

  public reset(): void {
    this.#initialized = false;
    // @ts-ignore
    this.#RequestClass = undefined;
    this.#url = "";
    this.#connection_url = "";
  }
}

export const Connector = new ConnectorClass();
apiaudio.register(Connector);
