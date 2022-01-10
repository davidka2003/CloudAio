import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, createStore } from "redux";
import { accountsProfilesReducer } from "./accountsProfilesReducer";
import { lamodaTasksReducer } from "./lamodaTasksReducer";
import { monitorsReducer } from "./monitorsReducer";
import { profilesReducer } from "./profilesReducer";
import { proxyProfilesReducer } from "./proxyProfilesReducer";
import { raffleReducer } from "./raffleReducer";
import { settingsReducer } from "./settingsReducer";
// import { tasksReducer } from "./tasksReducer";
export interface ActionType {
    type:string,
    payload:any
}
const rootReducer = combineReducers({
    profiles:profilesReducer,
    settings:settingsReducer,
    proxy:proxyProfilesReducer,
    accounts:accountsProfilesReducer,
    raffles:raffleReducer,
    lamodaTasks:lamodaTasksReducer,
    monitors:monitorsReducer
})


export const store = createStore(rootReducer)
export const useAppDispatch = ()=>useDispatch<typeof store.dispatch>()
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector