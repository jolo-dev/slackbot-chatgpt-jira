import { Config } from 'sst/node/config';
import { Configuration, OpenAIApi } from 'openai'

const openaiConfig = new Configuration({
    apiKey: Config.OPEN_AI_TOKEN as string
})

const openai = new OpenAIApi(openaiConfig);

export interface Summary {
    title: string,
    source: string,
    publicationDate: string,
    keywords: string,
    summary: string,
    output: string
}

export async function summarize(text: string): Promise<Summary | undefined> {
    try{
        if(text !== ''){
            const completion = await openai.createCompletion({
              model: 'text-davinci-003',
              prompt: `Summarize in a numbered list format, including the title, source, publication date of this article, keywords and a short three-sentence summary. ${text}`,
              max_tokens: 3096,
            });
    
            if(completion.data.choices[0].text){
                // break the textblock into an array of lines
                const lines = completion.data.choices[0].text.split('\n');
                // remove one line, starting at the first position
                lines.splice(0,2);
                console.log(lines);
                // return lines.join('\n');
                return {
                    title: lines[0],
                    source: lines[1],
                    publicationDate: lines[2],
                    keywords: lines[3],
                    summary: lines[4],
                    output: lines.join('\n')
                }

            } else {
              console.log('No output');
            }
        } else {
            console.log('No text Input was given')
        }
    }catch(error: any){
        if(error.response){
            console.error(error.response.status);
            console.error(error.response.data);
        }else{
            console.error(error.message)
        }
    }
}