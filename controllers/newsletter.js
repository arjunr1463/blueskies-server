const newsletter = require("../models/newsletter");
const nodemailer = require("nodemailer");

const createNewsletter = async (req, res) => {
  try {
    const email = req.body.email;
    const findData = await newsletter.findOne({ email });
    if (findData) {
      res.json("Already subscribed");
    } else {
      const newSubscriber = new newsletter({ email });
      await newSubscriber.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.Email,
          pass: process.env.Email_Pass,
        },
      });

      const mailOptions = {
        from: process.env.Email_From,
        to: email,
        subject: "Blueskies Academy",
        html: `
          <html>
            <head>
              <style>
                /* Add some CSS styling to the email */
                body {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
                  background-color: #f4f4f4;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 30px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                  color: #333;
                  text-align: center;
                }
                p {
                  color: #555;
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  background-color: #007bff;
                  color: #fff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Welcome to our newsletter!</h1>
                <p>Thank you for subscribing. You will now receive updates on our latest news and offers.</p>
                <p>To make sure you receive our emails, please add our email address to your contact list.</p>
                <p>If you have any questions or feedback, please don't hesitate to reply to this email.</p>
                <p>Best regards,</p>
                <p>Blueskies Academy</p>
                <p><a href="#" class="button">Unsubscribe</a></p>
              </div>
            </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json("Successfully subscribed");
    }
  } catch {
    res.json("Please fill the email field");
  }
};

module.exports = { createNewsletter };
