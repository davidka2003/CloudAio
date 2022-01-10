import React, { ChangeEvent, FormEvent, useEffect } from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import AsyncSelect, { Async } from 'react-select/async';
import { Dispatch } from 'redux';
import { Lamoda } from '../../scripts/lamoda/lamoda';
import { sizes } from './AddTask';
import { ToastContainer, toast } from 'react-toastify';
import { LAMODA, LamodaTaskDispatcher } from '../../store/lamodaTasksReducer';

type setAddressCity = {
  hidden: boolean;
  info?: {
    aoid: string;
    title: string;
    regionTitle: string;
    regionAoid: string;
  };
};
type setAddressHouse = {
  hidden: boolean;
  info?: {
    aoid: string;
    title: string;
    apartment: string;
  };
};
const notify = () =>
  toast.info('Task was added', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });
type loginSuccess = {
  email: string;
  phone: string;
  password: string;
};
const AddTaskLamoda = () => {
  const dispatch = useAppDispatch();
  const [city, setCity] = useState<setAddressCity>({
    hidden: false,
  });
  const [auth, setAuth] = useState<{
    login: string;
    password: string;
  }>({
    login: '',
    password: '',
  });
  const [customer, setCustomer] = useState<{
    first_name: string;
    last_name: string;
  }>({
    first_name: '',
    last_name: '',
  });
  const [defautCity, setDefautCity] = useState<
    {
      value: setAddressCity['info'];
      label: string;
    }[]
  >([]);
  useEffect(() => {
    Lamoda.GetRegionsInfo().then((response) =>
      setDefautCity(
        response.map((city) => {
          return {
            value: {
              aoid: city.city.aoid,
              title: city.city.title,
              regionTitle: city.region?.title || city.aoid,
              regionAoid: city.region?.aoid || city.city.title,
            },
            label: city.city.title,
          };
        })
      )
    );
  }, []);
  const [street, setStreet] = useState<setAddressCity>({
    hidden: true,
  });
  const [house, setHouse] = useState<setAddressHouse>({
    hidden: true,
  });
  const createTask = (event: FormEvent) => {
    event.preventDefault();
    if (
      !city.info?.aoid.length &&
      !street.info?.aoid.length &&
      !house.info?.aoid.length &&
      !auth.login.length &&
      !auth.password.length
    )
      return;
    const task = new Lamoda();
    task.Init().then(() => {
      task
        .Login(auth.login, auth.password)
        .then((response: loginSuccess) => {
          console.log(response);

          task.setAddress = {
            region: city.info?.regionTitle || city.info?.title!,
            region_aoid: city.info?.regionAoid || city.info?.aoid!,
            city: city.info?.title!,
            city_aoid: city.info?.aoid!,
            street: street.info?.title!,
            street_aoid: street.info?.aoid!,
            house_number: house.info?.title!,
            house_aoid: house.info?.aoid!,
            apartment: house.info?.apartment!,
          };

          task.setCustomer = {
            phone: response.phone,
            email: response.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
          };
          console.log(task);
        })
        .then(() => task.PreCart('MP002XW0R3NAINL'))
        .catch((error) => {
          console.log(error.error?.message);
        });
    });

    dispatch(
      LamodaTaskDispatcher('ADD_TASK', {
        taskId: '',
        sizes: [],
        pids: [],
        checkout: task,
        address: {
          region: city.info?.regionTitle || city.info?.title!,
          region_aoid: city.info?.regionAoid || city.info?.aoid!,
          city: city.info?.title!,
          city_aoid: city.info?.aoid!,
          street: street.info?.title!,
          street_aoid: street.info?.aoid!,
          house_number: house.info?.title!,
          house_aoid: house.info?.aoid!,
          apartment: house.info?.apartment!,
        },
      })
    );
  };
  const loadCityOptions = (input: string, callback: any) => {
    Lamoda.GetCities(input).then((response) => {
      console.log(response);
      callback(
        response.map((city) => {
          return {
            value: {
              aoid: city.city.aoid,
              title: city.city.title,
              regionTitle: city.region?.title || city.aoid,
              regionAoid: city.region?.aoid || city.city.title,
            },
            label: city.city.title,
          };
        })
      );
    });
  };
  const loadStreetOptions = (input: string, callback: any) => {
    Lamoda.GetStreets(input, city.info?.aoid!).then((response) => {
      console.log(response);
      callback(
        response.map((street) => {
          return {
            value: {
              aoid: street.aoid,
              title: street.street.title,
            },
            label: street.street.title,
          };
        })
      );
    });
  };
  const loadHouseOptions = (input: string, callback: any) => {
    Lamoda.GetHouses(input, street.info?.aoid!).then((response) => {
      console.log(response);
      callback(
        response.map((house) => {
          return {
            value: {
              aoid: house.aoid,
              title: house.house.title,
            },
            label: house.house.title,
          };
        })
      );
    });
  };

  // const profiles:{[key:string]:ProfileInterface} = useAppSelector((state:any)=>state.profiles)
  const proxyProfiles = useAppSelector((state) => state.proxy);
  return (
    <div className="container row">
      <div className="container col-1" />
      <div className="container col-10">
        <form
          onSubmit={createTask}
          className="needs-validation"
          id="createTaskForm"
        >
          <div className="row g-6">
            <h2 className=" text-center">Lamoda</h2>
          </div>
          <br />
          <div className="row g-3">
            <div
              className="col"
              style={{ display: city.hidden ? 'none' : 'block' }}
            >
              <label htmlFor="shopUrl" className="form-label ">
                City
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadCityOptions}
                defaultOptions={defautCity}
                onChange={(event) => {
                  setCity({
                    info: event?.value,
                    hidden: false,
                  });
                  setStreet({ hidden: false });
                }}
                hidden={street.hidden}
                required
              />
            </div>
            <div
              className="col"
              style={{ display: street.hidden ? 'none' : 'block' }}
            >
              <label htmlFor="shopUrl" className="form-label ">
                Street
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadStreetOptions}
                defaultOptions={false}
                onChange={(event) => {
                  setStreet({
                    info: event?.value,
                    hidden: false,
                  });
                  setHouse({ hidden: false });
                }}
                hidden={street.hidden}
                required
              />
            </div>

            <div
              className="col"
              style={{ display: house.hidden ? 'none' : 'block' }}
            >
              <label htmlFor="shopUrl" className="form-label ">
                House number
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadHouseOptions}
                defaultOptions={false}
                onChange={(event) => {
                  setHouse({
                    info: event?.value,
                    hidden: false,
                  });
                }}
                hidden={house.hidden}
                required
              />
            </div>
            <div className="col" hidden={house.hidden}>
              <label htmlFor="negative" className="form-label ">
                Appartment
              </label>
              <input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setHouse({
                    ...house,
                    info: {
                      ...house.info!,
                      apartment: event.target.value,
                    },
                  })
                }
                value={house.info?.apartment || ''}
                placeholder="Apartment"
                type="text"
                className="net_input"
                required
              />
            </div>
            <div className="col" hidden={house.hidden}>
              <label htmlFor="negative" className="form-label ">
                First name
              </label>
              <input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setCustomer({ ...customer, first_name: event.target.value })
                }
                value={customer.first_name}
                placeholder="First name"
                type="text"
                className="net_input"
                required
              />
            </div>
            <div className="col" hidden={house.hidden}>
              <label htmlFor="negative" className="form-label ">
                Last Name
              </label>
              <input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setCustomer({ ...customer, last_name: event.target.value })
                }
                value={customer.last_name}
                placeholder="Last name"
                type="text"
                className="net_input"
                required
              />
            </div>
            <div className="col">
              <label htmlFor="negative" className="form-label ">
                Login
              </label>
              <input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setAuth({ ...auth, login: event.target.value })
                }
                value={auth.login}
                placeholder="Password"
                type="text"
                className="net_input"
                required
              />
            </div>
            <div className="col">
              <label htmlFor="negative" className="form-label ">
                Password
              </label>
              <input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setAuth({ ...auth, password: event.target.value })
                }
                value={auth.password}
                placeholder="Password"
                type="text"
                className="net_input"
                required
              />
            </div>
          </div>
          <br />
          <button
            type="submit"
            style={{
              display:
                house.hidden || street.hidden || city.hidden ? 'none' : 'block',
            }}
            className="net_button_primary"
            id="newSoleboxTaskButton"
          >
            Save
          </button>
          <br />
        </form>
      </div>
      <div className="container col-1" />
    </div>
  );
};

export default AddTaskLamoda;
