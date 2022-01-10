export enum MONITORS {
  ADD_LAMODA_PIDS = 'ADD_LAMODA_PIDS',
  REMOVE_LAMODA_PIDS = 'REMOVE_LAMODA_PIDS',
  ADD_LAMODA_MONITOR = 'ADD_LAMODA_MONITOR',
}

import { MonitorsInterface } from '../Interfaces/interfaces';
import { LamodaMonitor } from '../scripts/lamoda/lamodaMonitor';
import { ActionType } from './index';
const defaultState: MonitorsInterface = {
  lamoda: null,
};

export const monitorsReducer = (
  state = defaultState,
  action: ReturnType<typeof MonitorDispatcher>
) => {
  let currentState = { ...state };
  switch (action.type) {
    case MONITORS.ADD_LAMODA_MONITOR:
      if (!currentState.lamoda) {
        return {
          ...currentState,
          lamoda: new LamodaMonitor().Monitor(),
        };
      }
      return state;
    case MONITORS.ADD_LAMODA_PIDS:
      action.payload.pids &&
        currentState.lamoda &&
        (currentState.lamoda!.setPids = action.payload.pids);
      return currentState;
    case MONITORS.REMOVE_LAMODA_PIDS:
      action.payload.pids &&
        currentState.lamoda &&
        (currentState.lamoda.removePids = action.payload.pids);
      return currentState;
    default:
      return state;
  }
};

export const MonitorDispatcher = (
  type: 'ADD_LAMODA_PIDS' | 'REMOVE_LAMODA_PIDS' | 'ADD_LAMODA_MONITOR',
  payload: { pids?: string[] }
) => {
  return { type, payload };
};
