import axios from "axios";

const DEBUG_MODE = process.env.DEBUG_MODE;

export const sendSMS = async (phone: string, sms: string) => {
  try {
    if (DEBUG_MODE === "true") {
      console.log("SMS:", sms);
      return;
    }

    const url =
      "https://smsgatewaybe-production.up.railway.app/api/sms/send-single";
    const response = await axios.post(url, {
      api_key: "66e67dc27898e0f6445c8ab2",
      phone: phone,
      message: sms,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendBulkSMS = async (messages: any) => {
  try {
    if (DEBUG_MODE === "true") {
      console.log("SMS:", messages);
      return;
    }

    const url =
      "https://smsgatewaybe-production.up.railway.app/api/sms/send-multiple";
    const response = await axios.post(url, {
      api_key: "6675c0044feb043cf399d80c",
      messages,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
