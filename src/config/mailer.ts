import { createTransport } from "nodemailer"

import { ENV } from "./env.js";

export const transporter = createTransport({
    service: "gamil",
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_USER_PASSWORD
    }
})