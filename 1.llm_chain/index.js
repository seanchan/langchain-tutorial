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

const template = ChatPromptTemplate.fromMessages([
  ["system", "Translate the following into {language}:"],
  ["user", "{text}"],
]);

// const messages = await template.invoke({ language: "italian", text: "hi" });
const parser = new StringOutputParser();
const chain = template.pipe(model).pipe(parser);
chain
  .invoke({ language: "italian", text: "hi" })
  .then((response) => console.log(response));
console.log("done");
