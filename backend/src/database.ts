import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URL || "mongodb+srv://prashantpanchal058_db_user:pWKSsslkwtew2XVL@cluster0.vzkusa2.mongodb.net/?appName=Cluster0/studymate";

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI)
    .then(()=>console.log("database is connected."));
}

export default connectToMongo;