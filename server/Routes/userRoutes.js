const express=require('express');
const {hashPassword,comparePassword} =require('../utils/securePassword');
const mailDemo = require('../utils/mail');
const {ObjectId,getDatabase}=require('../database')
const {authUser,authCreateUser}=require('../authMiddleware')
const router=express.Router();

function generateOtp(){
    var otp= Math.floor(100000+Math.random()*900000).toString();
    //console.log(otp);
    return otp;
 }

router.get('/get-userData',authUser,async(req,res,next)=>{
   // console.log('inside get-userData');
   // console.log(req.session.user);
    const id=req.session.user;
    const database=await getDatabase()
    const userCollection=database.collection('userDetails');
    const userData=await userCollection.findOne({_id:new ObjectId(id)})
    const userData2={fname:userData.fname,lname:userData.lname,email:userData.email}
   // console.log(userData2);
    if(userData===null) return res.send({status:404,msg:'No such user present'});
    return res.send({status:200,msg:'success',userData:userData2 })    
})

router.post('/login-user',async(req,res,next)=>{
   // console.log(req.body);
    const {email,passwd}=req.body
    if(!email || !passwd) return res.send({status:500,msg:'Empty data received'});
    const database3=await getDatabase();
    const userCollection=database3.collection('userDetails');
    const data=await userCollection.findOne({email})
    //console.log('data is');
    //console.log(data);
    if(data===null) return res.send({status:404,msg:'No such user exist'})
    if(!comparePassword(passwd,data.password)) 
        return res.send({status:400,msg:'Incorrect password, you may continue with google if you forgot your password'});
    //const userId=data._id
    req.session.user=data._id;
    // console.log('the session data is ');
    // console.log(req.session.user);
    // console.log(req.session.id);
    return res.send({status:200, msg:'Success', data:{ // id:data._id, 
        fname:data.fname, lname:data.lname, email:data.email
    }
    })
})

router.post('/create-user',async(req,res,next)=>{
    // console.log('from create-user');
    // console.log(req.body);
    const {fname,lname,email,passwd,confirmpasswd}=req.body;
    let passwd2=hashPassword(passwd);
    // console.log('password after hashing');
    // console.log(passwd2);
    if(fname==='' || lname==='' || email==='' || passwd==='') 
        return res.send({status:404,msg:'Some of the fields are missing'})
    const database2=await getDatabase();
    const userCollection=database2.collection('userDetails')
    const cursor= await userCollection.findOne({email:email })
    // console.log('cursor is ');
    // console.log(cursor);
    // console.log(cursor==null?'cursor is null':'cursor is not null');
    if(cursor!==null) 
        return res.send({status:404, msg:'A account with similar email already exist, try login instead'})
    const otpplain=generateOtp();
    const otphash=hashPassword(otpplain)
    let mailInfo=await mailDemo.sendMail({to:email,otp:otpplain,name:fname})
    // console.log('mail info is ');
    // console.log(mailInfo);
    // console.log(otphash);
    if(mailInfo=='Success'){
        // console.log('mail send ');
        req.session.userData={fname,lname,email,passwd:passwd2,confirmpasswd}
        req.session.otp=otphash;
        // console.log(req.session);
        return res.send({status:200,msg:'Otp for valid user generated'})    
    }else{
        // console.log('mail send failed');
        return res.send({status:403,msg:mailInfo})
    }    
})

router.post('/verify-user',authCreateUser,async(req,res,next)=>{
    // console.log('the req entered verify-user');
    const {fname,lname,email,passwd,confirmpasswd}=req.session.userData;
    const secureOtp=req.session.otp;
    // console.log(req.body);
    const {userOtp}=req.body;
    // console.log(userOtp); //checkiing whether otp send, and otp received from user are same
    if(!comparePassword(userOtp,secureOtp))
        return res.send({status:400,msg:'Incorrect otp'})
    // console.log('password matches with hash generated');
    const database2=await getDatabase();
    const userCollection=database2.collection('userDetails')
    const taskCollection=database2.collection('taskDetails')
    
    const insertedInfo=await userCollection.insertOne({
        fname:fname,  lname:lname,  email:email,  password:passwd,
    });
    if(!insertedInfo.acknowledged) 
        return res.send({status:404,msg:'failed entering data in task db'})
    // console.log('user created succcess');
    var userdata= await userCollection.findOne({email:email})//.toArray()[0]
    delete req.session.otp;
    delete req.session.userData;
    req.session.user=userdata._id
    const userId=userdata._id
    const insertInfo2=await taskCollection.insertOne({userId:new ObjectId(userId),tasks:[]})
    // console.log('user entry in  task table created success');
    if(!insertInfo2.acknowledged)
        return res.send({status:404,msg:'failed entering data in task db'});
    return res.send({status:200, msg:'Success', data:{
        // id:userdata._id,
        fname:userdata.fname, lname:userdata.lname, email:userdata.email
    }})
})

router.post('/handle-google-auth-user',async(req,res,next)=>{
    const {fname,lname,email}=req.body;
    const database4= await getDatabase();
    const userCollection=database4.collection('userDetails');
    const taskCollection=database4.collection('taskDetails');
    const data=await userCollection.findOne({email});
    //if data null, new user via google auth, so enter into db
    if(data===null){
        const userInfo=await userCollection.insertOne({fname,lname,email,password:''})
        if(!userInfo.acknowledged)
            return res.send({status:400,msg:'some problem in server'})
        // console.log('user created success by google auth');
        var userdata= await userCollection.findOne({email:email})//.toArray()[0]
        req.session.user=userdata._id;  
        const insertInfo2=await taskCollection.insertOne({userId:new ObjectId(userdata._id),tasks:[]})
        // console.log('user entry in  task table created success by google auth');
        if(insertInfo2.acknowledged){
            return res.send({status:201, msg:'Success', data:{ //id:userdata._id,
                fname:userdata.fname, lname:userdata.lname, email:userdata.email
            }})
        }        
    }else{// data is calculated above if else 
        // console.log('user is already present, want to login using google auth');
        req.session.user=data._id;
        // console.log('user entry in  task table created success by google auth');
        return res.send({status:202, msg:'Success', data:{//id:data._id, 
            fname:data.fname,  lname:data.lname,  email:data.email
        } })
    }             
})

router.post('/signOut',(req,res,next)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                // console.log('there is some errors in logout'+err);
                return res.send({status:404,msg:'logout failure'})
            }else{
                res.clearCookie('connect.sid')
                // console.log('user logged out successfully');
                return res.send({status:200,msg:'logout success'});
            }
        })    
    }catch(err){
        // console.log(err);
        return res.send({status:404,msg:err.message.msg})
    }
})

router.post('/deleteAccount',authUser,async(req,res,next)=>{
    try{
        const userId=req.session.user; 
        await new Promise((resolve,reject)=>{
            req.session.destroy((err)=>{
                if(err){
                    // console.log('some error occured in deleting session,'+err);
                    //return res.send({status:404,msg:err.message})    
                    return reject(err);//it throws error if any exist
                }
                resolve();
            })
        })
        const database4= await getDatabase();
        const userCollection=database4.collection('userDetails')
        const taskCollection=database4.collection('taskDetails')
        await taskCollection.findOneAndDelete({userId:new ObjectId(userId)});
        await userCollection.findOneAndDelete({_id:new ObjectId(userId)});

        return res.send({status:200,msg:'Account deleted successfully !'})    
    }catch(err){
        // console.log('Error occured in tasks :'+err);
        return res.send({status:404,msg:err.message})
    }
})

module.exports=router;//245