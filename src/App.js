import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import PeersStore from './stores/PeersStore.js'
import ChannelsStore from './stores/ChannelsStore.js'
import SettingsStore from './stores/SettingsStore.js'
import ServerEventsStore from './stores/ServerEventsStore.js'
import Grid from './Components/Grid/index.js'
import 'ant-design-pro/dist/ant-design-pro.css'
import 'antd/dist/antd.css'

class App extends Component {

    render() {
        const stores = {
            PeersStore: PeersStore,
            ChannelsStore: ChannelsStore,
            SettingsStore: SettingsStore,
            ServerEventsStore: ServerEventsStore
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
