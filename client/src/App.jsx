import { createContext, useEffect, useState } from 'react';
import {BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import TaskPage from './TaskPage';
import './assets/css/App.css';
import UserAccount from './UserAccount';
export const AppContext=createContext()
function App(){  
  const [user,setuser]=useState({});
  const [taskArr,setTaskArr]=useState([]); 
  const [disableInput,setDisableInput]=useState(false)
  const [isAuthenticated,setIsAuthenticated]=useState(
    ()=>sessionStorage.getItem('isAuthenticated')==='true'
  );
    //mainly used to retreive data from firebase in case of refresh
  const [isGoogleAuth,setIsGoogleAuth]=useState(
    ()=>sessionStorage.getItem('isGoogleAuth')==='true'
  );
  const login = () =>setIsAuthenticated(true);
  const logout =()=>setIsAuthenticated(false)

  const gauth = () =>setIsGoogleAuth(true);
  const gauthLogout =() =>setIsGoogleAuth(false)

  useEffect(()=>{
    if(isAuthenticated){
      sessionStorage.setItem('isAuthenticated','true')
    }else{
      sessionStorage.removeItem('isAuthenticated')
      setDisableInput(false)
    }
  },[isAuthenticated])

  useEffect(()=>{
    if(isGoogleAuth){
      sessionStorage.setItem('isGoogleAuth','true')
    }else{
      sessionStorage.removeItem('isGoogleAuth')
    }
  },[isGoogleAuth])
  if(disableInput){
      setTimeout(()=>{
        setDisableInput(false)
      },15000)
  }

  return(
      <div className='d-flex flex-column align-items-center justify-content-center   p-0 m-0 bg-primary ' 
      style={{ width: '100vw ', height: '100% ', minHeight:'100vh' }}>
        <AppContext.Provider value={{user,setuser,isAuthenticated,login,logout,isGoogleAuth,gauth,gauthLogout,taskArr,setTaskArr,disableInput,setDisableInput }}>
          <Router>
            <Routes>
              {(isAuthenticated)? 
                <>
                  <Route path='/tasks' element={<TaskPage/>} />
                  <Route path='/profile' element={<UserAccount/>} />                
                  <Route path='*' element={<Navigate to='/tasks' />} />
                </>:<>
                  <Route path='/' element={<LoginPage/>} />
                  <Route path='*' element={<Navigate to='/' />} />                  
                </>
              }
              </Routes>
          </Router>
        </AppContext.Provider>
        <ToastContainer closeOnClick={true}  position='top-center' />
      </div>
  )
}
export default App