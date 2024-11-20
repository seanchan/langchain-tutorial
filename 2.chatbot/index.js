const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { v4 } = require("uuid");
const {
  StateGraph,
  MessagesAnnotation,
  MemorySaver,
  START,
  END,
} = require("@langchain/langgraph");
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
// chain
//   .invoke([
//     { role: "user", content: "Hi! I'm Bob" },
//     { role: "assistant", content: "Hello Bob! How can I assist you today?" },
//     { role: "user", content: "What's my name?" },
//   ])
//   .then((response) => {
//     console.log(response);
//   });

const uuidv4 = v4();
const config = { configurable: { thread_id: uuidv4 } };
console.log(config);

const callModel = async (state) => {
  const response = await model.invoke(state.messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();

const app = workflow.compile({ checkpointer: memory });

const input = [
  {
    role: "user",
    content: "Hi! I'm Bob.",
  },
];
app.invoke({ messages: input }, config).then((output) => {
  // The output contains all messages in the state.
  // This will long the last message in the conversation.
  console.log(output.messages[output.messages.length - 1]);

  const input2 = [
    {
      role: "user",
      content: "What's my name?",
    },
  ];
  app.invoke({ messages: input2 }, config).then((output) => {
    // The output contains all messages in the state.
    // This will long the last message in the conversation.
    console.log(output.messages.length + ":");
    console.log(output.messages[output.messages.length - 1]);
  });
});
