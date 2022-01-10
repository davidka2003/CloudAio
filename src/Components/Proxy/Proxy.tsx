import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { Dispatch } from 'redux';
import { ProxyProfileInterface } from '../../Interfaces/interfaces';
import {
  ADD_PROXY_PROFILE,
  ProxyDispatcher,
  REMOVE_PROXY_PROFILE,
} from '../../store/proxyProfilesReducer';

const Proxy = () => {
  const [proxyProfile, setproxyProfile] = useState({
    proxy: '',
    profileName: '',
  });
  const dispatch = useAppDispatch();
  const proxyProfiles = useAppSelector((state) => state.proxy);
  const deleteProfileHandler = (profileName: string) => {
    return dispatch(
      ProxyDispatcher('REMOVE_PROXIE_PROFILE', { profileName })
      /* {
      type: REMOVE_PROXY_PROFILE,
      payload: { ...proxyProfiles[profileName] },
    } */
    );
  };
  const changeHandler = (
    event: ChangeEvent<HTMLTextAreaElement & HTMLInputElement>
  ) => {
    let currentProxyProfile = { ...proxyProfile };
    switch (event.target.id) {
      case 'proxy':
        currentProxyProfile.proxy = event.target.value;
        break;
      case 'profileName':
        currentProxyProfile.profileName = event.target.value;
        break;
      default:
        break;
    }
    // console.log(currentProxyProfile)
    return setproxyProfile(currentProxyProfile);
  };
  const submitHandler = (event: FormEvent) => {
    event?.preventDefault();
    let currentProxyProfile = { ...proxyProfile };
    /* format proxy */
    let formatedProxy = currentProxyProfile.proxy
      .replace(/\s+/g, ' ')
      .replace(/"|'|`/g, '')
      .trim()
      .split(/ |\n|;|\||,/g)
      .map((proxy) => {
        if (proxy.length) {
          //   console.log(proxy,proxy.split(/https:\/\/|http:\/\/|:|@/g))
          const [login, password, ip, port] = proxy
            .split(/https:\/\/|http:\/\/|:|@/g)
            .filter((chunk) => chunk?.length);
          return 'http://' + login + ':' + password + '@' + ip + ':' + port;
        }
        return;
      })
      .filter((proxy) => proxy) as ProxyProfileInterface['proxy'];
    return dispatch(
      ProxyDispatcher('ADD_PROXIE_PROFILE', {
        profileName: currentProxyProfile.profileName,
        proxy: formatedProxy,
      })
    );
  };
  return (
    <div
      className="tab-pane fade"
      id="v-pills-proxies"
      role="tabpanel"
      aria-labelledby="v-pills-proxies-tab"
    >
      <div className="container">
        <h4 className="mb-3 mt-3">Saved proxies</h4>
        <table className="table table-striped col">
          <thead>
            <tr>
              {/* <th>№</th> */}
              <th>Profile</th>
              <th>Proxy</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="proxiesTable">
            {Object.keys(proxyProfiles)
              .filter((proxy) => proxy != 'noProxy')
              .map((profileName, index) => (
                <tr key={index} className="">
                  <td>{profileName}</td>
                  <td>{proxyProfiles[profileName].proxy[0]}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        onClick={() => deleteProfileHandler(profileName)}
                        className="delete_icon_button"
                        id="DeleteProxyProfile"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
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
                      {/* <button className="edit_icon_button" data-bs-toggle="modal" data-bs-target="#editProxyProfile">
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16}  className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                            </button> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <br />
        <h4 className="">
          Add proxy
          <button
            className="icon_button"
            data-bs-toggle="modal"
            data-bs-target="#proxyInfo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              className="bi bi-info-lg"
              viewBox="0 0 16 16"
            >
              <path d="m10.277 5.433-4.031.505-.145.67.794.145c.516.123.619.309.505.824L6.101 13.68c-.34 1.578.186 2.32 1.423 2.32.959 0 2.072-.443 2.577-1.052l.155-.732c-.35.31-.866.434-1.206.434-.485 0-.66-.34-.536-.939l1.763-8.278zm.122-3.673a1.76 1.76 0 1 1-3.52 0 1.76 1.76 0 0 1 3.52 0z" />
            </svg>
          </button>
        </h4>
        <form onSubmit={submitHandler} className="needs-validation">
          <label htmlFor="#proxyName">Proxy profile name</label>
          <input
            className="net_input"
            onChange={changeHandler}
            type="text"
            id="profileName"
            required={true}
          />
          <textarea
            onChange={changeHandler}
            className="form-control"
            style={{ height: '200px' }}
            placeholder="Add proxy or proxies in (login password host port) format"
            aria-label="With textarea"
            id="proxy"
            defaultValue={''}
            required={true}
          />
          <br />
          <button className="net_button_primary" id="addProxy" type="submit">
            Save
          </button>
        </form>
      </div>
      <div
        className="modal fade"
        id="proxyInfo"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Proxy format
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              "Add proxy or proxies in (login password host port) format"
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="net_button_secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Proxy;
