const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatOpenAI } = require("@langchain/openai");

const model = new ChatOpenAI({
  model: "gpt-4",
  timeout: 30,
});

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];
const parser = new StringOutputParser();
const chain = model.pipe(parser);
chain.invoke(messages).then((response) => console.log(response));
console.log("done");
