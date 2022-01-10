import { useAppDispatch, useAppSelector } from '../../store';
import React, { useState } from 'react';
// import { EDIT_CHECKOUT_STATE, REMOVE_TASK, RUN_STOP_TASK } from '../../store/allTasksReducer'
import './tasks.global.scss';
import { RaffleTaskInterface } from '../../Interfaces/interfaces';
import { Dispatch } from 'redux';
import {
  ONCE_RAFFLE_TASK,
  RaffleDispatcher,
  REMOVE_RAFFLE_TASK,
  START_STOP_RAFFLE_TASK,
} from '../../store/raffleReducer';
import { TravisRaffle } from '../../scripts/raffles/travis';
const Raffle = (props: { id: string }) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.raffles);
  let handleDelete = () => {
    dispatch(
      RaffleDispatcher('START_STOP_RAFFLE_TASK', {
        id: props.id,
        isRun: false,
      }) /* {
      type: START_STOP_RAFFLE_TASK,
      payload: { id: props.id, isRun: false },
    } */
    );
    dispatch(RaffleDispatcher('REMOVE_RAFFLE_TASK', { id: props.id }));
  };
  const [disableStart, setdisableStart] = useState(false);
  let handleStart = () => {
    switch (tasks[props.id].shopType) {
      case 'travis':
        dispatch(
          RaffleDispatcher('ONCE_RAFFLE_TASK', {
            id: props.id,
            task: new TravisRaffle(
              tasks[props.id].accountProfile!,
              tasks[props.id].proxyProfile!,
              tasks[props.id].profile!,
              props.id,
              tasks[props.id].delay
            ),
          })
        );
        setdisableStart(true);
        //   if(!Object.keys(tasks).filter(taskId=>tasks[taskId].isRun&&tasks[taskId].shopType=='shopify'==true).length) {
        //     for (let url of Object.keys(SITES)) new ShopifyMonitor(url).Parse()
        //   }
        break;
      default:
        throw new Error('There is now such shop');
    }
  };
  let handleStop = () => {
    dispatch(
      RaffleDispatcher('START_STOP_RAFFLE_TASK', {
        isRun: false,
      }) /* {
      type: START_STOP_RAFFLE_TASK,
      payload: { id: props.id, isRun: false },
    } */
    );
  };
  return (
    <tr className="" key={props.id}>
      <td>{tasks[props.id]?.shopType}</td>
      <td>{tasks[props.id].accountProfile}</td>
      <td>
        {'success: ' +
          tasks[props.id].status?.success +
          '\nfail: ' +
          tasks[props.id].status?.fail}
      </td>
      <td>
        <div className="btn-group">
          <button
            disabled={disableStart}
            onClick={handleStart}
            className="btn btn-outline-secondary btn-md"
            id="starttasks"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-right"
              viewBox="0 0 16 16"
            >
              <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
            </svg>
          </button>
          <button
            disabled={!disableStart}
            onClick={handleStop}
            className="btn btn-outline-secondary btn-md"
            id="stoptasks"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pause-fill"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
            </svg>
          </button>
          <button
            className="btn btn-outline-secondary btn-md"
            onClick={handleDelete}
            id="DeleteTask"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Raffle;
