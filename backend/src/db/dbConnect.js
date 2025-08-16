import mongoose from "mongoose"

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to database succesfully");
    } catch (error) {
        console.log("Error connecting to database");
    }
}

export {dbConnect}