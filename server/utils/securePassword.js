const bcrypt =require('bcrypt');
const saltRounds=10;

const hashPassword=(password)=>{
    const salt=bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password,salt);
}

const comparePassword=(plain,hash)=>{
    let a= bcrypt.compareSync(plain,hash)
   // console.log(a);
    return a
}

module.exports={hashPassword,comparePassword}