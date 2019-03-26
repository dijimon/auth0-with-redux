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

@inject('SettingsStore')
@observer
class Settings extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      isSuccess: false,
      isError: false,
      isDisabled: true,
      formLayout: 'horizontal',
      settings: {
        domain: '',
        name: ''
      }
    }
  }

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    })
  }
  
  componentDidMount = () => {
    this.getSettings()
  }

  getOrgName = () => {
    return this.props.SettingsStore.name
  }

  getDomain = () => {
    return this.props.SettingsStore.domain 
  }

  getSettings = async () => {
    await this.props.SettingsStore.getSettings()
    const settings = this.props.SettingsStore.settings
    this.state.settings ? this.setState({settings}) : this.setState({settings: {}})
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const errorMessage = 'Something went wrong...'
    const successMessage = 'Changes are saved'

    await this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({isError: true, message: errorMessage})
      } else {
        this.props.SettingsStore.setSettings(values).then((reponse) => {
          if(reponse.status !== 201 && reponse.data) {
            this.setState({isError: true, message: reponse.data.message})
          } else {
            this.setState({isSuccess: true, message: successMessage})
          }
        })
      }
    })
    this.handleMessageDissapearing()
  }

  handleMessageDissapearing = () => {
    setTimeout(() => {
      this.setState({ isSuccess: false, isError: false, message: '', isDisabled: true })
    }, 5000)
  }

  handleCancel = () => {
    this.setState({isDisabled: true})
  }

  handleEdit = () => {
    this.setState({isDisabled: false})
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      colon: false
    }
    const buttonItemLayout = {
      wrapperCol: { span:14, offset: 4 }
    }
    const ExpImpButtonItemLayout = {
      wrapperCol: { span: 24, offset: 4 }
    }
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const { isDisabled, message, isSuccess, isError, formLayout } = this.state
    const orgName = this.getOrgName()
    const domain = this.getDomain()
    const messageAlert = <Alert type = {isError ? 'error' : (isSuccess ? 'success' : 'info')} className = 'alertHideAnimation' message = { message || ''} />
    const orgNameError = isFieldTouched('name') && getFieldError('name')
    const domainError = isFieldTouched('domain') && getFieldError('domain')
    const isSettingsWereSet = this.props.SettingsStore.isSettingsWereSet

    return (
      <Card title="Settings">
        <div id="tabsContent" style={{background: '#fff', minHeight: 360 }}>
          <Row style={{minHeight: 60}}>
            <Col offset={4} span={8}>{(isSuccess || isError) && messageAlert}</Col>
          </Row>
          <Form layout={formLayout} onSubmit={this.handleSubmit}>
            <Form.Item
            {...formItemLayout}
            label="Organization Name"
            validateStatus={orgNameError ? 'error' : ''}
            help={orgNameError || ''}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, 
                message: 'Please input Organization name',
              },
              {
                whitespace: true,
                message: 'Organization name should not contain whitespaces'
              },
              {
                pattern: /^[a-z0-9]{1,255}}?$/,
                message: 'Alphanumerical lowercase no more than 255 symbols',
              }],
              initialValue: orgName || ''
            })(
              <Input 
                placeholder = 'Enter organization name' 
                addonAfter = {<Icon type="star" />} 
                disabled = {isSettingsWereSet ? isDisabled : false}
              />
            )}
          </Form.Item>
            <Form.Item
            {...formItemLayout}
            label="Domain"
            validateStatus={domainError ? 'error' : ''}
            help={domainError || ''}
          >
            {getFieldDecorator('domain', {
              rules: [
                  {
                    required: true,
                    message: 'Please input domain',
                  },
                  {
                    pattern: /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
                    message: 'Not allowed Domain name',
                  }
                ],
                initialValue: domain || ''
            })(
              <Input 
                placeholder = 'Enter domain'
                addonAfter = {<Icon type="global" />}
                disabled = {isSettingsWereSet ? isDisabled : false}
              />
            )}
          </Form.Item>
            <Form.Item {...ExpImpButtonItemLayout} style={{marginBottom: 0}}>
            <Button.Group>
              <Button ghost type="primary" icon="cloud">Export Crypto</Button>
              <Upload {...props}>
                <Button ghost type="primary">Import Crypto<Icon type="cloud-download"/></Button>
              </Upload>
            </Button.Group>
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            {(isDisabled && isSettingsWereSet) && <Button type='primary' style={{'marginRight':'10px'}} onClick={this.handleEdit}>Edit</Button>}
            {(!isDisabled || !isSettingsWereSet) && <Button type='primary' style={{'marginRight':'10px'}} disabled={isDisabled} onClick={this.handleCancel}>Cancel</Button>}
            {(!isDisabled || !isSettingsWereSet) && <Button type='primary' htmlType="submit" disabled={this.hasErrors(getFieldsError())} onClick={this.handleSubmit}>Save</Button>}
          </Form.Item>

          </Form>
        </div>
      </Card>
    );
  }
}

export default Form.create()(Settings)
