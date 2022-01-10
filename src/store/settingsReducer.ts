import { ActionType } from '.';
import { SettingsInterface } from '../Interfaces/interfaces';

export const EDIT_KEY = 'EDIT_KEY';
export const EDIT_SETTINGS = 'EDIT_SETTINGS';
const defaultState =
  <SettingsInterface>JSON.parse(localStorage.getItem('settings')!) || {};
export const settingsReducer = (
  state = defaultState,
  action: ReturnType<typeof SettingsDispatcher>
) => {
  let currentState: typeof state;
  switch (action.type) {
    case EDIT_SETTINGS:
      currentState = { ...state, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(currentState));
      return currentState;
    default:
      return state;
  }
};
export const SettingsDispatcher = (
  type: 'EDIT_KEY' | 'EDIT_SETTINGS',
  payload: {
    captchaKey?: string;
    discordWebhook?: string;
    monitorsDelay?: number;
    monitorProxyProfile?: string;
  }
) => {
  return { type, payload };
};
