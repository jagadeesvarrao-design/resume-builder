// Vercel Serverless Function: Direct Contact & Inbound Lead Dispatcher
// Endpoint: /api/contact

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { name = 'Anonymous Visitor', email, message, rating = 5 } = req.body || {};

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required fields.' });
    }

    let emailDispatched = false;
    let whatsappDispatched = false;

    function escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

    // 1. Dispatch Email Alert via Nodemailer (Gmail SMTP)
    const gmailUser = process.env.GMAIL_USER || 'aneevarpsolutions@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const recipientEmail = process.env.CRM_TEAM_EMAIL || 'aneevarpsolutions@gmail.com';

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        const mailOptions = {
          from: `"ZenResume Operations" <${gmailUser}>`,
          to: recipientEmail,
          replyTo: email,
          subject: `[ZenResume Lead] New Inbound Inquiry from ${safeName} (${rating}★)`,
          text: `Name: ${name}\nEmail: ${email}\nRating: ${rating}/5\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px;">
              <div style="background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 600px; margin: auto; padding: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="border-bottom: 2px solid #006856; padding-bottom: 16px; margin-bottom: 20px;">
                  <h2 style="margin: 0; color: #006856; font-size: 20px;">ZenResume — Inbound Contact & Feedback</h2>
                  <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Aneevarp Solutions Operations Desk</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold; width: 30%;">Sender Name:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">Sender Email:</td>
                    <td style="padding: 8px 0; color: #006856; font-size: 14px; font-weight: 600;"><a href="mailto:${safeEmail}" style="color: #006856; text-decoration: none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">Experience Rating:</td>
                    <td style="padding: 8px 0; color: #F59E0B; font-size: 15px; font-weight: 700;">${'★'.repeat(Math.min(5, Math.max(1, rating)))} (${rating}/5)</td>
                  </tr>
                </table>

                <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Message / Feedback:</div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #1e293b;">
                  ${safeMessage}
                </div>

                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8;">
                  Delivered automatically by ZenResume • Aneevarp Solutions (MSME: UDYAM-AP-10-0144446)
                </div>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailDispatched = true;
      } catch (smtpErr) {
        console.error('ZenResume Nodemailer SMTP Error:', smtpErr);
      }
    }

    // 1b. Server-Side Direct FormSubmit Forwarder Fallback
    if (!emailDispatched) {
      try {
        const fsRes = await fetch('https://formsubmit.co/ajax/aneevarpsolutions@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Referer': 'https://www.zenresume.online/',
            'Origin': 'https://www.zenresume.online'
          },
          body: JSON.stringify({
            _subject: `[ZenResume Inbound] from ${safeName} (${rating}★)`,
            _template: 'table',
            _captcha: 'false',
            _replyto: email,
            sender_name: name,
            sender_email: email,
            rating: `${rating} / 5`,
            message: message,
            submitted_at: new Date().toLocaleString('en-IN')
          })
        });
        if (fsRes.ok) {
          emailDispatched = true;
        }
      } catch (fsErr) {
        console.warn('Server-side form dispatch notice:', fsErr);
      }
    }

    // 2. Dispatch Instant WhatsApp Alert via Twilio REST API
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';
    const toWhatsApp = process.env.CRM_HEAD_WHATSAPP_NUMBER || '+918790906267';

    if (twilioSid && twilioToken && fromWhatsApp && toWhatsApp) {
      try {
        const fromFormatted = fromWhatsApp.startsWith('whatsapp:') ? fromWhatsApp : `whatsapp:${fromWhatsApp}`;
        const toFormatted = toWhatsApp.startsWith('whatsapp:') ? toWhatsApp : `whatsapp:${toWhatsApp}`;

        const whatsappBody = `🚨 *New ZenResume Inquiry*\n\n👤 *From:* ${name}\n📧 *Email:* ${email}\n⭐ *Rating:* ${rating}★\n💬 *Message:* \"${message.substring(0, 300)}\"\n\n🔗 *Reply:* mailto:${email}`;

        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;

        const twilioParams = new URLSearchParams();
        twilioParams.append('From', fromFormatted);
        twilioParams.append('To', toFormatted);
        twilioParams.append('Body', whatsappBody);

        const twilioRes = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: twilioParams.toString(),
        });

        if (twilioRes.ok) {
          whatsappDispatched = true;
        } else {
          const errData = await twilioRes.json();
          console.warn('Twilio WhatsApp dispatch notice:', errData);
        }
      } catch (waErr) {
        console.error('ZenResume Twilio WhatsApp Error:', waErr);
      }
    }

    // 3. Generate Traceable Grievance Ticket ID (Consumer Protection & IT Rules 2021)
    const timestampIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const ticketId = 'ANV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    return res.status(200).json({
      success: true,
      ticketId,
      timestampIST,
      sla: 'Statutory SLA: Acknowledgment within 24 hours, Resolution within 15 days.',
      message: 'Inquiry registered successfully with Aneevarp Solutions Desk.',
      emailDispatched,
      whatsappDispatched,
    });
  } catch (error) {
    console.error('Serverless Contact Handler Error:', error);
    return res.status(500).json({ error: 'Failed to process contact submission.' });
  }
}
