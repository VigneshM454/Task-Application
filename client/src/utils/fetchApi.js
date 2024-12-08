const base=import.meta.env.VITE_LOCAL_URL
const base2= import.meta.env.VITE_DEPLOY_URL;
import axios from "axios";
axios.defaults.withCredentials=true;

export default function fetchApi(url,data,successFn,failureFn) {
    
    axios.post(base2+url,data)
    .then(res=>res.data)
    .then(data=>{
        if(data.status===200){
            successFn(data)
        }else{
            failureFn(data)
        }
    }).catch((err)=>{
        console.log(err);
        console.log('some error occured');
    })
  
    return 0;
}
