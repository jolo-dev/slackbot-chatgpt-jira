import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config() {
    return {
      name: "slackbot-chatgpt-jira",
      region: "eu-central-1",
    };
  },
  stacks(app) { 
    app.stack(API)
  },
} satisfies SSTConfig;
