const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { ChatOpenAI } = require("@langchain/openai");

const model = new ChatOpenAI({
  model: "gpt-4",
  timeout: 30,
});

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];
model.invoke(messages).then((response) => console.log(response));
console.log("done");
