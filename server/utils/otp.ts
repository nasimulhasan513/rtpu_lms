const sendOTP = async (cred: string) => {
  let email;
  let phone;

  // Check if cred is email or phone
  if (validateEmail(cred)) {
    email = cred;
  } else if (validatePhone(cred)) {
    phone = cred;
  } else {
    throw new Error("Invalid credential provided.");
  }

  // Check if there's an existing token that hasn't expired yet
  const existingToken = await db.resetToken.findFirst({
    where: {
      // @ts-ignore
      OR: [{ email: email }, { phone: phone }],
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  // check if sent 5 min ago refresh token has sentAt property
  const sentAt = new Date(existingToken?.sentAt);
  const currentTime = new Date();
  const diff = Math.abs(currentTime.getTime() - sentAt.getTime());

  if (!existingToken || diff > 300000) {
    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token in the resetToken table
    const newToken = await db.resetToken.create({
      data: {
        phone: phone || undefined,
        email: email || undefined,
        otp: otp,
        expiresAt: expires,
        sentAt: new Date(),
      },
    });

    // Send the OTP
    if (email) {
      await sendVerificationEmail(email, otp);
    } else if (phone) {
      await sendSMS(phone, `Your rhombus publications OTP is ${otp}`);
    }

    return {
      message: "Verification code sent successfully",
      token: newToken.id,
    };
  } else {
    console.log("existingToken", existingToken);

    return {
      message: "A valid verification code has already been sent",
      token: existingToken.id,
    };
  }
};

// Helper function to validate if a string is an email
const validateEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

// Helper function to validate if a string is a phone number
const validatePhone = (phone: string) => {
  const re = /^01?[1-9]\d{1,11}$/; // E.164 phone number format
  return re.test(String(phone));
};

const clearTokens = async (cred: string) => {
  await db.resetToken.deleteMany({
    where: {
      OR: [{ email: cred }, { phone: cred }],
    },
  });
};

export { sendOTP, validateEmail, validatePhone, clearTokens };
