import { sendEmail } from "../utils/sendEmail.js"
import EventEmitter from "events"

export const orderEvent = new EventEmitter()

orderEvent.on("buy-confirmed", async (session) => {
    const productList = session.line_items.data.map((item: any) => {
        return `<li>${item.price.name} x ${item.quantity} ${item.price.unit_amount}</li>`
    })

    await sendEmail({
        to: session.email,
        subject: "Purchase confirmed",
        html: `<h1>Order Confirmed</h1>
        <p>Thank you for shopping whit us!</p>
        <br />
        <h2>Products:</h2>
        <ul>
        ${productList}
        </ul>
        <br />
        <h2>Total: ${session.amount_total / 100}</h2>
        `
    })
})