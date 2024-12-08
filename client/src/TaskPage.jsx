// eslint-disable-next-line no-unused-vars
import React,{useState,useEffect,useRef,useContext} from 'react';
import { toast } from 'react-toastify';
import { AppContext } from './App';
import { v4 as uuid4 } from 'uuid';
import addIcon from './assets/images/add.svg';
import Task from './components/Task';
import TaskForm from './TaskForm';
import NavBar from './components/Navbar';
import SignOut from './SignOut';
import burgerMenuIcon from './assets/images/burgermenu.svg'
import Profile from './components/Profile';
import { isExpired,isWithinOneYear } from './utils/utils1';
import fetchApi from './utils/fetchApi';
import UserFetch from './utils/userFetch';

function TaskPage(){
    const {axios,getUser}=UserFetch();
    const {user,logout,gauthLogout,taskArr,setTaskArr}=useContext(AppContext)
    const [widthvar,setWidth]=useState(window.innerWidth);
    const [displayTask,setDisplayTask]=useState([]);
    const [createOrEdit,setCreateOrEdit]=useState(0); //1 -> create, 2 ->edit, 0 -> none
    const [taskCategory,setTaskCategory]=useState('All');//All, Important,Completed,DoItNow
    let compRef=useRef(null);
    let impoRef=useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showSignout,setShowSignout]=useState(false);
    const [showProfile, setShowProfile]=useState(false);

    const initTask={    
      id:0, title:'',
      description:'', deadline:'',
      isComplete:false, isImportant:false,
    };
    const [newTask,setNewTask]=useState(initTask); 

    const toggleNavbar = () => {
      console.log('isopen'+ isOpen);
      setIsOpen(!isOpen);
    };    

    function ifNotAuthentic(status,msg){
      console.log('log user is not authentic');
      console.log(msg,status);
      toast.error(msg,status);
      logout()  //navigate('/')
      gauthLogout()
    }

    useEffect(()=>{
      setCreateOrEdit(0)
      setIsOpen(false)
    },[showSignout,showProfile])
  
    function handleCreateTask(event){
      event.preventDefault();      
      console.log(newTask.deadline)
      let timeString=new Date(newTask.deadline)
      newTask.deadline=timeString.toISOString()
      console.log(newTask.deadline)
      if(!isExpired(newTask.deadline) && isWithinOneYear(newTask.deadline)){//if task not expired
        if( createOrEdit!==2){//creating new task
          newTask.id=uuid4()
          fetchApi('/add-tasks',newTask,(data)=>{
            console.log(newTask)
            setTaskArr([newTask,...taskArr])
            //setTaskArr(data.arr);
            toast.success('Task added successfully')
          },(data)=>{
            ifNotAuthentic(data.status,data.msg)
          });
          impoRef.current.checked=false;
        }else{
          fetchApi('/edit-tasks',newTask,(data)=>{
            toast.success('Task edited successfully')
            setTaskArr(prev=>prev.map(task=>task.id===newTask.id?newTask:task))
            //setTaskArr(data.arr);
          },(data)=>{
            ifNotAuthentic(data.status,data.msg)
          })
        }
        setCreateOrEdit(0)
        setNewTask(initTask);
      }else{//if task expired
        //compRef.current.checked=false;
        isExpired(newTask.deadline) ?  toast.warning('The deadline should be in future') : toast.warning('the deadline should not exceed 1 year')        
      }
    }

    function setComplete(id,deadline){
      let expired =isExpired(deadline)
      if(!expired){
        fetchApi('/set-complete',{taskId:id},(data)=>{
          setTaskArr(prev=>prev.map((task)=>{
            if(task.id===id){
              task.isComplete=true;
            }return task;
          }))
          //setTaskArr(data.arr)
          toast.success('Task marked as complete')
        },(data)=>{
          ifNotAuthentic(data.status,data.msg)
        })
      }else{
        toast.error('Cant set this task as complete as deadline is over, only you can edit/delete it')
      }      
    }
    function deleteTask(id){
      fetchApi('/delete-tasks',{taskId:id},(data)=>{
        setTaskArr(prev=>prev.filter(task=>task.id!==id))
        toast.success('Task deleted Successfully!')
      },(data)=>{
        ifNotAuthentic(data.status,data.msg)
      })
    }
    function editTask(id){
      let tempTask=taskArr.filter((task)=>task.id===id)
      setNewTask(tempTask[0])
      setCreateOrEdit(2)
    }

    useEffect(()=>{
      const handleResize=()=>{
        setWidth(window.innerWidth)
      };
      window.addEventListener('resize',handleResize);

      return()=>{
        window.removeEventListener('resize',handleResize)
      }
    },[])

    return(
      <div className='totalcontent d-flex flex-row  px-lg-2 gap-1' style={{minHeight:'95vh'}}  >  
       
        <NavBar    setDisplayTask={setDisplayTask} setIsOpen={setIsOpen}
            taskCategory={taskCategory} setTaskCategory={setTaskCategory}
            setShowSignout={setShowSignout} setShowProfile={setShowProfile} 
            widthvar={widthvar} isOpen={isOpen}
        /> 
        
        <div className="maindiv border"  onClick={isOpen?  toggleNavbar :()=>{} }>
            {
              (showSignout && (!showProfile) && !(createOrEdit===1 || createOrEdit===2 )  ) ?  <SignOut setShowSignout={setShowSignout} /> :''
            }
           
            {
              (showProfile && (!showSignout) && !(createOrEdit===1 || createOrEdit===2 )  ) ? <Profile setShowProfile={setShowProfile} setShowSignout={setShowSignout} />: '' 
            }
          <h2 className="text-center m-0 py-3 px-1 px-md-3 px-lg-3 d-flex flex-row align-items-center justify-content-around gap-1" style={{fontWeight:'bold'}}>
            <img src={burgerMenuIcon} height='20px' width='20px' alt="" className={widthvar<551 ? 'showBurger ':'hideBurger '}  onClick={toggleNavbar} />
            
            <span>Task App</span>
            <img className='pointer' src={addIcon} height='20px' width='20px' alt="" onClick={()=>setCreateOrEdit(1)} />

            </h2>
          <div className='maincontent' style={isOpen? {opacity:0.1}:{opacity:1}} >
            <div className='taskcontainer row'>
                
              { displayTask.length!==0? (                  
                  displayTask.map((tasks,index)=>{
                    var taskImp=tasks.isImportant?'taskImp':'';
                    var taskComp=tasks.isComplete?'Complete':'Incomplete';
                    return ( 
                      <Task key={index} index={index} tasks={tasks} taskImp={taskImp} taskComp={taskComp}  setComplete={setComplete} editTask={editTask} deleteTask={deleteTask}  />
                    );
                  })
                ):''
              }
              <div className="task col-3 col-sm-4 col-lg-2 col-md-3  d-flex flex-column justify-content-center gap-3   p-3 addTask  pointer" onClick={()=>setCreateOrEdit(1)}>
                <p  className='addnewBtn m-0 '> Add New Task
                  <img src={addIcon} width='20px' height='20px' alt="" />
                </p>
              </div>
            </div>
            {
              (createOrEdit===1||createOrEdit===2)? (//handleCreateTask
                <TaskForm handleCreateTask={handleCreateTask} setNewTask={setNewTask} 
                  setCreateOrEdit={setCreateOrEdit} createOrEdit={createOrEdit}
                  newTask={newTask}
                  compRef={compRef} impoRef={impoRef}
                />
              ):''
            }
        </div>
        </div>
      </div>
    );
}
export default TaskPage;
