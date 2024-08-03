require('dotenv').config()
const express=require('express');
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser');
const SessionDemo=require('express-session')
const cors=require('cors');
const cron=require('node-cron')
const MongoStore=require('connect-mongo')
const mailDemo = require('./utils/mail');
const MongoSecret=process.env.MONGOPASS;
const uri=`mongodb+srv://admin:${MongoSecret}@cluster0.22xt2os.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

//const securePassword =require('./utils/securePassword');
//const databaseDemo=require('./database');
const {ObjectId,getDatabase}=require('./database')
//const {authUser,authCreateUser}=require('./authMiddleware')

const userRouter=require('./Routes/userRoutes')
const taskRouter=require('./Routes/taskRoutes')

const app=express();
app.use(cors(
    {
        origin:'http://localhost:5173',
        methods:['GET','POST'],
        credentials:true    
    }
))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(SessionDemo({
    secret:process.env.SESSIONSECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        maxAge:60000*60
    },
    store:MongoStore.create({
        mongoUrl:uri,
        dbName:'taskApplication',
        collectionName:'sessionDemo',
    })
}))
app.use('/',userRouter)
app.use('/',taskRouter)

async function checkExpiringTasks(){ 

    function  showDate(dt){
        function addZero(num){
            let str=String(num);
            let validstr=str.length===1? '0'+str :str
            return  validstr
        }
        let date =new Date(dt)
        return (addZero(date.getDate())+'-'+addZero(date.getMonth()+1)+'-'+date.getFullYear() +'   '+ addZero(date.getHours())+':' +addZero(date.getMinutes()));  
    }
    const database= await getDatabase();
    const taskCollection=database.collection('taskDetails');
    const userCollection=database.collection('userDetails')
    const now=new Date();
    const next24Hours=new Date(now.getTime() +24*60*60*1000);
    const taskData=await taskCollection.find({}).project({
        'tasks.description':0,'tasks.isImportant':0
    }).toArray()
    const filterTaskData=[] 
    const filterUser=[]
    taskData.forEach(async(Task) => {
        (Task.tasks).forEach(async(task) => {
            if (!task.isComplete && (task.deadline > now && task.deadline < next24Hours && (!task.notified))) {
               // console.log(task.title + ' is incomplete');
                filterTaskData.push({ userId: Task.userId, task:{...task,deadline:showDate(task.deadline)} });
                filterUser.push(Task.userId)
            } else {
               // console.log(task.title + '--- is complete');
            }
        });
    })

    const users=[]
    for(const userid of filterUser){
        var userdata=await userCollection.findOne({_id:userid})
        // console.log(userdata.fname);
        users.push(userdata)
    }
    // console.log(users);
    
    filterTaskData.forEach(async(Task,i)=>{
        try{
            // console.log('printing task');
            // console.log(Task);
            // console.log(users[i]);
            // console.log('printed users also');
            let mailInfo2=await mailDemo.sendNotification(Task,users[i])
            // console.log('mail info of task expiration is ');
            // console.log(mailInfo2);
            if(mailInfo2=='Success'){
                // console.log('mail  send for task expiration ');
                let a=await taskCollection.updateOne({userId:Task.userId,'tasks.id':Task.task.id},{
                    $set:{
                        'tasks.$.notified':true
                    }
                })
                // console.log(a);
            }else{
                // console.log('mail send for task expiry failed');
                throw new Error(mailInfo2)
            }
        }catch(err){
            // console.log('error occured');
            // console.log(err);
        }
    })  
}

cron.schedule('* * * * *',checkExpiringTasks)

app.listen(3000,()=>{
     console.log('the backend server is running on port 3000');
})
