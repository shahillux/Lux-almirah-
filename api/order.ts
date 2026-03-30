import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, mobile, address, pincode, product, paymentMethod, status } = req.body;

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
    subject: `New Order Received: ${product.name}`,
    text: `
      New Order Details:
      ------------------
      Product: ${product.name}
      Price: ${product.price}
      
      Customer Details:
      Name: ${name}
      Email: ${email}
      Mobile: ${mobile}
      Address: ${address}
      Pincode: ${pincode}
      
      Payment Details:
      Method: ${paymentMethod}
      Status: ${status}
    `,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <hr />
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Pincode:</strong> ${pincode}</p>
      <hr />
      <h3>Payment Details</h3>
      <p><strong>Method:</strong> ${paymentMethod}</p>
      <p><strong>Status:</strong> <span style="color: ${status === 'PAID' ? 'green' : 'red'}">${status}</span></p>
    `
  };

  try {
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Order submitted successfully" });
    } else {
      console.warn("Email not sent: EMAIL_PASS environment variable is not set.");
      res.status(500).json({ success: false, message: "Server email configuration missing" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send order email" });
  }
}
