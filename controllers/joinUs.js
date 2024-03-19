const nodemailer = require("nodemailer");
const validator = require("validator");

const createDetail = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json("Invalid email address");
    }
    if (!/^[0-9]{10}$/.test(req.body.phone)) {
      return res.status(400).json("Invalid phone number");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Email_Pass,
      },
    });

    const companyMailOptions = {
      from: process.env.Email_From,
      to: req.body.email,
      subject: "Blueskies Academy",
      html: `
        <html>
          <head>
            <style>
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
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th {
                background-color: #EF834B;
                color: white;
                font-weight: normal;
                text-align: left;
                padding: 10px;
              }
              td {
                padding: 10px;
                border-bottom: 1px solid #ddd;
              }
              p {
                color: #555;
                 margin-bottom: 20px;
                margin-top: 20px;
               
              }
              p1 {
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
              <h1>Thank you for submitting your details!</h1>
              <p>Here's a summary of the information you provided:</p>
              <table>
                <tr>
                  <th>Name</th>
                  <td>${name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>${email}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>${phone}</td>
                </tr>
              </table>
              <p>We will get in touch with you shortly.</p>
              <p1>Best regards,</p1>
              <p1>Blueskies Academy</p1>
              <p><a href="#" class="button">Unsubscribe</a></p>
            </div>
          </body>
        </html>
      `,
    };

    const adminMailOptions = {
      from: req.body.email,
      to: process.env.Email_From,
      subject: "New Student Enquiry",
      html: `<p>A new student has submitted their details.</p>
             <p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Phone Number: ${phone}</p>`,
    };

    transporter.sendMail(companyMailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error: Could not send email");
      } else {
        console.log("Company email sent: " + info.response);
      }
    });

    transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Admin email sent: " + info.response);
      }
    });

    res.json("Details submitted successfully");
  } catch {
    return res.status(500).json("Something went wrong");
  }
};

const createContactDetail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.subject ||
      !req.body.message
    ) {
      res.status(400).json("Please fill all the fields");
    } else if (!validator.isEmail(req.body.email)) {
      return res.status(400).json("Invalid email address");
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.Email,
          pass: process.env.Email_Pass,
        },
      });

      const mailOptions = {
        from: req.body.email,
        to: process.env.Email_From,
        subject: `New message received from ${name}`,
        html: `<p>You have received a new message from the contact form on your website.</p>
                     <p><strong>Name:</strong> ${name}</p>
                     <p><strong>Email:</strong> ${email}</p>
                     <p><strong>Subject:</strong> ${subject}</p>
                     <p><strong>Message:</strong> ${message}</p>
                     `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error: Could not send email");
        } else {
          console.log("Email sent: " + info.response);
          res.send("Details submitted successfully");
        }
      });
    }
  } catch {
    return res.status(500).json("Something went wrong");
  }
};

module.exports = { createDetail, createContactDetail };
