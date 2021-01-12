import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

const sendEmail = async (email: string, link: string) => {
  const mailOptions = {
    from: "QR Menu <yourgmailaccount@gmail.com>", // Something like: Jane Doe <janedoe@gmail.com>
    to: email,
    subject: "Restablece tu contraseña de QR Menu", // email subject
    html: `
    <p>Hola:</p>
    <p>Visita este vínculo para restablecer la contraseña de  QR Menu para tu cuenta de %EMAIL%.</p>
    <p><a href='${link}'>CLICK PARA RESTABLECER</a></p>
    <p>Si no solicitaste el restablecimiento de tu contraseña, puedes ignorar este correo electrónico.</p>
    <p>Gracias.</p>
    <p>El equipo de  QR Menu</p>
    `, // email content in HTML
  };

  // returning result
  await transporter.sendMail(mailOptions);
};

export const resetPasswordEmail = functions.https.onRequest(
  async (req: any, res: any) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, apiKey"
    );

    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      const email = req.body.email;
      if (!email) {
        const response = {
          message: "No se especificó el correo",
        };
        return res.status(404).json(response);
      }

      try {
        let linkUrl = await admin.auth().generatePasswordResetLink(email);
        await sendEmail(email, linkUrl);
        return res.status(200).json({ message: "Se envio el correo" });
      } catch (error) {
        const response = {
          message: "Error al eliminar el usuario",
        };

        return res.status(500).json(response);
      }
    }
  }
);
