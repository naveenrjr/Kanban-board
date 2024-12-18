import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom';
import PlusIcon from '../icons/PlusIcon'
import ColumnContainer from './ColumnContainer';
import TaskCard from './TaskCard';
import { initialColumns,initialTasks } from '../mock/data';

import { Column, Id, Task } from '../types';

import { closestCenter, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';


function KanbanBoard() {
    
    const [columns,setColumns] = useState<Column[]>(()=>{
        const savedColumns = localStorage.getItem('LOCAL_STORAGE_COL');
        return savedColumns? (JSON.parse(savedColumns).length > 0 ? JSON.parse(savedColumns) : initialColumns ) :initialColumns
    });

    const [activeColumn,setActiveColumn] = useState <Column|null>(null);
    const [activeTask,setActiveTask] = useState <Task|null>(null);

    const [tasks,setTasks] = useState <Task[]>(()=>{
        const savedTasks = localStorage.getItem('LOCAL_STORAGE_TASKS');
        return savedTasks? (JSON.parse(savedTasks).length > 0 ? JSON.parse(savedTasks) : initialTasks ) : initialTasks;
    })

    // console.log("columns",columns);
    // console.log("tasks",tasks);

    useEffect(()=>{
        localStorage.setItem ('LOCAL_STORAGE_COL',JSON.stringify(columns))
    },[columns])

    useEffect(()=>{
        localStorage.setItem('LOCAL_STORAGE_TASKS',JSON.stringify(tasks))
    },[tasks]);
    
    const columnsId = useMemo(()=>columns.map((col)=>col.id),[columns]);

    const sensors = useSensors(
        useSensor(PointerSensor,{
            activationConstraint:{
                distance:3
            }
        })
    )


    const addNewColumn = ()=>{
        const columntoAdd:Column = {
            id: Date.now().toString(36),
            title:`Column${columns.length+1}`
        }
        setColumns([...columns,columntoAdd]);
    }
    const deleteColumn = (id:Id) =>{
        setColumns((prevColumns)=>prevColumns.filter((col)=>col.id !== id));
        setTasks(prevTasks=>prevTasks.filter((task)=>task.columnId!== id));
    }

    const updateColumn = (id:Id,title:string)=>{
        const updatedColumns = columns.map((col)=>{
            if(col.id !== id) return col;
            return {...col,title}
        })
        setColumns(updatedColumns);
    }

    const addTasktoColumn =  (columnId:Id)=>{
        const newTask :Task = {
            id:Date.now().toString(36),
            columnId,
            content:`Task ${tasks.length+1}`
        }
        setTasks([...tasks,newTask])
    }

    const deleteTask = (id:Id)=>{
        const newTasks = tasks.filter((task)=>(task.id!== id))
        setTasks(newTasks);
    }

    const updateTask = (id:Id,content:string) =>{
        const updatedTasks = tasks.map((task)=>{
            if(task.id!==id) return task
            return {...task,content}
        })
        setTasks(updatedTasks);
    }

    const getTasksInColumnCount = (columnId:Id)=>{
        return tasks.filter((task)=>task.columnId=== columnId).length
    }

    const onDragStart = (event:DragStartEvent)=>{
        // console.log("Drag Start event",event);
        if(event.active.data.current?.type === 'Column'){
            setActiveColumn(event.active.data.current.column);
            setActiveTask(null); //disable moving task when moving column
            return;
        }
        if(event.active.data.current?.type === 'Task'){
            setActiveTask(event.active.data.current.task)
            setActiveColumn(null); // disable moving columns when moving task 
            return;
        }
    }

    const onDragEnd = (event:DragEndEvent) =>{
        setActiveColumn(null);
        setActiveTask(null);
        console.log("Drag end event",event);
        const {active, over} = event;

        if(!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if(activeColumnId === overColumnId) return;

        setColumns(prevColumns =>{
            const activeColumnIndex = prevColumns.findIndex((col)=>col.id === activeColumnId)
            const overColumnIndex = prevColumns.findIndex((col)=>col.id === overColumnId)

            return arrayMove(columns,activeColumnIndex,overColumnIndex);
        })
    }
    const onDragOver = (event:DragOverEvent)=>{
        const {active,over} = event;
        if(!over) return;

        const activeId = active.id;
        const overId = over.id;

        if(activeId === overId) return;

        const isActiveTask = active.data.current?.type ==='Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column'

        //Dropping task over another task
        if(isActiveTask && isOverTask){
            setTasks(tasks=>{
                const activeTaskIndex = tasks.findIndex(task=>task.id ===activeId)
                const overTaskIndex = tasks.findIndex(task=>task.id ===overId)
                tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
                return arrayMove(tasks,activeTaskIndex,overTaskIndex)
            })
        }

        //Dropping task over a column 
        if(isActiveTask && isOverColumn){
            setTasks(tasks=>{
                const activeTaskIndex = tasks.findIndex(task=>task.id ===activeId)
                
                tasks[activeTaskIndex].columnId = overId
                return arrayMove(tasks,activeTaskIndex,activeTaskIndex)
            })
        }
    }
  return (
   
        <div className='mx-auto flex min-h-screen w-full jusfity-center items-center overflow-x-auto overflow-y-hidden px-[40px]'>
             <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} collisionDetection={closestCenter}sensors={sensors}>
                <div className='mx-auto flex gap-4'>
                    <div className='flex gap-4 px-4'>
                        <SortableContext items={columnsId}> 
                            {columns.map(col=>(
                                <ColumnContainer 
                                    key={col.id} 
                                    column={col} 
                                    updateColumn={updateColumn} 
                                    deleteColumn = {deleteColumn} 
                                    addTasktoColumn={addTasktoColumn} 
                                    tasks={tasks.filter((task)=>task.columnId === col.id)}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    taskCount={getTasksInColumnCount(col.id)}
                                />
                                ))}
                        </SortableContext>
                    </div>
                    <button 
                        className='h-[60px] w-[350px] min-w-[350px] cursor-pointer
                                    rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor
                                    p-4 hover:ring-2 hover:ring-sky-500 active:ring-green-500 flex gap-2'
                        onClick={addNewColumn}
                    >
                         <PlusIcon/>Add Column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && 
                            <ColumnContainer 
                                column={activeColumn} 
                                deleteColumn={deleteColumn} 
                                updateColumn={updateColumn} 
                                addTasktoColumn={addTasktoColumn} 
                                updateTask={updateTask}
                                deleteTask={deleteTask}
                                tasks={tasks.filter((task)=>task.columnId === activeColumn.id)}
                                taskCount={getTasksInColumnCount(activeColumn.id)}
                                />
                        }
                        {activeTask && <TaskCard task={activeTask} updateTask={updateTask} deleteTask={deleteTask}/>}
                    </DragOverlay>,
                 document.body)}
            </DndContext>
        </div>
  )
}

export default KanbanBoard