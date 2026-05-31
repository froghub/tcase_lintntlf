import nodemailer from 'nodemailer';

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {statusCode: 405, body: JSON.stringify({error: "Method Not Allowed"})};
    }

    try {
        const {name, phone, email, message} = JSON.parse(event.body);
        const cleanName = name?.trim();
        const cleanPhone = phone?.trim();
        const cleanEmail = email?.trim();
        const cleanMessage = message?.trim();


        if (!cleanName || !cleanPhone || !cleanEmail || !cleanMessage) {
            return {statusCode: 400, body: JSON.stringify({error: "Все поля должны быть заполнены"})};
        }
        if (cleanName.length > 50 || cleanMessage.length > 2000) {
            return { statusCode: 400, body: JSON.stringify({ error: "Превышена допустимая длина полей" }) };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return { statusCode: 400, body: JSON.stringify({ error: "Некорректный формат Email" }) };
        }
        if (cleanPhone.length < 18) {
            return { statusCode: 400, body: JSON.stringify({ error: "Номер телефона заполнен не полностью" }) };
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
            `• Имя: ${cleanName}\n` +
            `• Телефон: ${cleanPhone}\n` +
            `• Email: ${cleanEmail}\n\n` +
            `Комментарий:\n${cleanMessage}`;

        await transporter.sendMail({
            from: `"Сайт-Визитка" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            cc: cleanEmail,
            subject: `Сообщение от ${cleanName} (${cleanPhone})`,
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
