import React, { ChangeEvent, FormEvent } from 'react'
import Select from 'react-select'
import {useState} from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { ProfileInterface, RaffleTaskInterface, ShopifyTaskInterface } from '../../Interfaces/interfaces'
import { sizes } from './AddRaffle'
import { Dispatch } from 'redux'
import { ADD_SHOPIFY_TASK } from '../../store/allTasksReducer'

import { ToastContainer, toast } from 'react-toastify';
import { ADD_RAFFLE_TASK } from '../../store/raffleReducer'

const AddRaffleTravis = () => {
    const accounts:{[account:string]:string[]} = useAppSelector((state:any)=>state.accounts)
    const profiles:{[key:string]:ProfileInterface} = useAppSelector((state:any)=>state.profiles)
    const proxyProfiles = useAppSelector((state:any)=>state.proxy)
    const [edit, setedit] = useState<RaffleTaskInterface>({shopType:'travis',delay:0,sizes:{},status:{fail:0,success:0}})
    const dispatch = useAppDispatch()

    const handleChange = (event:ChangeEvent<HTMLSelectElement|HTMLInputElement>)=>{
        event.target.type == 'checkbox'?setedit({...edit,[event.target.id]:event.target.checked}):
        setedit({...edit,[event.target.id]:event.target.value})
    }
    const handleSubmit = ()=>{
        event?.preventDefault()
        dispatch({type:ADD_RAFFLE_TASK,payload:{...edit}})
        console.log(edit)
        notify()
    }
    const notify = () => toast.info('Task was added', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    return (
        <div className="container row">
            <div className="container col-1" />
                <div className="container col-10">
                    <form onSubmit={handleSubmit} className="needs-validation" id="createTaskForm">
                        <div className="row g-6">
                        <h2 className=" text-center">Travis</h2>
                        </div>
                        <div className="row g-3">
                        <h4 className="">Settings</h4>
                        <div className='col-4'>
                            <label htmlFor="profile">Delay (ms)</label>
                            <input type="number"onChange={handleChange} value={edit.delay} className='net_input' id="delay" required/>
                        </div>
                        <div className="col-4">
                            <label htmlFor="profile" className="form-label ">Profile</label>
                            <select value={edit?.profile} onChange={handleChange} className="net_select" id="profile" required={true}>
                            <option value="">Select...</option>
                            {
                                Object.keys(profiles||{})?.map((profile,index)=>{
                                    return(
                                        <option value={profile} key={index}>{profile}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                        <div className="col-4">
                            <label htmlFor="profile">Accounts Profile</label>
                            <select onChange={handleChange} className='net_select' id="accountProfile" required>
                            <option value="">Select...</option>
                            {
                                Object.keys(accounts||{})?.map((profile,index)=>{
                                    return(
                                        <option value={profile} key={index}>{profile}</option>
                                    )
                                })
                            }
                            </select>
                        </div>
                            
                        {/* <div className="col-4">
                            <label htmlFor="mode" className="form-label ">Mode</label>
                            <select value={task?.mode} onChange={handleChange} className="net_select" id="mode" required={true}>
                                <option value="">Select...</option>
                                <option>release</option>
                                <option>24/7</option>
                            </select>
                        </div> */}
                        <div className="col-4">
                            <label htmlFor="proxyProfile" className="form-label ">Proxy</label>
                            <select value={edit?.proxyProfile} onChange={handleChange} className="net_select" id="proxyProfile" required={true}>
                                <option value="">Select...</option>
                                {Object.keys(proxyProfiles).map((profile:string,index)=><option key={index} value={profile}>{profile}</option>)}
                            </select>
                        </div>
                        <div className='col-4'>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" checked = {edit?.isCustomSizes}onChange={handleChange} name="flexRadioDefault" id="isCustomSizes" data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample" />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Use preferred sizes</label>
                        </div>
                        <div>
                            <div className="collapse text-dark" id="collapseExample">
                            <div className="card card-body">
                                {
                                    sizes?.map((size:string,index)=>{
                                        return (
                                            <div className="form-check" key={index}>
                                            <input className="form-check-input" onChange={handleChange} checked = {edit.sizes?.[size]} id={size} name="sizes" type="checkbox" />
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
                        </div>
                        <br />
                        <button className="net_button_primary" id="saveNewTaskButton" >Save</button>
                        <ToastContainer />
                        <br />
                    </form>
                </div>
            <div className="container col-1" />
        </div>

    )
}

export default AddRaffleTravis
