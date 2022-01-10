import { ipcRenderer } from 'electron'
import React from 'react'
import {useState} from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import LamodaTask from './LamodaTask'
import EditShopifyTask from './EditLamodaTask'
import { LAMODA } from '../../store/lamodaTasksReducer'
import { MONITORS } from '../../store/monitorsReducer'
import { LamodaTaskInterface } from '../../Interfaces/interfaces'
const Tasks = () => {
  const dispatch = useAppDispatch()
  // const tasks = useAppSelector((state:any)=>state.tasks)
  // const shopifyTasks = useAppSelector((state:any)=>state.shopifyTasks)
  const lamodaTasks:{[taskId:string]:LamodaTaskInterface} = useAppSelector((state)=>state.lamodaTasks)
  const allTasks = {
    ...lamodaTasks
  }
  const [taskId, settaskId] = useState('')
  const editTask = (taskId:string)=>settaskId(taskId)
  const handleStartAll = ()=>{
    dispatch({type:MONITORS.ADD_LAMODA_MONITOR,payload:{isRun:false}})
    dispatch({type:MONITORS.ADD_LAMODA_PIDS,payload: {
      pids:Object.keys(lamodaTasks).map(taskId=>lamodaTasks[taskId].pids).flat()
    }})/* add pids to monitor (dispatch) */
    dispatch({type:LAMODA.RUN_STOP_ALL_TASKS,payload:{isRun:false}})
    dispatch({type:LAMODA.EDIT_ALL_CHECKOUTS_STATE,payload:{message:{level:"LOW",state:"started"}}})
  }
  const handleStopAll = ()=>{
    dispatch({type:LAMODA.RUN_STOP_ALL_TASKS,payload:{isRun:false}})
    dispatch({type:LAMODA.EDIT_ALL_CHECKOUTS_STATE,payload:{message:{level:"ERROR",state:"stopped"}}})
  }
  const handleDeleteAll = ()=>{
    dispatch({type:LAMODA.REMOVE_ALL_TASKS,payload:{isRun:false}})
  }
  return (
      <div className="tab-pane fade show active" id="v-pills-tasks" role="tabpanel" aria-labelledby="v-pills-tasks-tab">
        <div className="container ">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Category</th>
                <th>Filters</th>
                <th>Mode</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(allTasks)?.map((taskId:string)=>{
                  switch (allTasks[taskId].shop){
                    case "lamoda":
                      return (<LamodaTask taskId={taskId} key={taskId} callEdit={editTask}/>)
                    default:
                      return
                  }
                })
              }
            </tbody>
          </table>
          {}
          <div className='container'>
            <div className='task_buttons_container'>
              <button onClick={handleStartAll} className = 'net_button_success tasks_buttons' id = 'startAllTasks' >Run</button>
              <button onClick={handleStopAll} className = 'net_button_danger tasks_buttons' id = 'stopAllTasks'>Stop</button>
              <button onClick={handleDeleteAll} className = 'net_button_secondary tasks_buttons' id = 'throwoffAllTasks'>Reset</button>
            </div>
          </div>

        </div>
        <div className="modal fade" id="EditShopifyTask" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <EditShopifyTask taskId={taskId}/>
          </div>
          </div>
      </div>
  )
}


export default Tasks
