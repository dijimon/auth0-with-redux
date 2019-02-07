import { observable, action } from 'mobx';

class ServerEventsStore {
  @observable serverEvents = []

  @action
  getServerEvents = () => {
    return this.serverEvents
  }

  @action
  isPeerDeleted = (peer) => {
    const isPeerDeleted =  this.serverEvents.findIndex(element => element.includes(peer)) !== -1
    console.log(`isPeerDeleted = ${isPeerDeleted}`)

    return isPeerDeleted
  }
  
  @action
  setServerEvent = (e) => {
    console.log(`setServerEvent, e = ${e}`)
    this.serverEvents.push(e)
  }
}

const singleton = new ServerEventsStore();
export default singleton;