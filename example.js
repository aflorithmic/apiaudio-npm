const apiaudio = require("./lib/src").default;
require("dotenv").config();

async function example() {
  try {
    apiaudio.configure({
      apiKey: process.env.API_KEY,
      bearer: "eyJdsadsdfdj... (pass one of the apiKey or bearer)",
      debug: true
    });

    // apiaudio.setAssumeOrgId('childOrgIdToBeAssumed')

    let script = await apiaudio.Script.create({ scriptText: "hello world!" });
    console.log(script);

    script = await apiaudio.Script.retrieve(script["scriptId"]);
    console.log(script);

    let speech = await apiaudio.Speech.create({
      scriptId: script["scriptId"],
      silence_padding: "10000"
    });
    console.log(speech);

    let speechResult = await apiaudio.Speech.retrieve(script["scriptId"]);
    console.log(speechResult);

    let mastering = await apiaudio.Mastering.create({
      scriptId: script["scriptId"]
    });
    console.log(mastering);

    let masteringResult = await apiaudio.Mastering.retrieve(script["scriptId"]);
    console.log(masteringResult);
  } catch (e) {
    console.error(e);
  }
}

example();
