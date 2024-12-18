import {useState} from 'react'
import TrashIcon from '../icons/TrashIcon'
import EditIcon from '../icons/EditIcon'

import { Id, Task } from '../types'

import { useSortable } from '@dnd-kit/sortable'
import {CSS} from "@dnd-kit/utilities"

interface Props{
    task:Task
    deleteTask:(id:Id)=>void
    updateTask:(id:Id,content:string)=>void
}
function TaskCard({task,deleteTask,updateTask}:Props) {
    const [isHover,setIsHover] = useState(false);
    const [isEditTask,setIsEditTask] = useState(false);

    const{setNodeRef,attributes,listeners,transform,transition,isDragging} = useSortable({
        id:task.id,
        data:{
            type:"Task",
            task,
        },
        disabled:isEditTask
    });

    const style = {
        transition,
        transform:CSS.Transform.toString(transform),
        height:"auto"
    }
    if(isDragging){
        return(
            <div
            ref={setNodeRef}
            style={style}
            className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex justify-between items-center opacity-40 border-2 border-rose-500 rounded-xl'
            >

            </div>
        )
    }

  return (
    <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex justify-between items-center
         rounded-xl hover:ring-2 hover:ring-inset ${!isEditTask?"hover:ring-sky-500":"ring-2 ring-rose-600"} cursor-grab`}
         onMouseEnter={()=>setIsHover(true)}
         onMouseLeave={()=>setIsHover(false)}
         
    >
        {!isEditTask && <p className='my-auto overflow-x-hidden whitespace-pre-wrap'>{task.content}</p>}
        {isEditTask && 
            <input
                className='bg-columnBackgroundColor w-full h-[90%] focus:border-none border rounded-md outline-none px-2'
                autoFocus
                onBlur={()=>setIsEditTask(false)}
                onKeyDown={(e)=>{
                    if(e.key!== "Enter") return;
                    setIsEditTask(false);
                }}
                value={task.content}
                onChange={(e)=>updateTask(task.id,e.target.value)}
             >
            </input>
        }
        {isHover&& !isEditTask && <div className='flex gap-2'>
            <button className='p-2 border border-transparent rounded hover:border hover:border-sky-400'onClick={()=>setIsEditTask(true)}>
                <EditIcon/>
            </button>
            <button className='p-2 border border-transparent rounded hover:border hover:border-rose-400' onClick={()=>deleteTask(task.id)}>
                <TrashIcon/>
            </button>
        </div>}
    </div>
  )
}

export default TaskCard