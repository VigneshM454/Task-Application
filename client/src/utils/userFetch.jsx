const base=import.meta.env.VITE_LOCAL_URL
const base2= import.meta.env.VITE_DEPLOY_URL;
import {useContext, useEffect} from 'react'
import axios from 'axios'
axios.defaults.withCredentials=true;
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';

export default function UserFetch() {
  const navigate=useNavigate()    
  const {isAuthenticated,isGoogleAuth,login,logout,user,setuser,gauth,gauthLogout,setTaskArr,taskArr}=useContext(AppContext);
    //get-userData   
    function getUser(){
      console.log('from get-userData');
        if( (Object.keys(user).length===0 || taskArr.length===0) && isAuthenticated ){
          axios.get(`${base2}/get-userData`)
          .then(res=>res.data)
          .then(async data=>{            
              console.log(data);
              if(data.status===200){
                  //console.log(data.msg);
                  setuser(data.userData);
                  setTaskArr(data.arr)
                  login();
              }else{
                toast.error('Session expired')
                console.log(user);
                logout()
                gauthLogout()
                await auth.signOut()
                navigate('/')
                 // console.log(data.status,data.msg);
              }
          }).catch((err)=>{
              console.log('some error occured in getting user data');
              console.log(err);
          })
        }else{
          //  console.log('both the user and task exist no need to fetch data');
        }
    } 
    
    function getFirebaseProfile(){
      onAuthStateChanged(auth, (user) => {
        //console.log('user data is '+user);
        if (user && user!==null && user.profile===undefined) {
            setuser((prev)=> ({...prev,profile:user.photoURL}) )
          gauth()
        }else {
          setuser(null);
          gauthLogout()
        }
      });
    }

    useEffect(()=>{
      getUser();
    },[])


    useEffect(()=>{
      isGoogleAuth && user.profile===undefined  ?
      ( '' , getFirebaseProfile() ) :'';

    },[user])

    return {getUser,axios}
}
