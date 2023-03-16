import { App, BlockAction } from '@slack/bolt';
import { createIssue } from './jira';

export function action(app: App){
    app.action<BlockAction>('category_select', async ({ ack, logger, action }) => {
        await ack();
        logger.info('Category selected')
        logger.info(action);
    })
    app.action<BlockAction>('department_select', async ({ ack, logger, action}) => {
        await ack();
        logger.info('Department selected')
        logger.info(action);
    })

    app.action<BlockAction>('create-jira',  async ({ ack, body, logger }) => {
        await ack();
        logger.info('Create Jira Action');
        try {
            // logger.info(body);
            const message = body.message?.text?.split('\n');
            const values = body.state?.values;
            // Slack objects are not very intuitive
            const keys = Object.keys(values!);
            const category = keys.map((val, idx) => {
                if(idx === 0){
                    const tmp = values?.[val]
                    return Object.values(tmp!)[0]['selected_option']?.value
                }
            })[0];
            const department = keys.map((val, idx) => {
                if(idx === 1){
                    const tmp = values?.[val]
                    // logger.info(Object.values(tmp!)[0]['selected_option']?.value)
                    return Object.values(tmp!)[0]['selected_option']!.value
                }
            })[1];

            if(message && category && department){
                await createIssue({
                    category,
                    department,
                    summary: {
                        title: message[0],
                        source: message[1],
                        publicationDate: message[2],
                        keywords: message[3],
                        summary: message[4],
                        output: message[5]
                    }
                })
            }
            
            logger.info('category', category, 'department', department, 'message', message)
        } catch (error) {
            logger.error(error)
        }
    })
}