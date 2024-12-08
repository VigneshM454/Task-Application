import { useContext } from "react";
import { AppContext } from "./App";
import { auth } from "./utils/firebase";
import fetchApi from "./utils/fetchApi";
import axios from "axios";
axios.defaults.withCredentials=true;
// eslint-disable-next-line react/prop-types

const SignOut=({setShowSignout})=>{

  const {gauthLogout,logout,isGoogleAuth,user,setuser}=useContext(AppContext);
    //const navigate=useNavigate();
    function signOutuser(){
      console.log('signOut btn clicked');
      setShowSignout(false);
      fetchApi('/signOut','',async(data)=>{
        console.log(data);
        console.log(user);
        setuser({})
        if(isGoogleAuth){
          console.log('Google sign otu');
          await handleGoogleLogout();
        }else{
          console.log('user logged out successfully'); 
          logout()  //navigate('/')  
         // await handleGoogleLogout();
        }
      },async(data)=>{
        console.log(data);
        console.log('some issues occured while navigating');
        logout() //navigate('/')
          await handleGoogleLogout();
      })
    }

    async function  handleGoogleLogout(){
      try{
        logout()
        await auth.signOut();
        console.log('user logged out successfully using google logout');
        gauthLogout();
      }catch(err){
        console.log('Error in logging out: ',err.message);
      }
    }

    return(
      <div className='SignoutDiv d-flex flex-column justify-content-between '>
        <h3 className="text-center m-0 mt-1  mb-3"><b> Signout</b></h3>
        <p className="text-center m-0  mb-4" style={{fontWeight:'bold'}}>Are you sure want to SignOut?</p>
        <div className="d-flex flex-row w-100 sbtndiv justify-content-between gap-2">
          <button className="w-50 btn btn-outline-dark" onClick={()=>setShowSignout(false)} >Cancel</button>
          <button className="w-50 btn " style={{color:'white',backgroundColor:'#e82626'}}  onClick={signOutuser}>Signout</button>
        </div>
      </div>
    )
  }
export default SignOut;