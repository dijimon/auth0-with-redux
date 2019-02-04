import React, { Component } from 'react'
import { Card, Button } from 'antd'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { DEFAULT_PLATFORM_NAME } from './../../constants.js'
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
        const orgName = this.state.settings  && this.state.settings.name ? this.state.settings.name : DEFAULT_PLATFORM_NAME
        const domain = this.state.settings && this.state.settings.domain ? this.state.settings.domain : ''
        const isSettingsWereSet = this.props.SettingsStore.isSettingsWereSet

        return (
            <Card title='Home page'>
                <div id='tabsContent' style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <h1>Greetings from <span style={{color: 'orange'}}>{orgName}</span>! You are on the home page 🚀</h1>
                    {!isSettingsWereSet && 
                    <div>
                        <h2>To start working, please set initial settings</h2>
                        <Button ghost type='primary' onClick={() => {this.props.history.push("/settings"); this.forceUpdate()}}>Go to Settings</Button>
                    </div>}
                    {isSettingsWereSet && 
                        <h2>You can change you organization name <span style={{color: 'orange'}}>{orgName}</span> and domain <span style={{color: '#68A5DC'}}>{domain}</span> on Settings page</h2>
                    }
                </div>
            </Card>
        );
    }
}

export default withRouter(Home);