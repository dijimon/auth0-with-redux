import { observable, action, computed } from 'mobx';
import axios from 'axios'
// import axios from './../services/axios'
import * as ENDPOINTS from './../endpoints'

class PeersStore {
  //@observable peers = []
  // @observable peers = this.generateMockPeers(5)
  @observable peers = []

  generateMockPeers = (n) => {
    const data = [];
    for (let i = 0; i < n; i++) {
      data.push({
        key: i.toString(),
        uid: i.toString(),
        name: `peer-${i}`,
        url: `peer-${i}.domain.com`,
        channels: `channel-${i}, channel-${i+1}`,
        status: 'ok'
      });
    }
    return data
  }

  @action
  addPeer = async peer => {
    const url = `https://cors.io/?${ENDPOINTS.baseURL}${ENDPOINTS.peers}`
    const config = {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      }
    }

    const response = await axios.post(url, config)
    const responseJSON = await response.json()

    console.log('response ', response)
    console.log('responseJSON', responseJSON)

    this.peers.push(peer)
  };

  @action
  getPeers = () => {
    const url = `https://cors.io/?${ENDPOINTS.baseURL}/api/v1/peers`
    return axios.get(url)
    .then((response) => {
      console.log('response ->', response)
      this.peers = response.data
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
  }

  // @action
  // getPeers = () => {
  //   const url = `https://cors.io/?${ENDPOINTS.baseURL}${ENDPOINTS.peersEndoint}`
  //   axios.defaults.headers.post['crossDomain'] = true;
  //   return axios
  //     .get(url, {
  //       headers: {
  //       'Access-Control-Allow-Origin' : '*',
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Methods': 'GET, OPTIONS'
  //     }})
  //     .then(response => {
  //       console.log('action getPeers, response: ', response)
  //       console.log(response.data);
  //       console.log(response.status);
  //       console.log(response.statusText);
  //       console.log(response.headers);
  //       console.log(response.config);
  //       // if (response.jdata.status === 200) {
  //       //   this.peers = response.data.json()
  //       // }
  //       // return response.json()
  //     })
  //     // .catch(e => {
  //     //   console.error('ERROR from getPeers: ->', e)
  //     // })
  // }

  @action
  updatePeer = (key, newData) => {
    const peerForUpdate = this.peers[key]
    for (let key in peerForUpdate) {
      peerForUpdate[key] = newData[key]
    }
  }

  @action
  deletePeer = (key) => {
    console.log('!!! In deleted store', key)
    // const deleted = this.peers.filter(item => !valuesToRemove.includes(item))
    const filteredPeers = this.peers.filter(item => item.uid !== key)
    this.peers = filteredPeers
    console.log('Peers = ', this.peers)

    const url = `https://cors.io/?${ENDPOINTS.baseURL}${ENDPOINTS.peers}/${key}`
    return axios.delete(url)
    .then((response) => {
      console.log('response ->', response)
      this.peers = response.data
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @computed
  get peersCount() {
    // return this.peers.length
    return Number('7')
  }
}

const singleton = new PeersStore();
export default singleton;