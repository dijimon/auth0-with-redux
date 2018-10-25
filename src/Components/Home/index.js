import React, { Component } from 'react'
import { Card } from 'antd';

export default class Home extends Component {

    render() {
        const orgName = window.localStorage.getItem('orgName') || 'Catalyst Fabric'
        return (
            <Card title='Home page'>
                <div id='tabsContent' style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <h1>Hello, {orgName} user! You're on the home page</h1>
                </div>
            </Card>
        );
    }
}