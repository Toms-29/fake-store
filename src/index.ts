import app from "./app.js"
import { connectDB } from "./db/connectDB.js"

const PORT = 4000;
connectDB()

app.get('/', (_req, res) => {
    console.log('Hola desde la consola')
    res.send('Hello World');
});

app.listen(PORT || 4000, () => { console.log(`🌎 Server running on http://localhost:4000`); });