import React, { Component } from 'react'
import { Card, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { withRouter } from "react-router-dom";
@inject('SettingsStore')
@observer
@withRouter
class Home extends Component {
    constructor (props) {
        super(props)
  
        this.state = {
          settings: ''
        }
    }

    componentDidMount = () => {
        this.getSettings()
    }

    getSettings = async () => {
        await this.props.SettingsStore.getSettings()
        const settings = this.props.SettingsStore.settings
        this.setState({settings})
    }

    render() {
        const orgName = this.state.settings.name || 'Catalyst Platform'
        const domain = this.state.settings.domain || ''
        const isSettingsSet = this.state.settings ? true : false

        return (
            <Card title='Home page'>
                <div id='tabsContent' style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <h1>Greetings from <span style={{color: 'orange'}}>{orgName}</span>! You are on the home page 🚀</h1>
                    {!isSettingsSet && 
                    <div>
                        <h2>To start working, you should set initial settings on <span style={{color: 'violet'}}>Settings</span> page</h2>
                        <Button ghost type='primary' onClick={() => {this.props.history.push("/settings"); this.forceUpdate()}}>Go to Settings</Button>
                    </div>}
                    {isSettingsSet && 
                        <h2>You can change you organization name <span style={{color: 'orange'}}>{orgName}</span> and domain <span style={{color: '#68A5DC'}}>{domain}</span> on Settings page</h2>
                    }
                </div>
            </Card>
        );
    }
}

export default withRouter(Home);