const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: "masemoyv1@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Servidor de correo listo");
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    let mailOptions = {
        from: "masemoyv1@gmail.com",
        to: email,
        subject: `Confirmación de recepción: ${subject}`,
        text: `Hola ${name},\n\nHemos recibido tu siguiente mensaje:\n"${message}"\n\nNos pondremos en contacto contigo pronto.`
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.status(500).send("Error al enviar");
        } else {
            res.status(200).send("Éxito");
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});