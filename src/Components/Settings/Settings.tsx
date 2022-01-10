import { ipcRenderer, remote } from 'electron';
import React, { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { WebhookClient, MessageEmbed } from 'discord.js';
import '../../scss/buttons.global.scss';
import '../../scss/input.global.scss';
import '../../scss/background.global.scss';
import './scss/settings.global.scss';
import { useAppDispatch, useAppSelector } from '../../store';
import { EDIT_SETTINGS } from '../../store/settingsReducer';
import { Dispatch } from 'redux';
import { AUTHSERVER } from '../../index';
import mainLogo from '../../images/logo.svg';
import { SettingsInterface } from '../../Interfaces/interfaces';

import Noty from 'noty';

const Settings = () => {
  const dispatch = useAppDispatch();
  const settingsStorage = useAppSelector((state) => state.settings);
  const proxyProfiles = useAppSelector((state: any) => state.proxy);
  const [settings, setSettings] = useState(settingsStorage);
  const logout = () =>
    fetch(`${AUTHSERVER}/auth/logout`, {
      headers: {
        accept: '*/*',
        'accept-language': 'ru',
        'content-type': 'application/json',
      },
      referrerPolicy: 'no-referrer-when-downgrade',
      body: JSON.stringify({
        key: localStorage.getItem('key'),
      }),
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((r: any) => r.json())
      .then((r) => {
        if (r.success) {
          localStorage.removeItem('key');
          ipcRenderer.send('deleteKey');
          ipcRenderer.send('logout');
          let currentWindow = remote.BrowserWindow.getFocusedWindow();
          let windows = remote.BrowserWindow.getAllWindows();
          windows.forEach((window, id) =>
            id == currentWindow?.id ? null : window.show()
          );
          currentWindow?.hide();
          console.log('logged out');
        } else throw new Error('Failed to log out');
      })
      .catch((e: any) => console.log(e));
  const logoutHandler = (event: FormEvent) => {
    event.preventDefault();
    logout();
  };
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let currentSettings = { ...settings };
    switch (event.target.id) {
      case 'discordWebhook':
        currentSettings.discordWebhook = event.target.value;
        break;
      case 'captchaKey':
        currentSettings.captchaKey = event.target.value;
        break;
      case 'monitorsDelay':
        currentSettings.monitorsDelay = parseInt(event.target.value);
        break;
      case 'monitorProxyProfile':
        currentSettings.monitorProxyProfile = event.target.value;
        break;

      default:
        break;
    }
    return setSettings(currentSettings);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: EDIT_SETTINGS, payload: { ...settings } });
  };
  const handleTest = (_event: MouseEvent<HTMLButtonElement>) => {
    if (!settings.discordWebhook?.length) {
      return;
    }

    const embed = new MessageEmbed();
    embed
      .addFields({
        name: 'time',
        value: `${(new Date(Date.now()) + '').split('GMT')[0]} по мск`,
      })
      .setThumbnail(
        'https://sun9-28.userapi.com/impg/nPTvNuJPXuxzuDfXCpqTh0y21PEg7reAEg_WuQ/Nv-MnC8JH8M.jpg?size=810x1080&quality=96&sign=1747c278d54626d22ed3776c0985c241&type=album'
      )
      .setAuthor(`test webhook`)
      .setFooter(
        'Net Aio bot',
        'https://sun9-28.userapi.com/impg/nPTvNuJPXuxzuDfXCpqTh0y21PEg7reAEg_WuQ/Nv-MnC8JH8M.jpg?size=810x1080&quality=96&sign=1747c278d54626d22ed3776c0985c241&type=album'
      );
    new WebhookClient(
      settings.discordWebhook!.split('webhooks/')[1].split('/')[0],
      settings.discordWebhook!.split('webhooks/')[1].split('/')[1]
    ).send({ embeds: [embed] });
  };
  // dispatch({type:EDIT_TASK,payload:{...edit}})

  // new Noty({
  //   text: 'хуй',
  // }).show();

  return (
    <div
      className="tab-pane fade"
      id="v-pills-settings"
      role="tabpanel"
      aria-labelledby="v-pills-settings-tab"
    >
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <br />
      <div className="container row">
        <div className="col-3">
          <img src={mainLogo} className="rounded" alt="..." />
        </div>
        <form onSubmit={handleSubmit} className="col-8">
          <h2 className="">Settings</h2>
          <h6 className="">AntiCaptha key</h6>
          <input
            onChange={handleChange}
            value={settings?.captchaKey}
            className="net_input"
            type="text"
            id="captchaKey" /* required */
          />
          <h6 className="">Discord webhook</h6>
          <input
            onChange={handleChange}
            value={settings?.discordWebhook}
            className="net_input col-8 raw-1"
            type="text"
            id="discordWebhook" /* required */
          />
          <button
            style={{
              marginLeft: '4.4rem',
            }}
            onClick={handleTest}
            className="net_button_primary raw-1 col"
            id="testWebhook"
          >
            test
          </button>
          <h6 className="">Monitors delay (ms)</h6>
          <input
            onChange={handleChange}
            type="number"
            min="0"
            value={settings?.monitorsDelay}
            className="net_input col raw-2"
            id="monitorsDelay"
            required
          />
          <label htmlFor="proxyProfile" className="form-label ">
            Monitors proxy
          </label>
          <select
            value={settings.monitorProxyProfile}
            onChange={handleChange}
            className="net_select raw-3 col"
            id="monitorProxyProfile"
            required={true}
          >
            <option value="">Выбрать...</option>
            {Object.keys(proxyProfiles).map((profile: string, index) => (
              <option key={index} value={profile}>
                {profile}
              </option>
            ))}
          </select>
          <button
            style={{ marginTop: '1rem' }}
            type="submit"
            className="net_button_primary raw-4 col"
            id="saveSettings"
          >
            Save
          </button>
        </form>
        <div className="footer">
          <button
            onClick={logoutHandler}
            className="net_button_danger logout_button"
            id="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
