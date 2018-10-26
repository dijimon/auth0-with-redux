import { observable, action, computed } from 'mobx';

class PeersStore {
  @observable peers = this.generateMockPeers(5)

    generateMockPeers = (n) => {
      const data = [];
      for (let i = 0; i < n; i++) {
        data.push({
          key: i.toString(),
          name: `peer-${i}`,
          url: `peer-${i}.domain.com`,
          channels: `channel-${i}, channel-${i+1}`,
          status: 'ok'
        });
      }
      return data
    }

  @action
  addPeer = peer => {
    this.peers.push(peer)
  };

  @action
  getPeers = () => {
    return this.peers
  }

  @action
  updatePeer = (key, newData) => {
    const peerForUpdate = this.peers[key]
    for (let key in peerForUpdate) {
      peerForUpdate[key] = newData[key]
    }
  }

  @action
  deletePeer = (key) => {
    const deleted = this.peers.splice(key, 1)
    console.log('deleted  = ', deleted)
    console.log('Peers = ', this.peers)
  }

  @computed
  get peersCount() {
    // return this.peers.length
    return Number('7')
  }
}

const singleton = new PeersStore();
export default singleton;