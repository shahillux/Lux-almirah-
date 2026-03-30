import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/order", async (req, res) => {
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
        res.json({ success: true, message: "Order submitted successfully" });
      } else {
        console.warn("Email not sent: EMAIL_PASS environment variable is not set.");
        res.status(500).json({ success: false, message: "Server email configuration missing" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send order email" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
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
        res.json({ success: true, message: "Subscribed successfully" });
      } else {
        res.status(500).json({ success: false, message: "Server email configuration missing" });
      }
    } catch (error) {
      console.error("Error sending newsletter email:", error);
      res.status(500).json({ success: false, message: "Failed to send subscription email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
