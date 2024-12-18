import {  useState, useMemo } from 'react'
import TrashIcon from '../icons/TrashIcon'
import PlusIcon from '../icons/PlusIcon'
import TaskCard from './TaskCard'

import { Column, Id, Task } from '../types'

import { SortableContext, useSortable } from '@dnd-kit/sortable'
import {CSS} from "@dnd-kit/utilities"


interface Props{
    column:Column,
    deleteColumn:(id:Id) => void
    updateColumn:(id:Id,title:string) =>void
    addTasktoColumn:(id:Id) =>void
    tasks:Task[]
    deleteTask:(id:Id)=>void
    updateTask:(id:Id,content:string)=>void
    taskCount:number
}
function ColumnContainer({column,deleteColumn,updateColumn,addTasktoColumn,tasks,deleteTask,updateTask,taskCount}:Props) {

    const [isEditMode,setIsEditMode] = useState(false);

    const tasksIds = useMemo(()=>{
        return tasks.map(task=>task.id)
    },[tasks])

    const{setNodeRef,attributes,listeners,transform,transition,isDragging} = useSortable({
        id:column.id,
        data:{
            type:"Column",
            column,
        },
    });

    const style = {
        transition,
        transform:CSS.Transform.toString(transform)
    }

    const handleDelete = ()=>{
        deleteColumn(column.id)
    }

    const handleAddTask = ()=>{
        addTasktoColumn(column.id)
    }

    if(isDragging){
        return(
            <div 
                ref={setNodeRef}
                style={style}
                className='bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-md shadow-2xl border-2 border-rose-500 opacity-40'
            >
            </div>
        )
    }
  return (
    <div style={style} ref = {setNodeRef} className='bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-md shadow-2xl'>
        {/* Column header  */}
        <div  {...attributes} {...listeners}  
              className='flex justify-between align-center bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md
                          rounded-b-none p-3 font-bold border-columnBackgroundColor border-4'>
             
             {!isEditMode && <div className='flex gap-2 items-center' onClick={()=>setIsEditMode(true)}><span className=' border-2 p-2 h-[25px] items-center flex rounded-md border-cyan-400'>{taskCount}</span><p>{column.title}</p></div>}
             
             {isEditMode && 
                    <div>
                            <input 
                                className='bg-columnBackgroundColor w-[250px] focus:border-blue-400 border rounded outline-none px-2' type='text'
                                autoFocus 
                                onBlur={()=>setIsEditMode(false)} onKeyDown={(e)=>{
                                    if(e.key!=="Enter") return;
                                    setIsEditMode(false);
                                }} 
                                value={column.title}
                                onChange={(e)=>updateColumn(column.id,e.target.value)}
                                >

                            </input>
                    </div>}
                    <button 
                        className='stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor hover:ring-2  hover:ring-rose-500  rounded px-2'
                        onClick={handleDelete}
                    >  
                        <TrashIcon/>
                    </button>
        </div>
        {/* Tasklist  */}
        <div className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto' >
            <SortableContext items={tasksIds}>
                {tasks?.map((task:Task)=>(
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                ))}
            </SortableContext>
        </div>

        {/* Add task button */}
        <button
         className='flex gap-2 items-center rounded-md p-4 border-2 border-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-sky-500 active:bg-black'
         onClick={handleAddTask}
         >
            <PlusIcon/>Add Task
        </button>
        
    </div>
  )
}

export default ColumnContainer