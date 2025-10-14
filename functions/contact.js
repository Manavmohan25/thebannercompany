// Netlify Functions (Node 18+)
import nodemailer from "nodemailer";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { full_name, email, phone, subject, message } = JSON.parse(event.body || "{}");
    if (!full_name || !email || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ success:false, message:"Missing required fields." }) };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,  // e.g. smtp-relay.sendinblue.com
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"The Banner Company" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: `${full_name} <${email}>`,
      subject: subject ? `[${subject}] New enquiry from ${full_name}` : `New enquiry from ${full_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${full_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Subject:</b> ${subject || "-"}</p>
        <p><b>Message:</b><br>${(message || "").replace(/\n/g,"<br>")}</p>
      `,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success:true, message:"Thanks! We’ll get back to you shortly." }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, headers, body: JSON.stringify({ success:false, message:"Failed to send email." }) };
  }
}
