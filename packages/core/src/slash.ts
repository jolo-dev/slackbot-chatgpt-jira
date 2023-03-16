import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { App } from '@slack/bolt';

export function slash(app: App) {
  app.command('/summarize', async ({ ack, body, logger, say }) => {
    logger.info('Call Slash Command');
    logger.debug(body);
    try {
      // Acknowledge the command request
      await ack();
      // There is a bit of an hack needed.
      // Because Slack is running through a timeout at exactly 3s but ChatGPT needs longer
      // we have to send a message before triggering another Lambda
      const response = await say({
        text: 'Loading',
        blocks: [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Hold on...",
              "emoji": true
            }
          }],
      });

      // Invoking the OpenAI Lambda
      const lambda = new LambdaClient({
        region: process.env.AWS_REGION,
      });

      const jsonString = JSON.stringify({ts: response.ts ,...body});

      // Convert the JSON string to a Uint8Array
      const uint8Array = new TextEncoder().encode(jsonString);

      const command = new InvokeCommand({
        FunctionName: 'openAiInvoker',
        Payload: uint8Array,
        InvocationType: 'Event',
      });

      lambda.send(command); // async function which we really send asynchronously
    }
    catch (error) {
      logger.error(error);
    }
  });
}