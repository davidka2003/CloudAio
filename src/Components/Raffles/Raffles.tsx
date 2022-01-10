import React, { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { ProfileInterface } from '../../Interfaces/interfaces';
import '../../scss/input.global.scss';
import '../../scss/buttons.global.scss';
import { Dispatch } from 'redux';
import {
  ADD_ACCOUNTS_PROFILE,
  REMOVE_ACCOUNTS_PROFILE,
} from '../../store/accountsProfilesReducer';
import { TravisRaffle } from '../../scripts/raffles/travis';
import { ADD_RAFFLE_TASK } from '../../store/raffleReducer';
import Raffle from './Raffle';

const Raffles = () => {
  const raffles = useAppSelector((state) => state.raffles);
  // const accounts:{[account:string]:string[]} = useAppSelector((state:any)=>state.accounts)
  // const profiles:{[key:string]:ProfileInterface} = useAppSelector((state:any)=>state.profiles)
  // const status:{success:number,fail:number} = useAppSelector((state:any)=>state.raffles)
  // const proxyProfiles = useAppSelector((state:any)=>state.proxy)
  // const [edit, setedit] = useState<{accountProfile?:string,proxyProfile?:string,profile?:string,rafflesDelay:number}>({rafflesDelay:0})
  // const dispatch = useAppDispatch()
  // const handleCreate = (event:FormEvent<HTMLFormElement>)=>{
  //     event.preventDefault()

  // }
  // const handleChange = (event:ChangeEvent<HTMLSelectElement|HTMLInputElement>)=>{
  //     setedit({...edit,[event.target.id]:event.target.value})
  // }
  // const handleSubmit = ()=>{
  //     event?.preventDefault()
  //     dispatch({type:ADD_RAFFLE_TASK,payload:{...edit}})
  // }
  // const handleStart = ()=>{
  //     new TravisRaffle(edit.accountProfile!,edit.proxyProfile!,edit.profile)
  // }
  // const handleStop = ()=>{

  // }
  return (
    <div
      className="tab-pane fade"
      id="v-pills-raffles"
      role="tabpanel"
      aria-labelledby="v-pills-raffles-tab"
    >
      <div className="container">
        {/* <h2>Travis Scott</h2>
        <div className='row'>
          <div className='col-6'>
            <div >Number of registered applications:</div>
            <h1 id=''>{status.success}</h1>
            <div>Number of emails</div>
            <h3>{accounts[edit?.accountProfile!]?.length || 0}</h3>
            <div> Errors:</div>
            <h3>{status.fail}</h3>
            <button onClick = {handleStart}className='net_button_primary'>Start</button>
            <button onClick = {handleStop}className='net_button_primary'>Stop</button>
          </div>
          <form onSubmit={handleCreate} className='col-6'>
            <div className=''>
              <div className='col-9 row-1'>
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
              <div className='col-9 row-2'>
                <label htmlFor="profile">Proxy profile</label>
                <select onChange={handleChange} className='net_select' id="proxyProfile" required>
                  <option value="">Select...</option>
                  {
                      Object.keys(proxyProfiles||{})?.map((profile,index)=>{
                          return(
                              <option value={profile} key={index}>{profile}</option>
                          )
                      })
                  }
                </select>
              </div>
              <div className='col-9 row-3'>
                <label htmlFor="profile">Profile</label>
                <select onChange={handleChange} className='net_select' id="profile" required>
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
              <div className='col-9 row-3'>
                <label htmlFor="profile">Delay (ms)</label>
                <input type="number"onChange={handleChange} value={edit.rafflesDelay} className='net_input' id="rafflesDelay" required/>
              </div>

            </div>
            <button type="submit" className='net_button_primary'>Save</button>
            
          </form> */}
        <div className="container ">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Category</th>
                <th>Account</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="rafflesTable">
              {Object.keys(raffles)?.map((id: string) => {
                return <Raffle id={id} key={id} />;
              })}
            </tbody>
          </table>
          {}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Raffles;
