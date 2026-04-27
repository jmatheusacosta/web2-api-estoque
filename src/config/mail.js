const nodemailer = require('nodemailer');

let transporter = null;

const initTransporter = async () => {
  if (!transporter) {
    const isGmailEnabled = process.env.SMTP_USER && !process.env.SMTP_USER.includes('seu-email');

    if (isGmailEnabled) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.warn("AVISO: Usando o Ethereal (Testes). Configure SMTP_USER e SMTP_PASS no .env para envios reais.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
    }
  }
  return transporter;
};

const sendEmail = async (to, subject, text) => {
  try {
    const t = await initTransporter();
    
    // Identificar se estamos no modo Ethereal
    const isGmailEnabled = process.env.SMTP_USER && !process.env.SMTP_USER.includes('seu-email');

    const info = await t.sendMail({
      from: `"API de Estoque" <${isGmailEnabled ? process.env.SMTP_USER : 'no-reply@estoque.com'}>`,
      to,
      subject,
      text,
    });

    if (!isGmailEnabled) {
      console.log(`[!] E-mail 2FA gerado (Ethereal)! Link: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`[!] E-mail 2FA real enviado com sucesso via Gmail para ${to}!`);
    }
    return info;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error;
  }
};

module.exports = { sendEmail };
