import { observable, action } from 'mobx';

class ServerEventsStore {
  @observable serverEvents = []

  @action
  getServerEvents = () => {
    return this.serverEvents
  }

  @action
  isPeerDeleted = (peer) => {
    const peerDeleteRecord = this.serverEvents.findIndex(element => JSON.parse(element).type === 'podDeleted')
    const isServerSentDeleteMsg = peerDeleteRecord !== -1
    const isPeerNameInMsg = isServerSentDeleteMsg ? this.serverEvents[peerDeleteRecord].includes(peer) !== -1 : false
    const isPeerDeleted = isServerSentDeleteMsg && isPeerNameInMsg
    // console.log(`SERVER_EVENT_STORE: isPeerDeleted = ${isPeerDeleted}: isServerSentDeleteMsg = ${isServerSentDeleteMsg}, isPeerNameInMsg = ${isPeerNameInMsg}`)
    if (isPeerDeleted) {
        const serverEventsWithoutDeleted = this.serverEvents.filter(event => !JSON.parse(event).value.includes(peer))
        this.serverEvents = serverEventsWithoutDeleted
    }

    return isPeerDeleted
  }
  
  @action
  setServerEvent = (e) => {
    if (e !== 'Opened') this.serverEvents.push(e) 
  }
}

const singleton = new ServerEventsStore();
export default singleton;