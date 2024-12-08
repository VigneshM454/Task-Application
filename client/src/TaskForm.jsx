// eslint-disable-next-line react/prop-types
const TaskForm=({handleCreateTask,setNewTask,newTask,compRef,impoRef, createOrEdit,setCreateOrEdit})=>{

    const handleChange=(event)=>{
        const {name,value}=event.target;
    
        if(event.target.type=='checkbox' && event.target.checked){
          setNewTask({...newTask,[name]:true});
         // console.log('checkbox is checked');
        }else if(event.target.type=='checkbox'){
        //  console.log(event.target);
        //  console.log(event.target.checked);
          setNewTask({...newTask,[name]:false});
        //  console.log('checkbox is unchecked');
        //  console.log(newTask);
        }else{
          setNewTask({...newTask,[name]:value,});
        }
       // console.log(name);
       // console.log(value);
      }
    const hideTaskInput=()=>{
      setCreateOrEdit(0)
      setNewTask({  id:0, title:'',
        description:'', deadline:'',
        isComplete:false, isImportant:false,
      })
    }
  function addZero(num){
    let str=String(num);
    let validstr=str.length===1? '0'+str :str
    return  validstr
  }
  function getCorrectDate(date){
   // let date1 =new Date(date[length-1]==='Z'?date.slice(0,date.length-1):date)//.toISOString()
   // let dateString=new Date(date1.getTime() - date1.getTimezoneOffset() * 60000);

    var dateString= new Date(date)//.toISOString();
    let correctDate=`${dateString.getFullYear()}-${addZero(dateString.getMonth()+1)}-${addZero(dateString.getDate())}T${addZero(dateString.getHours())}:${addZero(dateString.getMinutes())}`;  
    return correctDate;
  }

    return(    
        <div className="createTaskDiv" >
        <form className=' col' onSubmit={ handleCreateTask} style={{ }}>
            <div className="mb-3 d-flex flex-row align-items-center justify-content-between">
                <h4 className="m-0 ">{createOrEdit===2?('Edit a Task'):('Create a Task')} </h4> 
                <button className="btn-close" onClick={hideTaskInput} ></button> 
            </div>
            <div className="mb-1">
              <label className="form-label" htmlFor="#title">Title</label>
              <input type="text" minLength={5} maxLength={50}  id='title' className="form-control" name='title' placeholder='e.g. Read a book' value={newTask.title} onChange={handleChange} required />
            </div>
            <div className="mb-1">
              <label className="form-label" htmlFor="#desc">Description</label>
              <textarea name="description" minLength={20} maxLength={100} id="desc" className="form-control" placeholder='Read a book about Apptitude written by R.S.Agarwal' value={newTask.description} onChange={handleChange}  required></textarea>
            </div>
            <div className="mb-1">
              <label className="form-label" htmlFor="#date">Date</label>
              <input type="datetime-local" name="deadline" id="date" placeholder='dd/mm/yyyy'className="form-control"  defaultValue={getCorrectDate(newTask.deadline)} onChange={handleChange} required/>
            </div>
            { createOrEdit!==1 ?
              <div className="d-flex flex-row align-items-center justify-content-around mb-1 ">
                <label className="col form-label m-0" htmlFor="#complete_check">Toggle Complete</label>
                <input type="checkbox" width={'20px'} height='20px'  name="isComplete" id="complete_check" className=" m-0 " ref={compRef} defaultChecked={newTask.isComplete} onChange={handleChange} />
              </div>
            :''
            }
            <div className="d-flex flex-row align-items-center justify-content-around mb-3 ">
             <label className="col m-0 form-label" htmlFor="#complete_important">Toggle Important</label>
              <input type="checkbox" width={'20px'} height='20px'  name="isImportant" id="complete_important" className=" m-0 " ref={impoRef} defaultChecked={newTask.isImportant? true: false} onChange={handleChange}  />
            </div>
            <button type='submit' className='createTaskBtn btn btn-primary w-100' >{createOrEdit===2? 'Edit':'+ Create Task'}</button>
            <br />
      </form>
      </div>
    )
}

export default TaskForm;
