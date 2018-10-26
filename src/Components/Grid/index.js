import React, { Component } from 'react';
import { Route, NavLink, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Layout, Switch } from 'antd'

import Peers from './../Peers/index.js'
import Orderers from './../Orderers/index.js'
import CAs from './../CAs/index.js'
import Channels from './../Channels/index.js'
import Chaincodes from './../Chaincodes/index.js'
import Settings from './../Settings/index.js';
import TheMenu from './../TheMenu/index.js';
import Home from './../Home/index.js';
import logo from './../../assets/logo.png'
import './styles.css'

const { Header, Content, Footer, Sider } = Layout
@inject('SettingsStore')
@observer
class Grid extends Component {
    constructor (props) {
        super(props)
    
        this.state = {
          collapsed: false,
          theme: 'dark',
          current: 4
        }
    }

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
      }

    changeTheme = (value) => {
        this.setState({
          theme: value ? 'dark' : 'light',
        });
    }

    getOrgName = () => {
      const orgName = this.props.SettingsStore.settings.orgName
      const orgNameFromLS = window.localStorage.getItem('orgName')
      console.log('!!! orgName', orgName)
      console.log('!!! this.props.SettingsStore', this.props.SettingsStore)
  
  
      return orgName ? orgName : (orgNameFromLS ? orgNameFromLS : 'Catalyst Fabric')
    }

    render() {
        const orgName = this.getOrgName()

        return (
            <Layout className="rootContainer">
                <Sider
                  collapsible
                  collapsed={this.state.collapsed}
                  onCollapse={this.onCollapse}
                  className={this.state.theme === 'dark' ? 'menuOptionsDark' : 'menuOptionsLight'}
                  theme={this.state.theme}
                >
                    <div className='logoContainer'>
                      <div className={this.state.collapsed ? 'logoSmall' : 'logoBig'}>
                          <NavLink to="/"><img src={logo} alt="logo" /></NavLink>
                      </div>
                    </div>
                    <div style={{margin: 10, minHeight: 35}}>
                      <Switch
                        style={this.state.collapsed ? {display: 'none'} : {display: 'inline-block'}}
                        checked={this.state.theme === 'dark'}
                        onChange={this.changeTheme}
                        checkedChildren="dark"
                        unCheckedChildren="light"
                      />
                    </div>
                    <TheMenu theme={this.state.theme} mode="inline" defaultSelectedKeys={['1']} current={this.state.current} />
                    <div style={{margin: 10}} className={this.state.theme === 'dark' ? 'menuOptionsDark' : 'menuOptionsLight'}></div>
                </Sider>
                <Layout>
                <Header className="mainHeader" style={{ background: '#fff', padding: 0 }}>
                  <div style={{ background: '#fff', paddingLeft: 50, margin: 'auto' }}>
                    {orgName}
                  </div>
                </Header>
                <Content style={{ margin: '5px' }}>
                    <Route exact path="/" component={Home} />
                    <Route path="/orderers" component={Orderers} />
                    <Route path="/peers" component={Peers} />
                    <Route path="/cas" component={CAs} />
                    <Route path="/channels" component={Channels} />
                    <Route path="/chaincodes" component={Chaincodes} />
                    <Route path="/settings" component={Settings} />
                    <Redirect from='*' to='/' />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  Created by IntellectEU ©2018
                </Footer>
                </Layout>
          </Layout>
        );
    }
}

export default Grid