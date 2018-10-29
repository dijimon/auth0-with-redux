import React, { Component, Fragment } from 'react'
import { Card, Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'
import './styles.css'
@inject('PeersStore')
@observer
export default class Peers extends Component {

    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }),
    }

    render() {
        return (
          <Card title="Peers">
                <div id="tabsContent" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <PeersTable />
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
@inject('PeersStore')
@observer
class PeersTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingKey: '', 
      delitingKey: '',
      dataSource: [],
      count: 0,
      isCreating: false,
      isLoading: false
    };

    this.columns = [
      {
        title: 'NAME',
        dataIndex: 'name',
        width: '20%',
        editable: true,
      },
      {
        title: 'URL',
        dataIndex: 'url',
        width: '20%',
        editable: true,
      },
      {
        title: 'CHANNELS',
        dataIndex: 'channels',
        width: '20%',
        editable: true,
      },
      {
        title: 'STATUS',
        dataIndex: 'status.phase',
        width: '15%',
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
                  <span className="actionIconContainer" style={{marginLeft: 10}}>
                    <Tooltip placement="top" title="Delete">
                      <a onClick={() => this.delete(record.uid)}>
                        <Icon className="actionIcon" type="delete" />
                      </a>
                    </Tooltip>
                  </span>
                  <span className="actionIconContainer" style={{marginLeft: 10}}>
                    <Tooltip placement="top" title="Show logs">
                      <a onClick={() => this.showLogs(record.key)}>
                        <Icon className="actionIcon" type="file-done" />
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

  generateMockPeers = (n) => {
    const data = [];
    for (let i = 0; i < n; i++) {
      data.push({
        key: i.toString(),
        name: `peer-${i}`,
        url: `peer-${i}.domain.com`,
        channels: `channel-${i}, channel-${i+1}`,
        status: 'ok'
      });
    }
    return data
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })
    await this.props.PeersStore.getPeers()
    .then((response) => {
      this.setState({ dataSource: response, isLoading: false })
    })
    .then(() => console.log('store = ',this.store.dataSource))
    .catch(error => this.setState({ error, isLoading: false }))
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(key) {
    // const { dataSource } = this.state
    // this.setState({ dataSource: dataSource.filter(item => item.key !== key), count: dataSource.length});
    this.props.PeersStore.deletePeer(key)
  }

  showLogs(key) {
    console.log('Showing logs - functionality does not have requirements :(')
  }

  add = (key) => {
    this.setState({ editingKey: key, isCreating: true });

    const { count, dataSource } = this.state;
    const newData = {
      key: key,
      name: '',
      peers: '',
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
      this.props.PeersStore.updatePeer(key, row)
    });
    // e.target.reset();
  }

  create(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      this.handleNewData(row, key);
      this.props.PeersStore.addPeer(row);
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
    const nextPeer = this.state.dataSource ? this.state.dataSource.length : 0

    return (
        <Fragment>
        <div className='topButtonContainer'>
            <Button className='topButton' type="primary" onClick={() => this.add(nextPeer)}>Add Peer</Button>
            <span>Peers: {this.state.count}</span>
        </div>
      <Table
        components={components}
        bordered
        dataSource={this.state.dataSource}
        rowKey="uid"
        columns={columns}
        rowClassName="editable-row"
        loading={this.state.isLoading}
      />
      </Fragment>
    );
  }
}