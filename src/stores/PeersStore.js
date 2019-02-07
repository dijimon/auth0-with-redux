import { observable, action, computed } from 'mobx';
// import axios from 'axios'
import axios from './../services/axios'
import * as ENDPOINTS from './../endpoints'

class PeersStore {
  @observable peers = []
  @observable hasError = false

  @action
  addPeer = async peer => {
    const url = `${ENDPOINTS.baseURL}${ENDPOINTS.peers}`
    return axios.post(url, {'name': peer['name']})
    .then((response) => {
      console.log('ADD PEER response ->', response)
      this.peers.push(response.data)
      if(response.status === 200 || response.status === 201) {
        this.peers.push(response.data)
        return response
        // return response.data
      } else {
        return response
      }
    })
    .catch((error) => {
      console.error(error)
      return error
    })
  };

  @action
  getPeers = () => {
    const url = `${ENDPOINTS.baseURL}/api/v1/peers`
    return axios.get(url)
    .then((response) => {
      console.log('GET PEERS response ->', response)
      this.peers = response.data
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @action
  updatePeer = (peer, key) => {
    console.log('In updatePeer, newInfo = ', peer, key)
    console.log('!! key = ', key)
    const url = `${ENDPOINTS.baseURL}${ENDPOINTS.peers}/${key}`
    return axios.put(url, {'name': peer['name'], 'channels': peer['channels']})
    .then((response) => {
      console.log('UPDATE PEER response ->', response)
      if(response.status === 200 || response.status === 204) {
        this.peers.push(response.data)
        return response.data
      } else {
        this.hasError = true
        return response
      }
    })
    .catch((error) => {
      console.log(error)
      return error
    })
    
  }

  @action
  deletePeer = (key) => {
    const url = `${ENDPOINTS.baseURL}${ENDPOINTS.peers}/${key}`
    return axios.delete(url)
    .then((response) => {
      console.log('DELETED response ->', response)
      if (response.statue === 200 || response.statue === 204) {
        const filteredPeers = this.peers.filter(item => item.uid !== key)
        this.peers = filteredPeers
      } else {
        this.hasError = true
        return response.message
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @computed
  get peersCount() {
    return this.peers.length
  }
}

const singleton = new PeersStore();
export default singleton;