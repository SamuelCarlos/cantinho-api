import { sns } from '../../config/aws';

const sendSMS = async (message: string, phone: string) => {
  try {
    await sns
      .setSMSAttributes({
        attributes: {
          DefaultSMSType: 'Transactional',
        },
      })
      .promise();

    await sns
      .publish({
        Message: message,
        PhoneNumber: `+55${phone}`,
      })
      .promise();
  } catch (err) {
    console.error(err);
  }
};

export default sendSMS;
