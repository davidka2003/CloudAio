
import { ipcRenderer } from 'electron'
import React from 'react'
import { AUTHSERVER } from '../../index'

const logout=async()=>
    await fetch(`${AUTHSERVER}/auth/logout`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "ru",
            "content-type": "application/json",
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify({
            key:localStorage.getItem('key')
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
        })
        .then((r:any)=>r.json())
        .then((r:any)=>{
        if(r.success){
            console.log("success")
            return ipcRenderer.send('onCloseLogoutSuccess')
        }
        console.log(r)
        return setTimeout(logout,15000)
        }).catch(()=>setTimeout(logout,15000))

const Logout = () => {
    ipcRenderer.on('onCloseLogout',logout)
    return (
        <></>
    )
}

export default Logout
