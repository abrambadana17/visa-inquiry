import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, visaType, destination, contactMethod, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Visa Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Visa Inquiry from ${name}`,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Visa Type: ${visaType || 'Not specified'}
Destination Country: ${destination || 'Not specified'}
Preferred Contact Method: ${contactMethod || 'Email'}

Message:
${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}