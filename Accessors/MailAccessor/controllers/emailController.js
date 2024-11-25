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

    const headerImageUrl =
      "https://static.vecteezy.com/ti/vetor-gratis/p1/29920188-o-que-e-novo-megafone-para-promocao-projeto-discurso-bolha-icone-simbolo-ilustracao-vetor.jpg";

    const newsItems = articles
      .map(
        (item) => `
      <div style="border-bottom: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
        <h3 style="font-family: Arial, sans-serif; color: #333;">${
          item.title
        }</h3>
        <p style="font-family: Arial, sans-serif; color: #666; margin: 10px 0;">${
          item.description || "No description available."
        }</p>
        <a href="${
          item.link
        }" style="font-family: Arial, sans-serif; color: #1a73e8; text-decoration: none;">Read more</a>
      </div>
    `
      )
      .join("");

    const emailContent = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${headerImageUrl}" alt="News Header" style="width: 100%; max-width: 800px; height: auto;" />
      </div>${newsItems}</div>`;

    const mailOptions = {
      from: "news_updates@example.com",
      to: emailAddress,
      subject: "Your News Updates",
      html: `${emailContent}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send email", error });
  }
};
