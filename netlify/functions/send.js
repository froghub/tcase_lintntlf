import nodemailer from 'nodemailer';

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {statusCode: 405, body: JSON.stringify({error: "Method Not Allowed"})};
    }

    try {
        const {name, phone, email, message} = JSON.parse(event.body);


        if (!name || !phone || !email || !message) {
            return {statusCode: 400, body: JSON.stringify({error: "Все поля должны быть заполнены"})};
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


        const emailText = `Сообщение с визитки\n\n` +
            `Данные отправителя:\n` +
            `• Имя: ${name}\n` +
            `• Телефон: ${phone}\n` +
            `• Email: ${email}\n\n` +
            `Комментарий:\n${message}`;

        await transporter.sendMail({
            from: `"Сайт-Визитка" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            cc: email,
            subject: `Сообщение от ${name} (${phone})`,
            text: emailText,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({success: true})
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message})
        };
    }
};
