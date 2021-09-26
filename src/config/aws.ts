import AWS from 'aws-sdk';

AWS.config.credentials = new AWS.Credentials(process.env.AWS_ACCESS_ID || '', process.env.AWS_ACCESS_SECRET || '');

AWS.config.update({ region: process.env.AWS_REGION || '' });

const sns = new AWS.SNS({
  region: 'us-east-2',
});

export { sns };
