import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout } from 'antd'
import PropTypes from 'prop-types'
import { DEFAULT_PLATFORM_NAME } from './../../constants'

const { Header } = Layout

@inject('SettingsStore')
@observer
class TheHeader extends Component {
    constructor (props) {
      super(props)

      this.state = {
        title: DEFAULT_PLATFORM_NAME
      }
    }

    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      })
    }

    componentDidMount = () => {
      this.getTitle()
    }

    getTitle = () => {
      this.props.SettingsStore.getSettings().then(() => {
        const orgName = this.props.SettingsStore.name
        this.setState({title: orgName})
      })
    }

    render() {
        const orgName = this.props.SettingsStore.name || DEFAULT_PLATFORM_NAME

        return (
            <Layout>
                <Header className="mainHeader" style={{ background: '#fff', padding: 0 }}>
                  <div style={{ background: '#fff', paddingLeft: 50, margin: 'auto' }}>
                    {orgName}
                  </div>
                </Header>
          </Layout>
        );
    }
}

export default TheHeader