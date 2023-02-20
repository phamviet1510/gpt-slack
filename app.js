const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const app = express();

// enable CORS
app.use(cors());

// parse application/x-www-form-urlencoded and parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/slack/webhook', (req, res) => {
  res.send(`Thank you for signing up for our newsletter`);
});

const { App } = require("@slack/bolt");

const slackApp = new App({
  token: process.env.SLACK_TOKEN, //Find in the Oauth  & Permissions tab
  signingSecret: process.env.SLACK_SIGNING_SECRET, // Find in Basic Information Tab
  socketMode:true,
  appToken: process.env.SLACK_APP_TOKEN // Token from the App-level Token that we created
});

slackApp.start(3000)

// slackApp.command("/gpt", async ({ command, ack, say }) => {
//   try {
//     await sleep(2000);
//     await ack();
//     let msg_received = command.text // The inputted parameters
//     reply_text = await runCompletion(msg_received)
//     console.log(reply_text, msg_received)

//     await say(reply_text)
//   } catch (error) {
//     console.log("err")
//     console.error(error);
//   }
// });

slackApp.event('app_mention', async ({ event, context, client, say }) => {
  try {
    const msg_received = event.text.replace(/<@.+?>/, '').trim();
    reply_text = await runCompletion(msg_received)
    // console.log(event)

    if (isNaN(event.thread_ts)) {
      await say(reply_text)
    } else {
      await say({text: reply_text, thread_ts: event.thread_ts || event.ts})
    }
  }
  catch (error) {
    console.error(error);
  }
});

// Init Open AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function runCompletion(msg_confirm) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: msg_confirm,
    temperature: 0.9,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  })
  // console.log(completion.data)
  return completion.data.choices[0].text
}
