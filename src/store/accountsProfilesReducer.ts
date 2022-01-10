import fs from "fs"
import path from "path"
import { ActionType } from "."
export const ADD_ACCOUNTS_PROFILE = "ADD_ACCOUNTS_PROFILE"
export const REMOVE_ACCOUNTS_PROFILE = "REMOVE_ACCOUNTS_PROFILE"
let defaultState:{
    [email:string]:string[]
}
try {
    defaultState = JSON.parse(localStorage.getItem('accountsProfiles')!)
} catch (error) {
    defaultState = {}
    localStorage.setItem('accountsProfiles','{}')
}
function  *generate(email:string):Generator<string>{
    if (email.length <= 1) {
        yield email;
    } else {
        let head = email[0];
        let tail = email.slice(1);
        for (let item of generate(tail)) {
            yield head + item;
            yield head + '.' + item;
        }
    }
}
export const accountsProfilesReducer = (state = defaultState ,action:ActionType)=>{
    let currentState
    switch (action.type){
        case ADD_ACCOUNTS_PROFILE:
            let emails:string[] = []
            const domain:string = action.payload.email.split('@')[1]
            const address:string = action.payload.email.split('@')[0]
            for (const item of generate(address)) {
                emails.push(item+domain)          
            }
            currentState = {...state,[action.payload.email]:emails}
            localStorage.setItem('accountsProfiles',JSON.stringify(currentState))
            return currentState
        case REMOVE_ACCOUNTS_PROFILE:
            currentState = {...state}
            delete currentState[action.payload.email]
            localStorage.setItem('accountsProfiles',JSON.stringify(currentState))
            return currentState
        default:
            return state
    }
}