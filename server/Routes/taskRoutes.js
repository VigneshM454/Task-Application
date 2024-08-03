const express=require('express');
const {ObjectId,getDatabase}=require('../database')
const {authUser,authCreateUser}=require('../authMiddleware')
const router=express.Router()

router.get('/show-tasks',authUser,async(req,res,next)=>{
    const userId=req.session.user;
    const database1=await getDatabase()
    const taskCollection=database1.collection('taskDetails')
    const taskCursor=await taskCollection.findOne({userId: new ObjectId(userId)});
    const taskArray=taskCursor.tasks;//some problem is here 
    // console.log('taskArr is '),
    // console.log(req.session.id);
    // // console.log(taskArray);
    (taskArray && taskArray.length>0) ? 
        res.send({arr:taskArray.reverse(),status:200,msg:'success'}) 
        :res.send({status:300,msg:'No tasks so far'})    
})

router.post('/add-tasks',authUser,async(req,res,next)=>{
    const {id,title,description,deadline,isComplete,isImportant}=req.body;
    const userId=req.session.user;
    // console.log(userId);
    // console.log(req.body);
    if(id==='' || title==='' || description==='' || deadline===''|| userId==='')
        return res.send({status:400,msg:'some of the fields are missing'})
    //if taskData is present
    const databse2=await getDatabase();
    const taskCollection=databse2.collection('taskDetails')
    const newTask={ id,title,description,deadline:new Date(deadline),isComplete,isImportant,notified:false }
    // console.log(newTask);
    
    await taskCollection.updateOne({userId: new ObjectId(userId)},{
        $push:{ tasks: newTask }
    })
    const taskCursor=await taskCollection.findOne({userId: new ObjectId(userId)})
    const taskArr=taskCursor.tasks
    // console.log(taskArr);
    return res.send({arr:taskArr.reverse(),status:200,msg:'success'}) 
})

router.post('/edit-tasks',authUser,async(req,res,next)=>{
    const userId=req.session.user
    const{id,title,description,deadline,isComplete,isImportant,notified}=req.body;
    var errs=''
    // console.log(req.params);
    // console.log(req.body);
    if(id==='' || title==='' || description==='' || deadline==='' || userId==='')
        return res.send({status:400,msg:'some of the fields are missing'});
    //if data is valid
    const database2= await getDatabase();
    const taskCollection= database2.collection('taskDetails');
    await taskCollection.updateOne({
        userId:new ObjectId(userId),'tasks.id':id
    },{
        $set:{'tasks.$':{
            id, title,description,deadline:new Date(deadline),isComplete,isImportant,notified//:false
        } }
    });
    const taskCursor=await taskCollection.findOne({userId:new ObjectId(userId)});
    const updatedArr=taskCursor.tasks;
    // console.log(updatedArr);
    //// console.log('errs is ',errs);
    //errs===''? 
    return res.send({arr:updatedArr.reverse(),msg:'Task updated successfully', status:200})
    //: res.send({msg:errs,status:500})
})
router.post('/set-complete',authUser,async(req,res,next)=>{
    const {taskId}=req.body;
    const userId=req.session.user;
    if(userId==='' || taskId==='') return res.send({status:404,msg:'taskId is empty'});
    //if both taskId and userId present
    const database4=await getDatabase()
    const taskCollection=database4.collection('taskDetails')
    await taskCollection.updateOne({userId:new ObjectId(userId),'tasks.id':taskId},{
        $set:{  'tasks.$.isComplete':true }
    });

    const taskCursor= await taskCollection.findOne({userId:new ObjectId(userId)})
    const taskArr=taskCursor.tasks
    res.send({arr:taskArr.reverse(),msg:'task marked completed successfully',status:200})
})

router.post('/delete-tasks',authUser,async(req,res,next)=>{
    // console.log('entered delete-tasks');
    // console.log(req.body);
    // console.log(req.session.user);
    const {taskId}=req.body;
    const userId=req.session.user;
    if(userId==='' || taskId==='') return res.send({status:404,msg:'taskId is empty'})
    //if valid
    const database4=await getDatabase()
    const taskCollection=database4.collection('taskDetails')
    await taskCollection.updateOne({userId:new ObjectId(userId)},{
        $pull:{ tasks:{'id':taskId} }
    })
    const taskCursor= await taskCollection.findOne({userId:new ObjectId(userId)})
    const taskArr=taskCursor.tasks
    res.send({arr:taskArr.reverse(),msg:'task deleted successfully',status:200})
})

module.exports=router;
