import { ProxyProfileInterface } from '../Interfaces/interfaces';

export const ADD_PROXY_PROFILE = 'ADD_PROXIE_PROFILE';
export const REMOVE_PROXY_PROFILE = 'REMOVE_PROXIE_PROFILE';
export const EDIT_PROXY_PROFILE = 'EDIT_PROXIE_PROFILE';
const defaultState = <
  {
    [profileName: string]: ProxyProfileInterface;
  }
>JSON.parse(localStorage.getItem('proxyProfiles')!) || {
  noProxy: { proxy: [''], profileName: 'noProxy' },
};
export const proxyProfilesReducer = (
  state = defaultState,
  action: ReturnType<typeof ProxyDispatcher>
) => {
  let currentState: typeof state;
  switch (action.type) {
    case ADD_PROXY_PROFILE:
      // console.log(action.payload)
      currentState = {
        ...state,
        [action.payload.profileName]: action.payload as ProxyProfileInterface,
      };
      localStorage.setItem('proxyProfiles', JSON.stringify(currentState));
      return currentState;
    case REMOVE_PROXY_PROFILE:
      currentState = { ...state };
      delete currentState[action.payload.profileName];
      localStorage.setItem('proxyProfiles', JSON.stringify(currentState));
      return currentState;
    case EDIT_PROXY_PROFILE:
      currentState = {
        ...state,
        [action.payload.profileName]: action.payload as ProxyProfileInterface,
      };
      localStorage.setItem('proxyProfiles', JSON.stringify(currentState));
      return currentState;
    default:
      return state;
  }
};
export const ProxyDispatcher = (
  type: 'ADD_PROXIE_PROFILE' | 'REMOVE_PROXIE_PROFILE' | 'EDIT_PROXIE_PROFILE',
  payload: Partial<ProxyProfileInterface> & {
    proxy?: ProxyProfileInterface['proxy'];
    profileName: string;
  }
) => {
  return { type, payload };
};
