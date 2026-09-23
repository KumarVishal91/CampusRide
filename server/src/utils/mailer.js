import nodemailer from "nodemailer";
export async function sendOtp(email, otp) {
  if (!process.env.SMTP_HOST) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await t.sendMail({
    from: `CampusRide <${process.env.SMTP_USER}>`, to: email,
    subject: "Your CampusRide verification code",
    text: `Your code is ${otp}. It expires in 10 minutes.`,
  });
}
