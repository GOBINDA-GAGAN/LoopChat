import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Twilio

const account_sid = process.env.Twilio_Account_SID;
const service_sid = process.env.Twilio_SERVICE_SID;
const auth_token = process.env.Twilio_AUTH_TOKEN;

const client = twilio(account_sid, auth_token);

//send otp
export const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("send otp to", phoneNumber);
    if (!phoneNumber) {
      throw new Error("phone number is required");
    }

    const response = await client.verify.v2
      .services(service_sid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    console.log("this is my otp response", response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("failed to send otp");
  }
};

//verify otp
export const verifyOtp = async (phoneNumber, otp) => {
  try {
    console.log("phone number", phoneNumber);

    console.log("otp", otp);
    if (!phoneNumber) {
      throw new Error("phone number is required");
    }

    const response = await client.verify.v2
      .services(service_sid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });

    console.log("this is my otp response", response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("otp verification failed");
  }
};
