import app from "./app";
import dotenv from 'dotenv';
dotenv.config();

app.listen(3030, () => {
    console.log("server on 🚀");
})