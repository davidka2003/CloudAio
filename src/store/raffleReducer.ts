import { v4 as id } from 'uuid';
export const EDIT_RAFFLE_STATE = 'EDIT_RAFFLE_STATE';
export const ADD_RAFFLE_TASK = 'ADD_RAFFLE_TASK';
export const START_STOP_RAFFLE_TASK = 'START_STOP_RAFFLE_TASK';
export const ONCE_RAFFLE_TASK = 'ONCE_RAFFLE_TASK';
export const REMOVE_RAFFLE_TASK = 'REMOVE_RAFFLE_TASK';
import { ActionType } from '.';
import { RaffleTaskInterface } from '../Interfaces/interfaces';
export const defaultState: { [raffleId: string]: RaffleTaskInterface } =
  JSON.parse(localStorage.getItem('raffles')!) || {};
export const raffleReducer = (
  state = defaultState,
  action: ReturnType<typeof RaffleDispatcher>
) => {
  let currentState: typeof state;
  switch (action.type) {
    case EDIT_RAFFLE_STATE:
      currentState = { ...state };
      if (action.payload.id) {
        if (action.payload.status === 'success') {
          currentState[action.payload.id].status.success++;
        } else if (action.payload.status === 'fail')
          currentState[action.payload.id].status.fail++;
      }
      return currentState;
    case ADD_RAFFLE_TASK:
      currentState = {
        ...state,
        [id()]: {
          ...(action.payload as RaffleTaskInterface),
          status: {
            success: 0,
            fail: 0,
          },
        },
      };
      return currentState;
    case REMOVE_RAFFLE_TASK:
      currentState = { ...state };
      action.payload.id && delete currentState[action.payload.id];
      return currentState;
    case ONCE_RAFFLE_TASK:
      currentState = { ...state };
      if (action.payload.id && action.payload.task) {
        currentState[action.payload.id].task = action.payload.task;
        currentState[action.payload.id].isRun = true;
      }
      return currentState;
    case START_STOP_RAFFLE_TASK:
      currentState = { ...state };
      action.payload.id &&
        (currentState[action.payload.id].task!.setStop = !action.payload.isRun);
      return currentState;

    default:
      return state;
  }
};

export const RaffleDispatcher = (
  type:
    | 'EDIT_RAFFLE_STATE'
    | 'ADD_RAFFLE_TASK'
    | 'START_STOP_RAFFLE_TASK'
    | 'ONCE_RAFFLE_TASK'
    | 'REMOVE_RAFFLE_TASK',
  payload: Partial<RaffleTaskInterface> & {
    status?: 'success' | 'fail';
    id?: string;
  }
) => {
  return { type, payload };
};
