const authUser=(req,res,next)=>{
    // console.log('entered authUser');
    // console.log(req.session);
    if(!req.session.user) return res.send({status:404,msg:'User not authenticated'})
    //if session exist
    // console.log('session exist in session store');
    // console.log(req.session.user);
    next()
}

const authCreateUser=(req,res,next)=>{
    // console.log('entered authcreate user');
    if(! req.session || !req.session.userData || !req.session.otp) 
        return res.send({status:404,msg:'user session has expired or invalid'})
    // console.log('user has both userData and otp');
    // console.log(req.session.userData);
    // console.log(req.session.otp);
    next();
}

module.exports={authUser,authCreateUser}