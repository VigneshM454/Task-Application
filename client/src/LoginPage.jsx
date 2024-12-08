import {useState,useRef,useContext, useEffect} from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppContext } from './App';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import signinIcon from './assets/images/signin.svg';
import envelop from './assets/images/envelope.svg';
import fetchApi from './utils/fetchApi';
import {toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
//import axios from 'axios';
//axios.defaults.withCredentials=true;
import SignInWithGoogle from './components/signInWithGoogle';
function LoginPage(){
    const navigate=useNavigate()    
    const [isNewUser,setIsNewUser]=useState(false)
   // const [signupDetail,setSignupDetail]=useState(isNewUser? initDetail : initDetail2)
    const {setuser,login,isAuthenticated,setTaskArr,disableInput,setDisableInput}=useContext(AppContext)
    const [signupDetail,setSignupDetail]=useState({});
    const [otpDiv,setOtpDiv]=useState(false)
    const otpValueRef=useRef(null)   
   // const [otp,setOtp]=useState(0);

    useEffect(()=>{
        console.log('useeffect executed 1');
        if(Object.keys(signupDetail).length>0){
            setDisableInput(true)
            if(isNewUser){
                fetchApi('/create-user',signupDetail,(data)=>{
                   // console.log(data);// console.log('success');
                    setOtpDiv(true)
                },(data)=>{
                   // console.log('failure ');// console.log(data.msg);
                    toast.error(data.msg,data.status);
                    setDisableInput(false)
                })
            }else{
                fetchApi('/login-user',signupDetail,(data)=>{
                   // console.log('success');
                    setuser(data.data)
                    setTaskArr(data.arr)
                    console.log(data);
                    login();
                    toast.success('Login success')
                    navigate('/tasks')
                    //console.log(isAuthenticated);
                },(data)=>{
                    setDisableInput(false)
                   // console.log('failure'+data.msg);
                   toast.error('Failure! , '+data.msg) 
                   //alert('Failure! ,'+data.msg);
                })      
            }
        }else{
           // console.log('useeffect executed 2');
        }
    },[signupDetail])
    
    const schema1=yup.object().shape({
        fname:yup.string().required('FirstName is required').min(5,'FirstName must be atleast 5 character'),
        lname:yup.string().required('LastName is required'),
        email:yup.string().email('Enter a valid email').required('Email is required'),
        passwd:yup.string().min(5,"Password's minimum length is 5 ")
            .max(15,"Password's max length is 15").required('Password is requied'),
        confirmpasswd:yup.string().oneOf([yup.ref('passwd'),null],'Password doesn\'t match').required()
    });
    const schema2=yup.object().shape({
        email:yup.string().email('Enter a valid email').required('Email is required'),
        passwd:yup.string().min(5,"Password's minimum length is 5 ")
            .max(15,"Password's max length is 15").required('Password is requied'),
    });

    const {register,handleSubmit,reset,formState:{errors}}=useForm({
        resolver:yupResolver(isNewUser?schema1:schema2)
      })
       
    function validateSignup(data){
        event.preventDefault()
        reset({ fname:'', lname:'', email:'', passwd:'', confirmpasswd:'' })
        setSignupDetail(data)       
       // console.log('form submitted'); 
       // console.log(data);
       // console.log(signupDetail);
    }
    function verifyOtp(){
        const userOtp=otpValueRef.current.value;
      //  console.log('type of useropt'+typeof userOtp);
        if(userOtp!='' && userOtp.length==6){
        //    console.log(' a is not empty',userOtp);
            otpValueRef.current.disabled=true;
            fetchApi('/verify-user',{userOtp:userOtp},(data)=>{
          //      console.log('success');
                setOtpDiv(false)
                setuser(data.data)
                setTaskArr(data.arr)
            //    console.log(data.msg);
                login();
                toast.success('Account created successfully !')
                navigate('/tasks')
                },(data)=>{
              //  console.log('failure');
              //  console.log(data.msg,data.code);
                setOtpDiv(false)
                toast.error('Account creation failed!')
            })
        }
        else{
            //console.log(userOtp.length);
            otpValueRef.current.value=null;    
            toast.error('Otp should be a 6 digit character')
        }
    }
    return(
        <div className='p-3  p-md-4 p-lg-5 pt-3'>
            <h2 className='p-3 mx-0 text-light text-center pt-0'>The Task Management app </h2>  
            <div className="login  w-100 p-3 pb-4" style={otpDiv? { opacity:0.8, }:{}}>
                <h3 className='m-0 my-3 '>  
                    <span className={isNewUser?'active ':'inactive'} onClick={()=>{setIsNewUser(true)}} >SignIn</span>  
                    /<span className={isNewUser?'inactive':'active'} onClick={()=>{setIsNewUser(false)}} >LogIn</span>   
                </h3>
                <form onSubmit={disableInput?()=>{}: handleSubmit(validateSignup)}>
                     {      //validateSignup
                        isNewUser? (<>
                            <label className='form-lablel' htmlFor="#fname">User Name:</label>
                            <input className='form-control' type="text" id='fname' name='fname' {...register('fname')}   placeholder='eg. John ' />
                            <p className="errors m-0">{errors.fname?.message}</p>
                            <label className='form-lablel' htmlFor="#lname">Last Name:</label>
                            <input className='form-control' type="text" id='lname' name='lname' {...register('lname')}     placeholder='eg.  Doe' />
                            <p className="errors m-0">{errors.lname?.message}</p>
                        </>):('')
                     }
                    <label className='form-lablel' htmlFor="#email">Email:</label>
                    <input className='form-control' type="email" name="email" id="email"  {...register('email')}     placeholder='eg. john454@gmail.com' />
                    <p className="errors m-0">{errors.email?.message}</p>
                    <label className='form-lablel' htmlFor="#passwd">Password:</label>
                    <input className='form-control' type="password" name="passwd" id="passwd" {...register('passwd')}        placeholder='eg. password123' />
                    <p className="errors m-0">{errors.passwd?.message}</p>
                    {isNewUser? (<>
                        <label className='form-lablel' htmlFor="#confirmpasswd">Confirm password:</label>
                        <input className='form-control' type="password" name="confirmpasswd" id="confirmpasswd" {...register('confirmpasswd')}   placeholder='eg. password123' />
                        <p className="errors m-0">{errors.confirmpasswd?.message}</p>
                        </>):('')
                    }
                    <button className='d-flex flex-row align-items-center justify-content-center  gap-3 btn  btn-dark mt-3' type="submit"  disabled={otpDiv||disableInput} >
                        {isNewUser?'SignUp ':'Login'}
                        <img src={signinIcon} height='20px' width='20px' alt="" />
                    </button>
                </form>
                <SignInWithGoogle/>
            </div>

            {otpDiv?
                (<div className="verificatnDiv p-4 d-flex flex-column align-items-center bg-light w-100 gap-3" style={{
                    position:'absolute', maxWidth:'280px', borderRadius:'13px', top:'10%', left:'5%'
                    }}>
                    <h3 className="m-0 d-flex flex-row gap-1 align-items-center">
                        <img src={envelop} height={'25px'} width='25px' alt="" />
                        Check your email</h3>
                    <p className="m-0 ">Please enter the 6 digit verification code that was send. The code is only valid for 2 minutes</p>
                    <div className="form-floating w-100">
                        <input type='number' name="otp" id="otp" className="form-control" ref={otpValueRef} required />
                        <label htmlFor="#otp"><b>Verification Code</b></label>
                    </div>
                    <button className="btn btn-outline-primary w-100" onClick={verifyOtp}>Verify code</button>
                </div>) :  ''
            }
        </div>
    )
}

export default LoginPage;
