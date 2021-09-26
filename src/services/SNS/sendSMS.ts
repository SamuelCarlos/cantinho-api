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

    const a = await sns
      .publish({
        Message: message,
        PhoneNumber: `+55${phone}`,
      })
      .promise();

    console.log(a);
  } catch (err) {
    console.error(err);
  }
};

export default sendSMS;
