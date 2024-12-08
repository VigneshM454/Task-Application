
export function isExpired(dt){
    let givendate=new Date(dt)
    //let currentdate=Date.now()
    if(givendate<Date.now()){
       // console.log('expired');
        return true;
    }else{
       // console.log('active');
        return false
    }
}

export function isWithinOneYear(dt){
    let givendate=new Date(dt);
    if(givendate  <  Date.now()+(1000*60*60*24*365 ) ){
       // console.log('the given date is within maximum limit');
        return true;
    }else{
       // console.log('the given date exceeds the maximum limit');
        return false
    }
}

//module.exports={isExpired,isWithinOneYear};
/*
const  UtilFns=
{
    isExpired:isExpired,
    isWithinOneYear:isWithinOneYear
}
export default UtilFns;
*/