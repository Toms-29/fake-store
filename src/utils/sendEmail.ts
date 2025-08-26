import { ENV } from "../config/env.js"
import { transporter } from "../config/mailer.js"

interface EmailOptions {
    to: string,
    subject: string,
    text?: string,
    html?: string
}

export const sendEmail = async (options: EmailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: `"Fake-store" <${ENV.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        })

        console.log("✅Email sent: ", info.messageId)
    } catch (error) {
        console.error("❌Error sneding email: ", error)
    }
}