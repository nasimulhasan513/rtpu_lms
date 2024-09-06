// @ts-ignore
import { SendMailClient } from "zeptomail";
import { AccountVerification } from "../email/accountverification";
const url = "api.zeptomail.com/";
const token =
  "Zoho-enczapikey wSsVR61yqEbxC6oommGpdL05yFsBBV33HEl83VDw4iSqS6uX9cdulBLHBgWvGvAcFG84FWAUorl7nE0B1TYOj9gtyAwIDCiF9mqRe1U4J3x17qnvhDzMWmpVkxuLLokAzgljm2FjE8ok+g==";
const DEBUG_MODE = process.env.DEBUG_MODE;

export const sendVerificationEmail = (email: string, otp: string) => {
  if (DEBUG_MODE === "true") {
    console.log("EMAIL:", `OTP: ${otp} for ${email}`);
    return;
  }

  const client = new SendMailClient({ url, token });

  let data = {
    from: {
      address: "noreply@rhombuspublications.com",
    },
    to: [
      {
        email_address: {
          address: email,
          name: email.split("@")[0],
        },
      },
    ],
    subject: "Account Verification | RHOMBUS PUBLICATIONS",
    htmlbody: AccountVerification(otp),
  };

  client
    .sendMail(data)
    .then((resp) => console.log("success"))
    .catch((error) => console.log(JSON.stringify(error)));
};
