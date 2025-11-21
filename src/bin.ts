import connectToDatabase from "./conn";
import { app } from "./index";

connectToDatabase().then(()=>{
    try {
        app.listen(3000, ()=>{
            console.log("Server is running on port 3000");
        })
    } catch (error) {
        console.log(error)
    }
}).catch((err)=>{
    console.log("Invalid connection")
});



