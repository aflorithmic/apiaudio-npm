[![npm](https://img.shields.io/npm/v/apiaudio?style=for-the-badge)](https://www.npmjs.com/package/apiaudio)

# api.audio Javascript SDK

## Documentation

### Installation

`yarn add apiaudio` or `npm install --save apiaudio`

### Import and Usage

It can be used by a **singular import** or **modular imports**.

```javascript
import apiaudio from "apiaudio";

apiaudio.configure(...);

apiaudio.Script.list();
```

```javascript
import apiaudio, { Script, Voice, Speech } from "apiaudio";

apiaudio.configure(...);

Script.list();
```

### **A detailed documentation can be found on [docs.api.audio](https://docs.api.audio)**

## Webhooks secrets

apiaudio can optionally sign the webhook events it sends to your endpoint, allowing you to validate that they were not sent by a third-party.

Please note that you must pass the _raw_ request body, exactly as received from apiaudio, to the `verify()` or `verifyAsync()` functions; this will not work with a parsed (i.e., JSON) request body.

`verify()` can be used in server instances (backend), whereas `verifyAsync()` is designed for web instances (frontend.)

```javascript
import { Webhooks } from "apiaudio";

Webhooks.verify(
  (payload = "event body sent by apiaudio as a string"),
  (header = "event's X-Aflr-Secret header"),
  (secret = "your webhook secret"),
  (tolerance = "tolerance in seconds, defaults to 300, optional"),
  (cryptoProvider = "alternative crypto provider, optional")
);

Webhooks.verifyAsync(
  (payload = "event body sent by apiaudio as a string"),
  (header = "event's X-Aflr-Secret header"),
  (secret = "your webhook secret"),
  (tolerance = "tolerance in seconds, defaults to 300, optional"),
  (cryptoProvider = "alternative crypto provider, optional")
);
```

## Development notes

### How to push a new version

`npm version <version_type>`

version_type can be: `major`, `minor` or `patch`

then

`npm publish`

### Running tests

To be able to run the tests, create a `.env` file and put a valid `API_KEY` parameter in it. Also see `test-config.ts` file.
