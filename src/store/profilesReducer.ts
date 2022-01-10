import { ActionType } from '.';
import { ProfileInterface } from '../Interfaces/interfaces';

export const ADD_PROFILE = 'ADD_PROFILE';
export const REMOVE_PROFILE = 'REMOVE_PROFILE';
export const EDIT_PROFILE = 'EDIT_PROFILE';
const defaultState = <
    {
      [profileId: string]: ProfileInterface;
    }
  >JSON.parse(localStorage.getItem('profiles')!) || {};
export const profilesReducer = (
  state = defaultState,
  action: ReturnType<typeof ProfileDisparcher>
) => {
  let currentState: typeof state;
  switch (action.type) {
    case ADD_PROFILE:
      currentState = {
        ...state,
        [action.payload.profileName]: <ProfileInterface>action.payload,
      };
      localStorage.setItem('profiles', JSON.stringify(currentState));
      return currentState;
    case REMOVE_PROFILE:
      currentState = { ...state };
      delete currentState[action.payload.profileName];
      localStorage.setItem('profiles', JSON.stringify(currentState));
      return currentState;
    case EDIT_PROFILE:
      currentState = {
        ...state,
        [action.payload.profileName]: <ProfileInterface>action.payload,
      };
      localStorage.setItem('profiles', JSON.stringify(currentState));
      return currentState;
    default:
      return state;
  }
};
export const ProfileDisparcher = (
  type: 'ADD_PROFILE' | 'REMOVE_PROFILE' | 'EDIT_PROFILE',
  payload: Partial<ProfileInterface> & {
    profileName: string;
  }
) => {
  return {
    type,
    payload,
  };
};
