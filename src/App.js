import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import PeersStore from './stores/PeersStore.js'
import ChannelsStore from './stores/ChannelsStore.js'
import SettingsStore from './stores/SettingsStore.js'
import Grid from './Components/Grid/index.js'

class App extends Component {
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