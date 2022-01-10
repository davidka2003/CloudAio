import { useAppDispatch, useAppSelector } from '../../store'
import React from 'react'
import './tasks.global.scss'
import { Dispatch } from 'redux'
import { LamodaTaskInterface } from '../../Interfaces/interfaces'
import { LAMODA } from '../../store/lamodaTasksReducer'
import { MONITORS } from '../../store/monitorsReducer'
export const LOW = "blue"
export const ERROR = "red"
export const SUCCESS = "green"
const message = {
  LOW,ERROR,SUCCESS
}
const LamodaTask = (props:{taskId:string,callEdit:Function})=>{
    const dispatch= useAppDispatch()
    const tasks:{[key:string]:LamodaTaskInterface} = useAppSelector((state:any)=>state.lamodaTasks)
    const handleDelete =()=>{
      dispatch({type:LAMODA.RUN_STOP_TASK,payload:{taskId:props.taskId,isRun:false}})
      dispatch({type:LAMODA.REMOVE_TASK,payload:{taskId:props.taskId}})
    }
    const handleStart = ()=>{
      dispatch({type:MONITORS.ADD_LAMODA_MONITOR,payload:{isRun:true}})
      dispatch({type:MONITORS.ADD_LAMODA_PIDS,payload:{pids:tasks[props.taskId].pids}})
      dispatch({type:LAMODA.RUN_STOP_TASK,payload:{taskId:props.taskId,isRun:true}})
      dispatch({type:LAMODA.EDIT_CHECKOUT_STATE,payload:{taskId:props.taskId,message:{level:"LOW",state:"started"}}})

    }
    const handleStop = ()=>{
      /* delete pids... */
      dispatch({type:LAMODA.RUN_STOP_TASK,payload:{taskId:props.taskId,isRun:false}})
      dispatch({type:LAMODA.EDIT_CHECKOUT_STATE,payload:{taskId:props.taskId,message:{level:"ERROR",state:"stopped"}}})
    }
    return(
      <tr className = "" key={props.taskId}>
      <td>{tasks[props.taskId].shop}</td>
      <td>{'pids:\n' + tasks[props.taskId].pids.join('\n')}</td>
      <td>{"24/7"}</td>
      <td style={{
        color: message[tasks[props.taskId]?.currentCheckoutState!.level]||"blue"
      }}>{tasks[props.taskId].currentCheckoutState?.state}</td>
      <td>
        <div className = 'btn-group'>
          <button onClick={handleStart} className = 'btn btn-outline-secondary btn-md' id = 'starttasks'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
              <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
            </svg>
          </button>
          <button onClick={handleStop} className = 'btn btn-outline-secondary btn-md' id = 'stoptasks'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
            </svg>
          </button>
          <button className='btn btn-outline-secondary btn-md' onClick={handleDelete} id = 'DeleteTask'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
          <button className='btn btn-outline-secondary btn-md' onClick={()=>props.callEdit(props.taskId)} data-bs-toggle="modal" data-bs-target="#EditShopifyTask">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
          </button>
        </div>
      </td>
    </tr>

    )

  }

export default LamodaTask
