import dotenv from "dotenv"
import { app } from "../App.js";
import { connectDB } from "./db/index.js";

const result = dotenv.config();

console.log(result);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

connectDB().
then(()=>{
 app.listen(process.env.PORT || 5000)
 console.log(`Server is running on PORT ${process.env.PORT}`)
})

.catch((error)=>{
console.log("Server Connection failed..", error)
})




