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

## Development notes

### How to push a new version

`npm version <version_type>`

version_type can be: `major`, `minor` or `patch`

then

`npm publish`

### Running tests

To be able to run the tests, create a `.env` file and put a valid `API_KEY` parameter in it. Also see `test-config.ts` file.
