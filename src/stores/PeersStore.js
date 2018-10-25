import { observable, action, computed } from 'mobx';

class PeersStore {
  @observable peers = []

  @action
  addPeer = peer => {
    this.peers.push(peer)
  };

  @computed
  get peerCount() {
    return this.peers.length
  }
}

const singleton = new PeersStore();
export default singleton;