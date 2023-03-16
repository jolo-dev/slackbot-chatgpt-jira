import { PlainTextOption } from '@slack/bolt';

export interface OAuth {
  code: string;
  clientId: string;
  secretId: string;
  redirectUri?: string;
}

export function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage);
}

export const getOauthAccessToken = async (param: OAuth, tokenUri: string) => {
  console.log(param);

  const response = await fetch(
    tokenUri,
    {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: JSON.stringify({
        code: param.code,
        client_id: param.clientId,
        client_secret: param.secretId,
      }),
    }
  )
  return response;
};

export function createDropDownOptions(options: string[]): PlainTextOption[] {
  return options.map(opt => {
    return {
      text: {
        type: "plain_text",
        text: opt,
        emoji: true
      },
      value: opt.toLowerCase().replace(' ', '-')
    }
  })
}