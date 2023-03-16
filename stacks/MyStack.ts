import { StackContext, Api } from "sst/constructs";
import { Config } from "sst/constructs";
import { Function } from 'sst/constructs';


export function API({ stack }: StackContext) {
  const SLACK_TOKEN = new Config.Secret(stack, "SLACK_TOKEN");
  const SLACK_SIGNING_SECRET = new Config.Secret(stack, "SLACK_SIGNING_SECRET");
  const OPEN_AI_TOKEN = new Config.Secret(stack, "OPEN_AI_TOKEN");
  const JIRA_TOKEN = new Config.Secret(stack, "JIRA_TOKEN");
  const JIRA_USER = new Config.Secret(stack, "JIRA_USER");
  const JIRA_HOST = new Config.Secret(stack, "JIRA_HOST");

  const api = new Api(stack, "api", {
    routes: {
      "POST /": "packages/functions/src/lambda.handler",
    },
    defaults: {
      function: {
        runtime: 'nodejs18.x'
      }
    }
  });
  
  api.bind([SLACK_TOKEN]);
  api.bind([SLACK_SIGNING_SECRET]);
  api.bind([OPEN_AI_TOKEN]);
  api.bind([JIRA_TOKEN]);
  api.bind([JIRA_HOST]);
  api.bind([JIRA_USER]);
  

  // Add an additional Function for invoking the OpenAI
  // Why? Because it needs longer than 3s and for Slack it runs into a timeout
  const invoker = new Function(stack, 'OpenAiInvoker', {
    handler: 'packages/functions/src/openAiInvoker.invoke',
    timeout: '5 minutes',
    permissions: ['ssm'],
    bind: [SLACK_TOKEN, OPEN_AI_TOKEN],
    runtime: "nodejs18.x",
    functionName: 'openAiInvoker'
  });

  const slashHandler = api.getFunction('POST /');
  if(slashHandler){
    invoker.grantInvoke(slashHandler);
  }


  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
