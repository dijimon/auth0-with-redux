import { observable, action, computed } from 'mobx';
import axios from './../services/axios'
import * as ENDPOINTS from './../endpoints'
import { DEFAULT_PLATFORM_NAME } from './../constants'

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
};

class SettingsStore {
  @observable settings

  @computed get name() {
   return this.settings ? this.settings.name : DEFAULT_PLATFORM_NAME
  }

  @computed get domain() {
    return this.settings ? this.settings.domain : ''
  }

  @computed get isSettingsWereSet() {
    return this.settings && this.settings.name && this.settings.domain ? true : false
  }

  @action
  getSettings = () => {
    const url = `${ENDPOINTS.baseURL}/api/v1/settings`
    return axios.get(url, {}, axiosConfig)
    .then((response) => {
      console.log('GET SETTINGS ->', response)
      this.settings = response.data
      return response.data
    })
    .catch((error) => {
      console.error(error)
      return error
    })
  }
  
  @action
  setSettings = (settings) => {
    const url = `${ENDPOINTS.baseURL}/api/v1/settings`
    const settingsData = {
      name: settings.name,
      domain: settings.domain
    };
    
    const response = axios.post(url, settingsData, axiosConfig)
    .then((response) => {
      console.log('SET SETTINGS ->', response)
      this.settings = response.data
      return response.data
    })
    .catch((error) => {
      console.error('Error -> ', error)
      return error
    })

    console.log('RESPONCE -> ', response)
    return response
  }
}

const singleton = new SettingsStore();
export default singleton;