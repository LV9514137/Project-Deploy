import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("Database Connected Sucessfully..");

    } catch (error) {
        console.log("Database Connection Failed..")
    }
}