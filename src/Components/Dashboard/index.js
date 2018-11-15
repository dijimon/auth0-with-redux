import React, { Component } from 'react'
import { Card } from 'antd';
import PeerDashboard from './peers.js'
import ChannelDashboard from './channels.js'
import './styles.css'

const tabList = [{
        key: 'peers',
        tab: 'Peers'
    },
    {
        key: 'channels',
        tab: 'Channels'
    }]

const contentList = {
        peers: <PeerDashboard />,
        channels: <ChannelDashboard />
    }

export default class Dashboard extends Component {

    state = {
        key: 'peers',
    }
    
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    }

    render() {
        return (
            <Card
              style={{ width: '100%' }}
              tabList={tabList}
              activeTabKey={this.state.key}
              onTabChange={(key) => { console.log('key = ', key); this.onTabChange(key, 'key'); }}
            >
              {contentList[this.state.key]}
            </Card >
        );
    }
}