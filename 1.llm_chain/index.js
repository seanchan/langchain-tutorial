const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatOpenAI } = require("@langchain/openai");
const { HttpsProxyAgent } = require("https-proxy-agent");
const env = require("dotenv").config();
const dotenv = env.parsed;

const agent = new HttpsProxyAgent("http://127.0.0.1:7890");

const model = new ChatOpenAI(
  {
    model: "gpt-3.5-turbo",
  },
  {
    apiKey: dotenv.OPENAI_API_KEY,
    httpAgent: agent,
    configuration: {
      timeout: 5,
      httpAgent: agent,
    },
  }
);

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];
const parser = new StringOutputParser();
const chain = model.pipe(parser);
chain.invoke(messages).then((response) => console.log(response));
console.log("done");
