import editIcon from '../assets/images/edit.svg';
import deleteIcon from '../assets/images/delete.svg';

const Task=({tasks,index,taskImp,taskComp,setComplete,editTask,deleteTask})=>{  
    function addZero(num){
      let str=String(num);
      let validstr=str.length===1? '0'+str :str
      return  validstr
    }

    function  showDate(dt){
      let date1 =new Date(dt.slice(0,dt.length-1))//.toISOString()
      let date=new Date(date1.getTime() - date1.getTimezoneOffset() * 60000);
      return (addZero(date.getDate())+'-'+addZero(date.getMonth()+1)+'-'+date.getFullYear() +'   '+ addZero(date.getHours())+':' +addZero(date.getMinutes()));  
    }

    return(
        <div className={'task col-3 col-sm-4 col-lg-2 col-md-3  d-flex flex-column justify-content-around   p-3 '+taskImp} key={index} id={tasks.id} 
        style={  (new Date(tasks.deadline)<Date.now()) ? { backgroundColor:'lightgray' } :{} }>
            <h4 className='h4 m-0'>{tasks.title}</h4>
            <p className='m-0'>{tasks.description}</p>
            <p>{(showDate(tasks.deadline))}</p>
            <div className='taskOptions'>
              <button style={{
                  backgroundColor:tasks.isComplete?'green':'red',
                  padding:'3px 5px',
                  borderRadius:'15px'
                }} className='text-white btn'
                onClick={()=>{!tasks.isComplete? setComplete(tasks.id,tasks.deadline):''}}
                >
                {taskComp}
              </button>
              <div className='editDelete '>
                <img className='pointer' src={editIcon} width='20px' height='20px' alt="edit_img" id={'edittask'+tasks.id}  onClick={()=>editTask(tasks.id) } />
                <img className='pointer' src={deleteIcon} width='20px' height='20px' alt="del_img" id={'deletetask'+tasks.id} onClick={()=>deleteTask(tasks.id)} />
              </div>
            </div>          
          </div>  
    )
}
export default Task;