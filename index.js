const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion () {
  let question = "Làm sao để có network để connect về smartcontract"

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    temperature: 0.9,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  })

  console.log(completion.data.choices[0].text)
}

runCompletion();
