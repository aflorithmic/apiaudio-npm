import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { version } from "../package.json";

export class RequestBase {
  #axios: AxiosInstance;

  constructor(apiKey: string | undefined, bearer: string | undefined, assumeOrgId?: string | null) {
    const headers: Record<string, string> = { "x-js-sdk-version": version };
    if (apiKey) headers["x-api-key"] = apiKey;
    else if (bearer) headers["Authorization"] = `Bearer ${bearer}`;
    if (assumeOrgId) headers["x-assume-org"] = assumeOrgId;
    this.#axios = axios.create({ headers });
  }

  public postRequest(url: string, data: unknown, config: AxiosRequestConfig = {}): any {
    return new Promise((res, rej) => {
      this.#axios
        .post(url, data, { ...config })
        .then(({ data: result }) => res(result))
        .catch(({ response }) => rej(response.data));
    });
  }

  public getRequest(url: string, path = "", config: AxiosRequestConfig = {}): any {
    return new Promise((res, rej) => {
      this.#axios
        .get(`${url}/${path}`, { ...config })
        .then(({ data: result }) => res(result))
        .catch(({ response }) => rej(response.data));
    });
  }

  public deleteRequest(url: string, path = "", config: AxiosRequestConfig = {}): any {
    return new Promise((res, rej) => {
      this.#axios
        .delete(`${url}/${path}`, { ...config })
        .then(({ data: result }) => res(result))
        .catch(({ response }) => rej(response.data));
    });
  }
}
