const express=require('express');
const {ObjectId,getDatabase}=require('../database')
const {authUser,authCreateUser}=require('../authMiddleware')
const router=express.Router()

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
    res.send({status:200,msg:'success'}) //send the response first next carry out data insertion    
    await taskCollection.updateOne({userId: new ObjectId(userId)},{
        $push:{ tasks: newTask }
    })
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
    res.send({msg:'Task updated successfully', status:200})
    const database2= await getDatabase();
    const taskCollection= database2.collection('taskDetails');
    await taskCollection.updateOne({
        userId:new ObjectId(userId),'tasks.id':id
    },{
        $set:{'tasks.$':{
            id, title,description,deadline:new Date(deadline),isComplete,isImportant,notified//:false
        } }
    });
})
router.post('/set-complete',authUser,async(req,res,next)=>{
    const {taskId}=req.body;
    const userId=req.session.user;
    if(userId==='' || taskId==='') return res.send({status:404,msg:'taskId is empty'});
    //if both taskId and userId present
    res.send({msg:'task marked completed successfully',status:200})

    const database4=await getDatabase()
    const taskCollection=database4.collection('taskDetails')
    await taskCollection.updateOne({userId:new ObjectId(userId),'tasks.id':taskId},{
        $set:{  'tasks.$.isComplete':true }
    });
})

router.post('/delete-tasks',authUser,async(req,res,next)=>{
    // console.log('entered delete-tasks');
    // console.log(req.body);
    // console.log(req.session.user);
    const {taskId}=req.body;
    const userId=req.session.user;
    if(userId==='' || taskId==='') return res.send({status:404,msg:'taskId is empty'})
    //if valid
    res.send({msg:'task deleted successfully',status:200})
    const database4=await getDatabase()
    const taskCollection=database4.collection('taskDetails')
    await taskCollection.updateOne({userId:new ObjectId(userId)},{
        $pull:{ tasks:{'id':taskId} }
    })
})

module.exports=router;
