import { v4 as id } from 'uuid';
export enum LAMODA {
  ADD_TASK = 'ADD_TASK',
  REMOVE_TASK = 'REMOVE_TASK',
  EDIT_TASK = 'EDIT_TASK',
  ADD_CHECKOUT = 'ADD_CHECKOUT',
  EDIT_CHECKOUT_STATE = 'EDIT_CHECKOUT_STATE',
  ADD_PIDS = 'ADD_PIDS',
  RUN_STOP_TASK = 'RUN_STOP_TASK',
  RUN_STOP_ALL_TASKS = 'RUN_STOP_ALL_TASKS',
  REMOVE_ALL_TASKS = 'REMOVE_ALL_TASKS',
  EDIT_ALL_CHECKOUTS_STATE = 'EDIT_ALL_CHECKOUTS_STATE',
}

import { LamodaTaskInterface } from '../Interfaces/interfaces';
const defaultState: { [taskId: string]: LamodaTaskInterface } =
  JSON.parse(localStorage.getItem('lamodaTasks')!) || {};
import { ActionType } from './index';

const lamodaDefaultStorage = (
  currentStorage: { [taskId: string]: LamodaTaskInterface },
  task: LamodaTaskInterface
): void => {
  console.log(task);
  currentStorage = {
    ...currentStorage,
    [task.taskId]: {
      ...task,
      currentCheckoutState: { level: 'LOW', state: 'not started' },
      checkout: null,
    },
  };
  localStorage.setItem('lamodaTasks', JSON.stringify(currentStorage));
};
export const lamodaTasksReducer = (
  state = defaultState,
  action: ReturnType<typeof LamodaTaskDispatcher>
) => {
  let currentState = { ...state };
  let currentStorage = <typeof state>(
    JSON.parse(localStorage.getItem('lamodaTasks') || '{}')
  );
  switch (action.type) {
    case LAMODA.ADD_TASK:
      let taskId = id();
      lamodaDefaultStorage(currentStorage, {
        ...(<LamodaTaskInterface>action.payload),
        taskId,
      });
      currentState = {
        ...state,
        [taskId]: {
          ...(<LamodaTaskInterface>action.payload),
          currentCheckoutState: { level: 'LOW', state: 'not started' },
          taskId,
          shop: 'lamoda',
        },
      };
      return currentState;
    case LAMODA.REMOVE_TASK:
      currentState[action.payload.taskId].checkout!.setStop = !action.payload
        .isRun; /* taskIsRun */
      delete currentState[action.payload.taskId];
      delete currentStorage[action.payload.taskId];
      localStorage.setItem('lamodaTasks', JSON.stringify(currentStorage));
      return currentState;
    case LAMODA.EDIT_TASK:
      // Object.keys(SITES).forEach(site=>checkoutsBypass[site]={})/* could be out of reducer */
      currentState = {
        ...state,
        [action.payload.taskId]: <LamodaTaskInterface>action.payload,
      };
      lamodaDefaultStorage(currentStorage, <LamodaTaskInterface>action.payload);
      return currentState;
    case LAMODA.RUN_STOP_TASK:
      currentState[action.payload.taskId].checkout!.setStop = !action.payload
        .isRun; /* taskIsRun */
      /* Checkouts isRun */
      return currentState;
    case LAMODA.EDIT_CHECKOUT_STATE:
      action.payload.message &&
        (currentState[action.payload.taskId].currentCheckoutState =
          action.payload.message);
      return currentState;
    case LAMODA.RUN_STOP_ALL_TASKS:
      for (let task in currentState) {
        currentState[task].checkout!.setStop = !action.payload.isRun;
      }
      return currentState;
    case LAMODA.EDIT_ALL_CHECKOUTS_STATE:
      if (action.payload.message) {
        for (let task in currentState) {
          currentState[task].currentCheckoutState = action.payload.message;
        }
      }
      return currentState;
    case LAMODA.REMOVE_ALL_TASKS:
      for (let task in currentState) {
        currentState[task].checkout!.setStop = !action.payload.isRun;
      }
      currentState = {};
      localStorage.setItem('lamodaTasks', JSON.stringify({}));
      return {};
    default:
      return state;
  }
};

export const LamodaTaskDispatcher = (
  type:
    | 'ADD_TASK'
    | 'REMOVE_TASK'
    | 'EDIT_TASK'
    | 'ADD_CHECKOUT'
    | 'EDIT_CHECKOUT_STATE'
    | 'ADD_PIDS'
    | 'RUN_STOP_TASK'
    | 'RUN_STOP_ALL_TASKS'
    | 'REMOVE_ALL_TASKS'
    | 'EDIT_ALL_CHECKOUTS_STATE',
  payload: Partial<LamodaTaskInterface> & {
    taskId: string;
    isRun?: boolean;
    message?: LamodaTaskInterface['currentCheckoutState'];
  }
) => {
  return { type, payload };
};
