const apiaudio = require("./lib").default;
require("dotenv").config();

async function example() {
  try {
    apiaudio.configure({
      apiKey: process.env.API_KEY
    });
    let script = await apiaudio.Script.create({
      scriptText:
        "Hello world this is an amazing day wuhu I am in London but quarantineee no matter no worries everything will be okay and this is my day 4 I am trying to create loooong mastering to see if it is going to charge me correctly, meaning duration based. anyways london is a cool place if you are alone and doing quarantine its a bit boring but it will be fun and I plan to go to barcelona soon because I have got friends there and I wanna swim in barcelona beachs. that is it for now lets see how much this will take.Hello world this is an amazing day wuhu I am in London but quarantineee no matter no worries everything will be okay and this is my day 4 I am trying to create loooong mastering to see if it is going to charge me correctly, meaning duration based. anyways london is a cool place if you are alone and doing quarantine its a bit boring but Hello world this is an amazing day wuhu I am in London but quarantineee no matter no worries everything will be okay and this is my day 4 I am trying to create loooong mastering to see if it is going to charge me correctly, meaning duration based. anyways london is a cool place if you are alone and doing quarantine its a bit boring but it will be fun and I plan to go to barcelona soon because I have got friends there and I wanna swim in barcelona beachs. that is it for now lets see how much this will take.Hello world this is an amazing day wuhu I am in London but quarantineee no matter no worries everything will be okay and this is my day 4 I am trying to create loooong mastering to see if it is going to charge me correctly, meaning duration based. anyways london is a cool place if you are alone and doing quarantine its a bit boring but Hello world this is an amazing day wuhu I am in London but quarantineee no matter no worries everything will be okay and this is my day 4 I am trying to create loooong mastering to see if it is going to charge me correctly, meaning duration based. anyways london is a cool place if you are alone and doing quarantine its a bit boring but it will be fun and I plan to go to barcelona soon because I have got friends there and I wanna swim in barcelona beachs. that is it for now lets see how much this will take.Hello world this is an amazing day wuhu I am in London but quarantineee no matter no worries everything will be okay and this is my day 4 I am trying to create loooong mastering to see if it is going to charge me correctly, meaning duration based. anyways london is a cool place if you are alone and doing quarantine its a bit boring but",
      scriptName: "minuteLong11"
    });
    console.log(script);

    // script = await apiaudio.Script.retrieve(script["scriptId"]);
    // console.log(script);

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

    // let masteringResult = await apiaudio.Mastering.retrieve(script["scriptId"]);
    // console.log(masteringResult);
  } catch (e) {
    console.error(e);
  }
}

example();
