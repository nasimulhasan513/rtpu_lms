export const AccountVerification = (otp) => {
  const temp = `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 10px 0;
        }

        .header img {
            max-width: 150px;
        }

        .header h1 {
            font-size: 24px;
      		font-weight: bold;
            margin: 0;
            color: #f8506c;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .content h2 {
            font-size: 20px;
            color: ##f8506c;
        }

        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #666;
        }

        .verification-button {
            display: inline-block;
            padding: 15px 25px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff;
            background-color: #f8506c;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }

        .footer a {
            color: #666;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>Rhombus Publication</h1>
        </div>

        <div class="content">
            <h2>Welcome!</h2>
            <p>Thank you for creating an account with Rhombus Publication. Please confirm your email address by applying the OTP Code.</p>
           <h3>
            ${otp}
           </h3>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>

        <div class="footer">
            <p>© 2024 Rhombus Publication. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Contact Us</a></p>
        </div>
    </div>
</body>

</html>`;

  return temp;
};
