import React, { ChangeEvent, FormEvent, useEffect } from 'react'
import {useState} from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { LamodaTaskInterface } from '../../Interfaces/interfaces'
import { LAMODA } from '../../store/lamodaTasksReducer'
import { sizes } from '../AddTask/AddTask'
import LamodaTask from './LamodaTask'
const EditShopifyTask = (props:{
  taskId:string
}) => {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state)=>state.lamodaTasks)
  /* @ts-ignore */
  const [edit, setedit] = useState<LamodaTaskInterface>({isCustomSizes:false,_taskNumber:1,sizes:{}})
  useEffect(()=>{
    setedit({...tasks}[props.taskId])
  },[props.taskId])
  let saveEdited = (event:FormEvent)=>{
    event.preventDefault()
    dispatch({type:LAMODA.EDIT_TASK,payload:{...edit}})
}
  const changeHandler = (event:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    // console.log(task)
    let currentTask = /* {...task} */{...edit}
    switch(event.target.id){
      default:
        /* @ts-ignore */
        event.target.name == "sizes"?currentTask.sizes[event.target.id] = event.target.checked:null
        break;
    }
    setedit(currentTask)
    // console.log(task)

  }
  return (
      <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Редактирование таска</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <form onSubmit={saveEdited} className="container needs-validation" id="editTaskForm">
                  <div className="row g-6">
                    <h5>Filters</h5>
                    <div className="col">
                      <label htmlFor="positive" className="form-label">Pids</label>
                      <input onChange={changeHandler} value={edit?.pids?.join("|")} type="text" className="form-control" id="positive" required />
                    </div>
                  </div>
                  <br />
                  <div className="col">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Все размеры
                      </label>
                    </div>
                    <div className="form-check">
                      {/* @ts-ignore */}
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" data-bs-toggle="collapse" href="#editSize" role="button" aria-expanded="false" aria-controls="editSize" />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Кастомные размеры
                      </label>
                    </div>
                    <div>
                      <div className="collapse text-dark" id="editSize">
                        <div className="card card-body">
                        {
                                    sizes?.map((size,index)=>{
                                        return (
                                            <div className="form-check" key={index}>
                                            <input onChange={changeHandler} className="form-check-input"  checked = {edit?.sizes.includes(size)} id={size} name="sizes" type="checkbox" />
                                            <label className="form-check-label" htmlFor={size +'us'}>
                                                {size} us
                                            </label>
                                            </div>            
                                        )
                                    })
                                }
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="row g-6">
                    <h5>Настройки</h5>
                    <div className="col">
                      <label htmlFor="mode" className="form-label">Профиль</label>
                    </div>
                    <div className="col">
                      <label htmlFor="mode" className="form-label">Прокси</label>
                      <select className="form-select" id="mode" required>
                        <option>Выбрать...</option>
                        <option>release</option>
                        <option>24/7</option>
                      </select>
                    </div>

                  </div>
                  <br />
                  <button className="btn btn-primary" id="editShopifyTaskButton">Сохранить изменения</button>
                  <br />  
                </form>
              </div>
            </div>
  )
}

/* @ts */
export default EditShopifyTask
