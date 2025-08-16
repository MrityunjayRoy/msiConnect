import dotenv from "dotenv"
dotenv.config({
    path: ".env"
})

import { dbConnect } from "./src/db/dbConnect.js"
import { app } from "./app.js"

const PORT = process.env.PORT

dbConnect()
    .then(
        app.listen(PORT, () => {
            console.log('Server is running at port', PORT);
        })
    )
    .catch((error) => {
        console.log("Database is not connected");
    })