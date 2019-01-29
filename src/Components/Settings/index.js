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
    const orgName = this.props.SettingsStore.settings ? this.props.SettingsStore.settings.name : ''
    return orgName
  }

  getDomain = () => {
    const domain = this.props.SettingsStore.settings ? this.props.SettingsStore.settings.domain : ''
    return domain 
  }

  getSettings = async () => {
    await this.props.SettingsStore.getSettings()
    const settings = this.props.SettingsStore.settings
    this.setState({settings})
    console.log(`CURRENT SETTINGS: ${Object.values(settings)}`)
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const errorMessage = 'Something is wrong...'
    const successMessage = 'Changes are saved'

    await this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({isError: true, message: errorMessage})
      } else {
        this.props.SettingsStore.setSettings(values).then((reponse) => {
          if(reponse.status === 400 && reponse.data) {
            this.setState({isError: true, message: reponse.data.message})
            this.getSettings()
          } else {
            this.setState({isSuccess: true, message: successMessage})
          }
        })
      }
    })
    await setTimeout(() => {
      this.setState({ isSuccess: false, isError: false, message: '', isDisabled: true })
    }, 4000)
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
      wrapperCol: { span: 14 }
    }
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 }
    }
    const ExpImpButtonItemLayout = {
      wrapperCol: { span: 24, offset: 4 }
    }
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const { isDisabled, message, isSuccess, isError, formLayout } = this.state
    const organizationNamePlaceholder = this.getOrgName() !== '' ? this.getOrgName() : 'Enter organization name'
    const domainPlaceholder = this.getDomain() !== '' ? this.getDomain() : 'Enter domain'
    const messageAlert = <Alert type = {isError ? 'error' : (isSuccess ? 'success' : 'info')} className = 'alertHideAnimation' message = { message || ''} />
    const orgNameError = isFieldTouched('name') && getFieldError('name')
    const domainError = isFieldTouched('domain') && getFieldError('domain')

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
                message: 'Organization name should not contain whitespaces.'
              },
              {
                pattern: /^[a-z0-9]{1,255}}?$/,
                message: 'Alphanumerical lowercase no more than 255 symbols',
              }],
              initialValue: organizationNamePlaceholder || ''
            })(
              <Input 
                placeholder = {organizationNamePlaceholder} 
                addonAfter = {<Icon type="star" />} 
                disabled = {isDisabled}
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
                    pattern: /^[a-zA-Z0-9][-a-zA-Z0-9]+[a-zA-Z0-9].[a-z]{2,6}(.[a-z]{2,6})?(.[a-z]{2,6})?$/,
                    message: 'Not allowed Domain name.',
                  }
                ],
                initialValue: domainPlaceholder || ''
            })(
              <Input 
                placeholder = {domainPlaceholder}
                addonAfter = {<Icon type="global" />}
                disabled = {isDisabled}
              />
            )}
          </Form.Item>
            <Form.Item {...ExpImpButtonItemLayout}>
            <Button.Group>
              <Button ghost type="primary" icon="cloud">Export Crypto</Button>
              <Upload {...props}>
                <Button ghost type="primary">Import Crypto<Icon type="cloud-download"/></Button>
              </Upload>
            </Button.Group>
          </Form.Item>
            <Form.Item {...buttonItemLayout}>
              <Button type='primary' style={{'marginRight':'10px'}} disabled={!isDisabled} onClick={this.handleEdit}>Edit</Button>
              <Button type='primary' htmlType="submit" disabled={this.hasErrors(getFieldsError()) || isDisabled} onClick={this.handleSubmit}>Save</Button>
            </Form.Item>

          </Form>
        </div>
      </Card>
    );
  }
}

export default Form.create()(Settings)