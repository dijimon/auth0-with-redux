import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

class TheMenu extends Component {
    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }),
    }

    constructor (props) {
      super(props)
  
      this.state = {
        collapsed: false,
        theme: this.props.theme,
        current: '1',
      }
    }

    componentWillReceiveProps (nextProps) {
      const {theme, current} = nextProps
      this.setState({
        theme: theme,
        current: current
      });
    }
    
    toggleCollapsed = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    }

    changeTheme = (value) => {
        this.setState({
          theme: value ? 'dark' : 'light',
        });
    }
    
    handleClick = (e) => {
      console.log('click ', e.key);
      this.setState({
        menuKey: e.key,
        current: e.kay
      })
    }

    onCollapse = (collapsed) => {
      console.log(collapsed);
      this.setState({ collapsed });
    }

    render() {
        return (
          <Menu
              defaultSelectedKeys={['0']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme={this.state.theme}
              style={{ maxWidth: 256 }}
              // selectedKeys={[this.state.current.toString()]}
              inlineCollapsed={this.state.collapsed}
              onClick={this.props.handleMenuClick}
              onChange={this.props.handleMenuClick}
            >
              <Menu.Item key="1">
                <Icon type="radar-chart" />
                <span>Peers</span>
                <NavLink exact to="/peers" />
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="team" />
                <span>Orderers</span>
                <NavLink to="/orderers" />
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="file-done" />
                <span>CAs</span>
                <NavLink to="/cas" />
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="block" />
                <span>Channels</span>
                <NavLink to="/channels" />
              </Menu.Item>
              <Menu.Item key="5">
                <Icon type="branches" />
                <span>Chaincodes</span>
                <NavLink to="/chaincodes" />
              </Menu.Item>
              <Menu.Item key="6">
                <Icon type="setting" />
                <span>Settings</span>
                <NavLink to={`/settings`} className={'navLink'} activeClassName={'active'}>Setting</NavLink>
              </Menu.Item>
            </Menu>
        );
    }
}

export default TheMenu