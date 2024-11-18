require("dotenv").config();

const nodemailer = require("nodemailer");

const emailUser = process.env.MAILTRAP_USER;
const emailpass = process.env.MAILTRAP_PASS;

exports.sendNewsEmail = async (req, res) => {
  try {
    console.log("MAILTRAP_USER:", emailUser);
    console.log("MAILTRAP_PASS:", emailpass);

    const { emailAddress, articles } = req.body;

    console.log(`Sending email to Address: ${emailAddress}`);

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: emailUser,
        pass: emailpass,
      },
    });

    // Prepare email content
    const newsItems = articles
      //   .map((item) => `<h3>${item.title}</h3><p>${item.description}</p>`)
      .map((item) => `<h3>${item.title}</h3>`)
      .join("");

    const mailOptions = {
      from: "your_email@example.com",
      to: emailAddress,
      subject: "Your News Updates",
      html: `<h2>Here are your latest news updates:</h2>${newsItems}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send email", error });
  }
};
