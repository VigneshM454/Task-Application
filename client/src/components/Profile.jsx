/* eslint-disable react/prop-types */
import { useContext } from 'react';
import userIcon from '../assets/images/user.svg'
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
const Profile=({setShowProfile,setShowSignout})=>{
    const {user}=useContext(AppContext);
   
    function handleSignout2(){
        setShowProfile(false)
        setShowSignout(true)
    }
    return(
        <div className="ProfileCard">
            <div className=" d-flex flex-row align-items-center justify-content-between ">
                <h5 className="m-0 ">Profile</h5> 
                <button className="btn-close" onClick={()=>setShowProfile(false)} ></button> 
            </div>
            <hr />
            <div className=" p-2 d-flex flex-column align-items-center gap-2">
                <img src={user.profile? user.profile:  userIcon} alt="" style={{
                    height:'50px', width:'50px',
                    borderRadius:'50%', border:'1px solid white',
                    padding:'1px', backgroundColor:'white'
                }} />
                <div className="d-flex flex-row gap-2 mt-2 profileNames">
                    <p className='m-0'> <b>{user.fname}</b>  </p>
                    <p className='m-0'> <b>{user.lname}</b>  </p>
                </div>
                <p className='profileEmail'>{user.email}</p>
                <div className="btndiv w-100 d-flex flex-column gap-3">
                    <Link to='/profile' className="btn btn-primary">Manage Account</Link>
                    <button className="btn btn-danger" onClick={handleSignout2}>SignOut</button>
                </div>
            </div>
        </div>
    )
};

export default Profile;