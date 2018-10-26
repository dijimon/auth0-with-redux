import { observable, action } from 'mobx';

class SettingsStore {
  @observable settings = {
      orgName: '',
      domain: '',
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
    return this.settings.domain
  }

}

const singleton = new SettingsStore();
export default singleton;