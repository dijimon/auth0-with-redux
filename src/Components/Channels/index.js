import React, { Component, Fragment } from 'react'
import { Card, Table, Input, InputNumber, Popconfirm, Form, Button, Tooltip, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'
import './styles.css'
@inject('ChannelsStore')
@observer
export default class Channels extends Component {

    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }),
    }

    render() {
        return (
          <Card title="Сhannels">
                <div id="tabsContent" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <ChannelsTable />
                </div>
          </Card>
        );
    }
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
@inject('ChannelsStore')
@observer
class ChannelsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingKey: '', 
      delitingKey: '',
      dataSource: [],
      count: 0,
      isCreating: false
    };

    this.columns = [
      {
        title: 'NAME',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'PEERS',
        dataIndex: 'peers',
        width: '25%',
        editable: true,
      },
      {
        title: 'CHAINCODES',
        dataIndex: 'chaincodes',
        width: '25%',
        editable: true,
      },
      {
        title: 'ACTION',
        dataIndex: 'action',
        render: (text, record) => {
          const editable = this.isEditing(record);
          const isCreating = this.state.isCreating
          return (
              <Fragment>
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      !isCreating ? 
                      (<a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>) :
                      (<a
                        href="javascript:;"
                        onClick={() => this.create(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Create
                      </a>)
                    )}
                  </EditableContext.Consumer>
                  {!editable && <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>}
                </span>
              ) : (
                <Tooltip className="actionIcon" placement="top" title="Edit">
                  <a onClick={() => this.edit(record.key)}>
                    <Icon className="actionIcon" type="edit" />
                  </a>
                </Tooltip>
              )}
              {
                !editable && 
                <span>
                  {/* <span style={{marginLeft: 10}}><a onClick={() => this.delete(record.key)}>Delete</a> */}
                  <span style={{marginLeft: 10}}>
                  <Tooltip placement="top" title="Delete">
                      <a onClick={() => this.delete(record.uid)}>
                        <Icon className="actionIcon" type="delete" />
                      </a>
                    </Tooltip>
                    </span>
                </span>
              }
            </div>
            </Fragment>
          );
        },
      },
    ]
  }

  componentWillMount = () => {
    const { ChannelsStore } = this.props
    const dataSource = ChannelsStore.getChannels()
    console.log('ChannelsStore', ChannelsStore )
    console.log('dataSource', dataSource )

    this.setState({
      dataSource,
      count: dataSource.length
    })
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(key) {
    const { dataSource } = this.state
    this.setState({ dataSource: dataSource.filter(item => item.key !== key), count: dataSource.length});
    this.props.ChannelsStore.deleteChannel(key)
  }

  add = (key) => {
    this.setState({ editingKey: key, isCreating: true });

    const { count, dataSource } = this.state;
    const newData = {
      key: key,
      name: '',
      channels: '',
      chaincodes: ''
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count+1
    })
  }

  handleNewData = (row, key) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => key === item.key);
    const newCount = this.state.dataSource.length

    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.setState({ dataSource: newData, editingKey: '', count: newCount });
    } else {
      newData.push(row);
      this.setState({ dataSource: newData, editingKey: '', count: newCount });
    }
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      this.handleNewData(row, key);
      this.props.ChannelsStore.updateChannel(key, row)
    });
    // e.target.reset();
  }

  create(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      this.handleNewData(row, key);
      this.props.ChannelsStore.addChannel(row);
      this.setState({ isCreating: false });
    });
    // e.target.reset();
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const nextChannel = this.state.dataSource.length

    return (
       <Fragment>
        <div className='topButtonContainer'>
            <Button className='topButton' type="primary" onClick={() => this.add(nextChannel)}>Add Channel</Button>
            <span>Channels: {this.state.dataSource.length || 0}</span>
        </div>
      <Table
        components={components}
        bordered
        dataSource={this.state.dataSource}
        columns={columns}
        rowClassName="editable-row"
      />
      </Fragment>
    );
  }
}