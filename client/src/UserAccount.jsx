import { useContext, useState } from 'react';
import userIcon2 from './assets/images/user.svg'
import { Link } from 'react-router-dom';
import { AppContext } from './App';
import fetchApi from './utils/fetchApi';
import UserFetch from './utils/userFetch';
import { toast } from 'react-toastify';
const UserAccount=()=>{
    const {axios,getUser} =UserFetch()
    const [showDeletemsg,setShowDeletemsg]=useState(false);
    const {user,logout,setuser,isGoogleAuth,gauthLogout}=useContext(AppContext);
    console.log(user);
    function deleteAccount(){
        fetchApi('/deleteAccount','',()=>{
            setuser({})
            toast.success('Thankyou for using our application')
            isGoogleAuth? gauthLogout():''
            logout();    //navigate('/')
            //console.log('success account deleted succesfully');
        },()=>{
            toast.error('some issues occured');
            console.log('some issue deleting your account , please try again after some time');
            logout();    //navigate('/')
        })
    }

    return(
        <div className="userAccount  p-3 px-2 px-sm-4 d-flex flex-column gap-4" >
            <h2 className='text-light text-center'>Task Application</h2>
            <div className="userContain  p-3  my-1">
                <h3>Profile</h3>
                <div className="userInfo d-flex flex-column gap-5 justify-content-center mt-4 py-3 " style={{width:'100%'}}>
                    <div className="pimgDiv d-flex justify-content-center flex-column align-items-center">
                        <img src={user.profile? user.profile:  userIcon2} alt="" width='100px' height='100px' style={{
                            borderRadius:'50%', border:'0', backgroundColor:'white'
                        }} />
                    </div>
                    <div className="userDetails row" style={{ padding: '5%', fontSize: '18px' }}>
                        <div className="col pe-0" style={{maxWidth:'120px'}}>
                            <p className='userfield'>Firstname : </p>
                            <p className='userfield'>Lastname : </p>
                            <p className='userfield' >Email :</p>
                        </div>     
                        <div className="col ps-1">
                            <p> <b> {user.fname} </b> </p>
                            <p> <b> {user.lname===null ? '-----':user.lname} </b> </p>
                            <p> <b> {user.email} </b> </p>
                        </div>
                        <div className="btndiv w-100  d-flex flex-row gap-3 mt-2 align-items-center ">
                            <Link to='/tasks' className=" btn btn-outline-primary">Go Back</Link>
                            <button className=" btn btn-outline-danger" onClick={()=>setShowDeletemsg(true)}>Delete Account</button>
                        </div>
                    </div>
                </div>  
            {showDeletemsg ? (
                <div className='SignoutDiv d-flex flex-column justify-content-between ' style={{top:'15%'}} >
                    <h3 className="text-center m-0 mt-1  mb-3 text-danger"><b> Delete Account</b></h3>
                    <p className="text-center m-0  mb-4" style={{fontWeight:'bold'}}>Are you sure want to <b className='text-danger' style={{fontSize:'18px'}}>Delete your account</b> , all details including <b style={{fontSize:'18px'}}>all your task and personal details will be deleted forever?</b>  </p>
                    <div className="d-flex flex-row w-100 sbtndiv   gap-2">
                        <button className="accBtn btn btn-outline-dark " onClick={()=>setShowDeletemsg(false)} >Cancel </button>
                        <button className="accBtn btn " style={{color:'white',backgroundColor:'#e82626'}}  onClick={deleteAccount}> Delete Account </button>
                    </div>
                </div>
                ):''
            }
            </div>
        </div>
    )
}

export default UserAccount;
