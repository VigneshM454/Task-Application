require('dotenv').config();
const nodemailer=require('nodemailer');

const passwordsecret=process.env.EMAILSECRET
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'vtaskapp@gmail.com',
        pass: passwordsecret
    }
})


async function sendMail (data){
    //let mailmsg=''
    const mailOptions={
        from:'vtaskapp@gmail.com',
        to:data.to,
        subject:'OTP for account creation on  Task Application',
        //text:'this is demo text',
        html:
        `            
            <div style={{
                display:'flex',flexDirection:'column',gap:'10px',padding:'5px'
                }}>
                <h3>Hello ${data.name},</h3>
                <p>Please enter below OTP to <span style="color:yellow;">verify</span> your email ID with the task Management Application. It's valid for the next 2 minutes. </p>
                <h2 style="color:red;"><b>${data.otp}</b></h2>
                <p>Note: If you did not make this requirest,please ignore this email</p>
                <p style={{textAlign:'left',marginBottom:'0'}}>Thank you,</p>
                <p style={{textAlign:'left'}}>V Task</p>
            </div>
        `
    }
    try{
        const info = await transporter.sendMail(mailOptions)
       // console.log('email send ');
       // console.log(info.response);
        return 'Success'
    }catch(err){
        //console.log(err);
        return err
    }
    
}

async function sendNotification(taskData,userData){

    const mailOptions={
        from:'vtaskapp@gmail.com',
        to:userData.email,
        subject:'Task Expiry Reminder',
        //text:'this is demo text',
        html:
        `            
            <div style={{
                display:'flex',flexDirection:'column',gap:'10px',padding:'5px'
                }}>
                <h3>Hello ${userData.fname},</h3>
                <p>Your task <span style="font-size: 20px; font-weight: bold;">${taskData.task.title}</span> is about to expire within one day, if you completed it  update in dashboard, else it would be expired after deadline, </p>
                <h2><b style="color:red">${taskData.task.deadline}</b></h2>
                <p style="text-align:left;margin-bottom:0;">Thank you,</p>
                <p style="text-align:left;">V Task</p>
            </div>

        `
    }
    try{
        const info2=await transporter.sendMail(mailOptions)
        console.log('email notification send');
        console.log(info2.response);
        return 'Success';
    }catch(err){
        console.log(err);
        return err;
    }
}

module.exports={sendMail,sendNotification}
