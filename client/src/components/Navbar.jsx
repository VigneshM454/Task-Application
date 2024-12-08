// src/Navbar.js
import  { useState,useEffect, useContext } from 'react';
import signoutIcon from '../assets/images/signout.svg'
import userIcon from '../assets/images/user.svg'
import allIcon from '../assets/images/home.svg';
import expiredIcon from '../assets/images/hourglass-end.svg';
import todoIcon3 from '../assets/images/todo3.png' 
import completeIcon from '../assets/images/check.svg';
import importantIcon from '../assets/images/star.png'
import { AppContext } from '../App';
// eslint-disable-next-line react/prop-types
const NavBar = ({setDisplayTask,setIsOpen,taskCategory,setTaskCategory,setShowProfile,setShowSignout,widthvar,isOpen}) => {
  const {user,isGoogleAuth,taskArr}=useContext(AppContext);

  const Categories=['All','DoItNow','Important','Completed','Expired']
  const Images=[allIcon,todoIcon3,importantIcon,completeIcon,expiredIcon]
  const categoryNames =['All Tasks','Do It Now','Important','Completed','Expired']
  useEffect(()=>{
      switch (taskCategory) {
        case 'DoItNow':          // eslint-disable-next-line react/prop-types
          setDisplayTask(taskArr.filter(task=>task.isComplete===false && new Date(task.deadline)> Date.now() ))
          break;
        case 'Important':       // eslint-disable-next-line react/prop-types
          setDisplayTask(taskArr.filter(task=>task.isImportant===true))
          break;
        case 'Completed':       // eslint-disable-next-line react/prop-types
          setDisplayTask(taskArr.filter(task=>task.isComplete===true))
          break;
        case 'Expired':   // eslint-disable-next-line react/prop-types
          setDisplayTask(taskArr.filter(task=> (new Date(task.deadline)< Date.now() && task.isComplete===false)   ))
          break;
        default:
          setDisplayTask(taskArr)
          break;
      }
      
    },[setDisplayTask, taskArr, taskCategory])
  
  function handleTaskCategory(val){
    setTaskCategory(val);
    setTimeout(()=>{
      setIsOpen(false)
     },50)
  }
  
  return (
    <div  className="navcontent  flex-column align-items-center justify-content-around col-lg-2 col-md-3 col-3" style={
      (widthvar>550 || isOpen)?{ display:'flex'}:{ display:'none' } }>
      <div className="row pointer" onClick={()=>{ setShowProfile(true),setShowSignout(false)  }}>
        <img src={isGoogleAuth? user.profile:  userIcon} style={{
          height:'50px',  width:'50px',  padding:'2px',
          borderRadius:'50%',  border:'1px solid white', backgroundColor:'white'
        }} alt="" />
        <div className="col">
          <h4 className="m-0">{user.fname}</h4>
          <h4 className="m-0">{user.lname}</h4>
        </div>
      </div>
      <div className="w-100">
        {
          Categories.map((elem,i)=>{
            return (
              <div key={i} className={(taskCategory== elem? " bg-light fbold" : "") +" pointer d-flex flex-row align-items-center p-2 ps-4 justify-content-start  gap-3  mt-1"} onClick={()=> handleTaskCategory(elem) }>
                  <img src={Images[i]} height={20} width={20} alt="" />
                  <p className='m-0'>{categoryNames[i]}</p>
              </div>
            )
          })
        }
      </div>
      <div className="pointer w-100 d-flex flex-row align-items-center p-2 ps-4 justify-content-start  gap-3  mt-1" onClick={()=>{ setShowSignout(true),setShowProfile(false) }} >
        <img src={signoutIcon} height={25} alt="" />
        <h6 className="m-0">Sign Out</h6>
      </div>
    </div>
  );
};

export default NavBar;