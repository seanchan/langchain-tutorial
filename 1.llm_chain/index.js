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
model
  .invoke(messages)
  .then((response) =>
    parser.invoke(response).then((result) => console.log(result))
  );
console.log("done");
