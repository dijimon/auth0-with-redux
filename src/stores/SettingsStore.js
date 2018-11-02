import { observable, action } from 'mobx';

class SettingsStore {
  @observable settings = {
      orgName: window.localStorage.getItem('orgName') || 'Catalyst Fabric',
      domain: window.localStorage.getItem('domain') || 'domain',
      importedCrypto: '',
      exportedCrypto: ''
    }

  @action
  defineOrgName = orgName => {
    this.settings.orgName = orgName
  }

  @action
  setDomain = domain => {
    this.settings.domain = domain
  }

  @action
  getOrgName = () => {
    return this.settings.orgName
  }

  @action
  getDomain = () => {
    return '@'.concat(this.settings.domain).concat('.com')
  }

}

const singleton = new SettingsStore();
export default singleton;