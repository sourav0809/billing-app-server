import { IncomingWebhook } from 'ms-teams-webhook';

import envConfig from '../config/config';
import { MICROSOFT_TEAMS_WEBHOOKS } from '../constants/webhook';

const BookADemo = async (data: {
  error?: any;
  instituteEmail: string;
  instituteName: string;
  message: string;
  name: string;
  phoneNumber: string;
}) => {
  const { error, instituteEmail, instituteName, message, name, phoneNumber } = data;

  const webhook = new IncomingWebhook(envConfig.microsoftTeams.bookDemoWebhookUrl);

  await webhook.send({
    attachments: [
      {
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          body: [
            {
              text: error
                ? `Hey <at>${MICROSOFT_TEAMS_WEBHOOKS.bookDemo.channelErrorMention.name}</at>, error occurred during Book A Demo submission!`
                : `Hey <at>${MICROSOFT_TEAMS_WEBHOOKS.bookDemo.channelMention.name}</at>, New Book A Demo enquiry received!`,
              type: 'TextBlock',
              wrap: true
            },

            {
              text: 'Institute Details:',
              type: 'TextBlock',
              weight: 'Bolder'
            },
            {
              text: `👤 Person Name: ${name}`,
              type: 'TextBlock',
              wrap: true
            },
            {
              text: `🏫 Institute Name: ${instituteName}`,
              type: 'TextBlock',
              wrap: true
            },
            {
              text: `📧 Email: ${instituteEmail}`,
              type: 'TextBlock',
              wrap: true
            },
            {
              text: `📞 Phone: ${phoneNumber || '-'}`,
              type: 'TextBlock',
              wrap: true
            },
            {
              text: `💬 Message: ${message || '-'}`,
              type: 'TextBlock',
              wrap: true
            },
            ...(error
              ? [
                  {
                    text: 'Error Details:',
                    type: 'TextBlock',
                    weight: 'Bolder'
                  },
                  {
                    text: `${JSON.stringify(error)}`,
                    type: 'TextBlock',
                    wrap: true
                  }
                ]
              : [])
          ],
          msteams: {
            entities: [
              error
                ? {
                    mentioned: MICROSOFT_TEAMS_WEBHOOKS.bookDemo.channelErrorMention, // must contain { id, name }
                    text: `<at>${MICROSOFT_TEAMS_WEBHOOKS.bookDemo.channelErrorMention.name}</at>`,
                    type: 'mention'
                  }
                : {
                    mentioned: MICROSOFT_TEAMS_WEBHOOKS.bookDemo.channelMention,
                    text: `<at>${MICROSOFT_TEAMS_WEBHOOKS.bookDemo.channelMention.name}</at>`,
                    type: 'mention'
                  }
            ]
          },
          type: 'AdaptiveCard',
          version: '1.0'
        },
        contentType: 'application/vnd.microsoft.card.adaptive'
      }
    ],
    type: 'message'
  });
};

export default {
  BookADemo
};
