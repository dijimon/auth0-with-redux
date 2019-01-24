import { observable, action } from 'mobx';
import axios from './../services/axios'
import * as ENDPOINTS from './../endpoints'

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
  }
};

class SettingsStore {
  @observable settings

  // @observable settings = {
  //   orgName: window.localStorage.getItem('orgName') || 'Catalyst Fabric',
  //   domain: window.localStorage.getItem('domain') || 'domain',
  //   importedCrypto: '',
  //   exportedCrypto: ''
  // }

  @action
  defineOrgName = orgName => {
    this.settings.orgName = orgName
  }

  // @action
  // setDomain = domain => {
  //   this.settings.domain = domain
  // }

  @action
  getOrgName = () => {
    return this.settings.orgName
  }

  @action
  getDomain = () => {
    return '@'.concat(this.settings.domain).concat('.com')
  }

  @action
  getSettings = () => {
    const url = `${ENDPOINTS.baseURL}/api/v1/settings`
    return axios.get(url, {}, axiosConfig)
    .then((response) => {
      console.log('GET SETTINGS response ->', response)
      this.settings = response.data
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
  }
  
  @action
  setOrgNameAndDomain = (settings) => {
    const url = `${ENDPOINTS.baseURL}/api/v1/settings`
    const settingsData = {
      name: settings.name,
      domain: settings.domain
    };
    
    return axios.post(url, settingsData, axiosConfig)
    .then((response) => {
      console.log('SET SETTINGS response ->', response)
      this.settings = response.data
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
  }
}

const singleton = new SettingsStore();
export default singleton;