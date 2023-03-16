import JiraApi, { JiraApiOptions } from 'jira-client';
import { Config } from 'sst/node/config';
import { Summary } from './openai';

const JIRA_TOKEN = Config.JIRA_TOKEN as string;
const JIRA_HOST = Config.JIRA_HOST as string;
const JIRA_USER = Config.JIRA_USER as string;

const options: JiraApiOptions = {
    protocol: 'https',
    host: JIRA_HOST,
    username: JIRA_USER, // replace with your JIRA username
    password: JIRA_TOKEN,
    apiVersion: '3',
    strictSSL: true
  }

interface IssueObject {
  category: string,
  department: string,
  summary: Summary
}

const jira = new JiraApi(options);

export async function createIssue(body: IssueObject){
   const issue: JiraApi.IssueObject = {
     fields: {
       issueType: {
         id: '10026' // Issuetype: Task
       },
       project: {
        key: 'NYY-1'
      },
      summary: body.summary.title,
      description: body.summary.output
    } 
   }
  const response = await jira.addNewIssue(issue);
  return response;
}
