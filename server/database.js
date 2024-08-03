const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
const ObjectId=mongodb.ObjectId;

const MongoSecret=process.env.MONGOPASS;
const uri=`mongodb+srv://admin:${MongoSecret}@cluster0.22xt2os.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//mongodb+srv://admin:<password>@cluster0.22xt2os.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const getDatabase= async()=>{
    const client= await MongoClient.connect('mongodb://127.0.0.1:27017')
    let database=await client.db('taskApplication')
    if(!database){
        console.log('Mongodb database not connected');
    }
    return database;
}

module.exports={ObjectId,getDatabase}