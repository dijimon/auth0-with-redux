import React, { Component } from 'react'
import { Card, Form, Input, Button, Upload, Icon, Alert, message, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'
import './styles.css'

const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const FormItem = Form.Item;

@inject('SettingsStore')
@observer
class Settings extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      isInfo: false,
      isError: false,
      formLayout: 'horizontal',
      settings: {
        domain: '',
        name: ''
      }
    };
  }
  componentDidMount = () => {
    this.getSettings()
    this.handleOrgNameChangingFromSettings = this.props.handleOrgNameChanging 
  }

  componentWillUnmount = () => {
  }

  handleFormLayoutChange = (e) => {
    this.setState({ formLayout: e.target.value });
  }

  handleOrganizationInput = (e) => {
    console.log('this.props.SettingsStore - before', this.props.SettingsStore)
    window.localStorage.setItem('orgName', e.target.value)
    this.props.SettingsStore.defineOrgName(e.target.value)
    console.log('this.props.SettingsStore', this.props.SettingsStore)
  }

  handleDomainInput = (e) => {
    window.localStorage.setItem('domain', e.target.value)
    this.props.SettingsStore.setDomain(e.target.value)
    console.log('this.props.SettingsStore', this.props.SettingsStore)
  }

  getOrgName = () => {
    const orgName = this.props.SettingsStore.settings ? this.props.SettingsStore.settings.name : 'Enter organization name'
    return orgName
  }

  getDomain = () => {
    const domain = this.props.SettingsStore.settings ? this.props.SettingsStore.settings.domain : 'Enter domain'
    return domain 
  }

  getSettings = () => {
    this.props.SettingsStore.getSettings().then(() => {
      const settings = this.props.SettingsStore.settings
      this.setState({settings})
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const message = 'Settings changes are saved'
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.setState({isInfo: true, message: message})
        // const domain = this.props.SettingsStore.setDomain()
        this.props.SettingsStore.setOrgNameAndDomain(values).then(() => {
        // this.props.handleOrgNameChanging(values.name)
        this.handleOrgNameChangingFromSettings(values.name)
        })
        setTimeout(() => {
          this.setState({isInfo: false, message: ''})
        }, 3000)
      } else {
        this.setState({isError: true, message: message})
        setTimeout(() => {
          this.setState({isError: false, message: ''})
        }, 3000)
      }
    });
  }

  render() {
    const { formLayout } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 },
    }
    const ExpImpButtonItemLayout = {
        wrapperCol: { span: 24, offset: 4 },
    }
    console.log('PROPS: ', this.props)
    const { getFieldDecorator } = this.props.form
    const ButtonGroup = Button.Group;
    const organizationNamePlaceholder = this.getOrgName()
    const domainPlaceholder = this.getDomain()
    const { message, isInfo, isError } = this.state
    const infoMessageElement = <Alert style={{marginBottom: 20, transition: 'opacity 0.2s 1s ease' }} message={message || ''}  />
    const errorMessageElement = <Alert style={{marginBottom: 20, transition: 'opacity 0.2s 1s ease' }} message={message || ''}  />
    
    return (
      <Card title="Settings">
              <div id="tabsContent" style={{background: '#fff', minHeight: 360 }}>
        <Row style={{minHeight: 60}}>
          <Col offset={4} span={8}>{isInfo && infoMessageElement || isError && errorMessageElement}</Col>
        </Row>
        <Form layout={formLayout}>
          <Form.Item
            {...formItemLayout}
            label="Organization Name"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, 
                message: 'Please input Organization name',
              },
              {
                whitespace: true,
                message: 'Organization name should not contain whitespaces.'
              },
              {
                pattern: /^[a-z0-9]{1,255}}?$/,
                message: 'Alphanumerical lowercase no more than 255 symbols',
              }],
              initialValue: organizationNamePlaceholder
            })(
              <Input placeholder={organizationNamePlaceholder} />
            )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="Domain"
          >
            {getFieldDecorator('domain', {
              rules: [
                  {
                    required: true,
                    message: 'Please input Organization domain',
                  }
                ],
              initialValue: domainPlaceholder
            })(
              <Input placeholder={domainPlaceholder} />
            )}
          </Form.Item>

          <FormItem {...ExpImpButtonItemLayout}>
          <ButtonGroup>
          
            <Button ghost type="primary" icon="cloud">Export Crypto</Button>
            <Upload {...props}>
            <Button ghost type="primary">Import Crypto<Icon type="cloud-download"/></Button>
            </Upload>
            </ButtonGroup>
          </FormItem>
          <FormItem {...buttonItemLayout}>
            <Button type="primary" onClick={this.handleSubmit}>Save</Button>
          </FormItem>
        </Form>
        </div>
        </Card>
    );
  }
}

export default Form.create()(Settings)