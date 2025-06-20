import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Replace with your SMTP host
  port: 587, // Replace with your SMTP port
  auth: {
    user: process.env.SMTP_USER, // Replace with your email user
    pass: process.env.SMTP_PASSWORD, // Replace with your email password
  },
});

export default transporter;
