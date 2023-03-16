import { ApiHandler } from "sst/node/api";
import { App, AwsLambdaReceiver, LogLevel } from '@slack/bolt';
import { throwExpression } from '@slackbot-chatgpt-jira/core/utility';
import { AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';
import { slash } from '@slackbot-chatgpt-jira/core/slash';
import { Config } from 'sst/node/config';
import { action } from '@slackbot-chatgpt-jira/core/action'

const signingSecret = Config.SLACK_SIGNING_SECRET as string ?? throwExpression('Please provide SLACK_SIGNING_SECRET');
const token = Config.SLACK_TOKEN as string ?? throwExpression('No SLACK_TOKEN. Please provide one');


const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret,
  logLevel: LogLevel.INFO,
});

const app = new App({
  token,
  receiver: awsLambdaReceiver,
});

slash(app);

action(app);

export const handler = ApiHandler(async (event, context) => {
  try {
    console.log('Call Slack Command');

    const receiver = await awsLambdaReceiver.start();
    return await receiver(event as unknown as AwsEvent, context, (error) => { return error });

  } catch (error) {
    console.error(error);
    const e = error as Error;
    throw e;
  }
});
