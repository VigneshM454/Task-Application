const base=import.meta.env.VITE_LOCAL_URL
const base2= import.meta.env.VITE_DEPLOY_URL;
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { auth } from '../utils/firebase';
import GoogleIcon from '../assets/images/googleImg2.jpeg';//googleImg.png
import { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
axios.defaults.withCredentials=true;

function SignInWithGoogle(){
    const {setuser,login,isAuthenticated,isGoogleAuth,gauth,gauthLogout,setTaskArr,disableInput,setDisableInput}=useContext(AppContext)
    const navigate=useNavigate()    

    function googleLogin(){
        const provider= new GoogleAuthProvider();
        setDisableInput(true)
        signInWithPopup(auth,provider).then(async(result)=>{
            if(result.user){
                toast.success('Successfully logged in with Google!')
                const displayname=result.user.displayName.split(' ')
                axios.post(`${base2}/handle-google-auth-user`,{fname:displayname[0],lname:displayname[1],email:result.user.email})
                .then(res=>res.data)
                .then((data)=>{
                    if(data.status===201){//new user created using googleAuth
                        // console.log(data);
                        setuser( { ...(data.data),profile:result.user.photoURL })
                        setTaskArr(data.arr)
                        login()
                        gauth()//setIsGoogleAuth(true)
                        navigate('/tasks')
                    }else if(data.status===202){//existing user logged in  using googleAuth 
                        // console.log(data);
                        setuser(    { ...data.data,profile:result.user.photoURL })
                        setTaskArr(data.arr)
                        login()
                        gauth()//setIsGoogleAuth(true)    
                        navigate('/tasks')
                    }else{//some server issues
                        // console.log(data.msg);
                        toast.error(data.msg)
                        setDisableInput(false)
                    }
                })
            }
        })    

        }

    return(
        <div className='d-flex flex-column align-items-center'>
            <p className='orWithGoogle my-3'>--Or continue with--</p>
            <div  onClick={disableInput?()=>{}:googleLogin}  style={{cursor:'pointer'}} >
                <img src={GoogleIcon} style={{    height: '40px', width: '100%',border:'1px solid black',borderRadius:'5px'}} />
            </div>
        </div>
    )
}
export default SignInWithGoogle;