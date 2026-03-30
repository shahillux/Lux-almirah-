import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'biskitip@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'biskitip@gmail.com',
    to: 'biskitip@gmail.com',
    subject: `New Newsletter Subscription`,
    text: `New subscription from: ${email}`,
    html: `<h3>New Newsletter Subscription</h3><p><strong>Email:</strong> ${email}</p>`
  };

  try {
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Subscribed successfully" });
    } else {
      res.status(500).json({ success: false, message: "Server email configuration missing" });
    }
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    res.status(500).json({ success: false, message: "Failed to send subscription email" });
  }
}
