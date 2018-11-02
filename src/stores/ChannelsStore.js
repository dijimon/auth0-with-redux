import { observable, action, computed } from 'mobx';
import axios from 'axios'
// import axios from './../services/axios'
import * as ENDPOINTS from './../endpoints'
class ChannelsStore {
  @observable channels = this.generateMockChannels(100)

  generateMockChannels = (n) => {
    const data = [];
    for (let i = 0; i < n; i++) {
      data.push({
        key: i.toString(),
        name: `channel-${i}`,
        peers: `peer-${i}, peer-${i+1}`,
        chaincodes: `test_chaincode-${i}`
      });
    }
    return data
  }

  @action
  addChannel = channel => {
    this.channels.push(channel)
  };

  @action
  getChannels = () => {
    return this.channels
  }

  @action
  updateChannel = (key, newData) => {
    const channelForUpdate = this.channels[key]
    for (let key in channelForUpdate) {
        channelForUpdate[key] = newData[key]
    }
  }

  @action
  deleteChannel = (key) => {
    const deleted = this.channels.splice(key, 1)
    console.log('deleted  = ', deleted)
    console.log('Peers = ', this.channels)
  }

  @computed
  get channelsCount() {
    return this.channels.length
  }
}

const singleton = new ChannelsStore();
export default singleton;