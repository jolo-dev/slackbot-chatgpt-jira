import { SlashCommand} from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { summarize } from '@slackbot-chatgpt-jira/core/openai';
import { createDropDownOptions } from '@slackbot-chatgpt-jira/core/utility';
import { Config } from "sst/node/config";

const SLACK_TOKEN = Config.SLACK_TOKEN ;

export const invoke = async (event: SlashCommand & {ts: string}) => {
    try {
        console.log('Invoke OpenAiInvoker Lambda');
        
        const slack = new WebClient(SLACK_TOKEN);
        const result = await summarize(event.text);
        if(result){
          console.log(result);
          slack.chat.update({
            channel: event.channel_id,
            text: result.title,
            ts: event.ts,
            blocks: [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "Result",
                    "emoji": true
                  }
                },
                {
                  "type": "divider"
                },
                {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: result.output
                }
              },
              {
                "type": "divider"
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "Category"
                },
                accessory: {
                  type: "static_select",
                  action_id: 'category_select',
                  placeholder: {
                    type: "plain_text",
                    text: "Select a category",
                    emoji: true
                  },
                  options: createDropDownOptions(['Do', 'Decide', 'Delegate', 'Delete'])
                }
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "Department"
                },
                accessory: {
                  type: "static_select",
                  action_id: 'department_select',
                  placeholder: {
                    type: "plain_text",
                    text: "Select a department",
                    emoji: true
                  },
                  options: createDropDownOptions(['Channel Success', 'Customer Success', 'Accessibility Services', 'Solution Suite', 'Human Resources', 'IT', 'Marketing', 'Operations', 'Sales'])
                }
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: {
                      type: "plain_text",
                      text: "Create JIRA Ticket",
                      emoji: true
                    },
                    action_id: "create-jira"
                  }
                ]
              }
            ]
          })
          
        }
        
      } catch (error) {
        console.error(error);
        const e = error as Error;
        throw e;
      }
}