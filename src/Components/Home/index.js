import React, { Component } from 'react'
import { Card } from 'antd';

export default class Home extends Component {

    render() {
        const orgName = window.localStorage.getItem('orgName') || 'Catalyst Fabric'
        const domain = window.localStorage.getItem('domain') || ''
        return (
            <Card title='Home page'>
                <div id='tabsContent' style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <h1>Hello, {orgName} user! You're on the home page</h1>
                    <h2>P.S. You can change you organization name <span style={{color: 'orange'}}>{orgName}</span> and domain <span style={{color: '#68A5DC'}}>{domain}</span> on Settings page</h2>
                </div>
            </Card>
        );
    }
}