import React, { Component } from 'react'
import { Card, Form, Input, Button, Upload, Icon, message } from 'antd';

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

export default class Settings extends Component {

    render() {
        return (
            <Card title="Settings">
                <div id="tabsContent" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <SettingsForm />
                </div>
          </Card>
        );
    }
}

const FormItem = Form.Item;

class SettingsForm extends Component {
  constructor() {
    super();
    this.state = {
      formLayout: 'horizontal',
    };
  }

  handleFormLayoutChange = (e) => {
    this.setState({ formLayout: e.target.value });
  }

  handleOrganizationInput = (e) => {
    window.localStorage.setItem('orgName', e.target.value)
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
    const ButtonGroup = Button.Group;
    const organizationName = window.localStorage.getItem('orgName') || 'Enter organization name'
    return (
      <div>
        <Form layout={formLayout}>
          <FormItem
            label="Organization name"
            {...formItemLayout}
          >
            <Input placeholder={organizationName} onChange={this.handleOrganizationInput} />
          </FormItem>
          <FormItem
            label="Domain"
            {...formItemLayout}
          >
            <Input placeholder="Enter domain" />
          </FormItem>
          <FormItem {...ExpImpButtonItemLayout}>
          <ButtonGroup>
          
            <Button ghost type="primary" icon="cloud">Export Crypto</Button>
            <Upload {...props}>
            <Button ghost type="primary">Import Crypto<Icon type="cloud-download"/></Button>
            </Upload>
            </ButtonGroup>
          </FormItem>
          <FormItem {...buttonItemLayout}>
            <Button type="primary">Save</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}