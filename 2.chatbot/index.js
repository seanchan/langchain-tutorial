const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatOpenAI } = require("@langchain/openai");
const { HttpsProxyAgent } = require("https-proxy-agent");
require("dotenv").config();

const agent = new HttpsProxyAgent("http://127.0.0.1:7890");

const model = new ChatOpenAI(
  {
    model: "gpt-4",
  },
  {
    apiKey: process.env.OPENAI_API_KEY,
    httpAgent: agent,
    configuration: {
      timeout: 5,
      httpAgent: agent,
    },
  }
);
const parser = new StringOutputParser();
const chain = model.pipe(parser);
chain
  .invoke([
    { role: "user", content: "Hi! I'm Bob" },
    { role: "assistant", content: "Hello Bob! How can I assist you today?" },
    { role: "user", content: "What's my name?" },
  ])
  .then((response) => {
    console.log(response);
  });
