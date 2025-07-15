
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateEmailBody } from '@/ai/flows/generate-email-body';

export async function POST(req: NextRequest) {
  const { to, quotationData, pdfBase64 } = await req.json();

  if (!to || !quotationData || !pdfBase64) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // 1. Generate Email Body using Gemini
    const emailBodyResult = await generateEmailBody({
      clientName: quotationData.clientName,
      yourCompanyName: quotationData.yourCompanyName,
      projectDescription: quotationData.projectDescription,
    });
    const emailMessage = emailBodyResult.emailBody;

    // 2. Convert Base64 PDF to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // 3. Send Email with Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
      },
    });

    const mailOptions = {
      from: `"${quotationData.yourCompanyName}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Your Project Quotation from ${quotationData.yourCompanyName}`,
      html: `<p>${emailMessage.replace(/\n/g, '<br>')}</p>`,
      attachments: [
        {
          filename: `Quotation_${quotationData.clientCompanyName || 'Quote'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to send email. ${errorMessage}` }, { status: 500 });
  }
}
