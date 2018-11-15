import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import PeersStore from './stores/PeersStore.js'
import ChannelsStore from './stores/ChannelsStore.js'
import SettingsStore from './stores/SettingsStore.js'
import Grid from './Components/Grid/index.js'
import * as ENDPOINTS from './endpoints.js'

class App extends Component {
    componentDidMount = () => {
        let sseSource = new EventSource(ENDPOINTS.sseURL, { withCredentials: false })
        let myReadyState = sseSource.readyState
        console.log(`Begin myReadyState = ${myReadyState}`)

        sseSource.onmessage = (e) => {
           console.log(`message: ${e.data}`)
        }

        sseSource.onerror = (e) => {
            let evt = e || event
            let msg = ''
            console.log(`!!! evt.target.readyState = ${evt.target.readyState}`)
            switch( evt.target.readyState ){
                case EventSource.CONNECTING:
                    msg = 'Reconnecting…'
                    break

                case EventSource.CLOSED:
                    msg = 'Connection failed. Will not retry.'
                    break;
                case EventSource.OPEN:
                    msg = 'Connection is opened'
                    break
            }
            console.log(`Error: ${msg}`)
        }

        sseSource.onopen = (e) => {
            console.log(`Open message: ${e.target.value}, myReadyState: ${myReadyState}`)
        }
    }

    render() {
        const stores = {
            PeersStore: PeersStore,
            ChannelsStore: ChannelsStore,
            SettingsStore: SettingsStore
        }

        return (
            <Provider {...stores}>
                <BrowserRouter>
                    <Grid />
                </BrowserRouter>
           </Provider>
        );
    }
}

export default App