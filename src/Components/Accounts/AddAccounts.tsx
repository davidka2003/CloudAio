import React, { ChangeEvent, FormEvent, MouseEvent } from 'react'
import {useState} from 'react'
import '../../scss/input.global.scss'
import '../../scss/buttons.global.scss'
import { Dispatch } from 'redux'
import { ADD_ACCOUNTS_PROFILE } from '../../store/accountsProfilesReducer'
import { useAppDispatch } from '../../store'

const AddAccounts = () => {
    const [profile, setprofile] = useState<{account:string,amount:number}>({account:'',amount:0})
    const dispatch= useAppDispatch()

    let handleSubmit = (event:FormEvent)=>{
        event.preventDefault()
        dispatch({type:ADD_ACCOUNTS_PROFILE,payload:{
            ...profile
        }})
    }
    let handleChange = (event:ChangeEvent<HTMLInputElement>)=>{
        let currentprofile = {...profile}
        setprofile({...currentprofile,[event.target.name]:event.target.value,amount:2**(event.target.value.split('@')?.[0].length-1)})
    }

  return (
      <div className="container">
      <div className="row">
      <div className="col-12">
          <p>
          <button className="net_button_primary" type="button" data-toggle="collapse" data-target="#EpicCollapse" aria-expanded="false" aria-controls="EpicCollapse" id="AddProfile" >Add new account</button>
          </p>
          <div className="collapse" id="EpicCollapse">
          <form onSubmit={handleSubmit} className="needs-validation form-inline" name="AddProfile">
              <div className="card card-body">
              <div className="container row g-6" id="NewAddress">
              <div className="col-12">
                  <label htmlFor="email" className="form-label">Email <span className="text-muted" /></label>
                  <input className='net_input' onChange={handleChange} type="email" name="email"/*  placeholder="email"  */required />
                  {/* <div class="invalid-feedback">
                              Please enter a valid email address for shipping updates.
                          </div> */}
                  </div>
                  <label>
                      Total accounts amount: {profile.amount>=1?profile.amount:0}
                  </label>
                  {/* <button onChange={handleChange} className="net_button_primary" id="submitProfile" type="submit" value="Сохранить">Save</button> */}
                  <button className="net_button_primary" id="submitProfile" type="submit" value="Сохранить">Generate</button>
              </div>
              </div>
          </form>
          </div>
      </div>
      </div>
  </div>
)
}

export default AddAccounts
