// /api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { full_name, email, phone, subject, message } = req.body || {};
    if (!full_name || !email || !message) {
      return res.status(400).json({ success:false, message:"Missing required fields." });
    }

    // Gmail SMTP via App Password
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // smtp.gmail.com
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,                        // true if you use 465
      auth: {
        user: process.env.SMTP_USER,        // your Gmail address
        pass: process.env.SMTP_PASS,        // the 16-char App Password
      },
    });

    await transporter.sendMail({
      from: `"The Banner Company" <${process.env.FROM_EMAIL}>`, // MUST match your Gmail address
      to: process.env.TO_EMAIL,                                  // where you want to receive
      replyTo: `${full_name} <${email}>`,
      subject: subject ? `[${subject}] New enquiry from ${full_name}` : `New enquiry from ${full_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${full_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Subject:</b> ${subject || "-"}</p>
        <p><b>Message:</b><br>${(message || "").replace(/\n/g, "<br>")}</p>
      `,
    });

    return res.status(200).json({ success:true, message:"Thanks! We’ll get back to you shortly." });
  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({ success:false, message:"Failed to send email." });
  }
}
