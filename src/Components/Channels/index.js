import React, { Component, Fragment } from 'react'
import { Card, Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import PropTypes from 'prop-types'
import './styles.css'

export default class Channels extends Component {

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
        // current: props.match.path,
      }
    }

    render() {
        return (
          <Card title="Channels">
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

class ChannelsTable extends Component {
  constructor(props) {
    super(props);
    // this.state = { data, editingKey: '', delitingKey: '' };
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
          return (
              <Fragment>
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.key)}>Edit</a>
              )}
              <span style={{marginLeft: 10}}><a onClick={() => this.delete(record.key)}>Delete</a></span>
            </div>
            </Fragment>
          );
        },
      },
    ];
    this.state = {
      dataSource: [],
      count: 0
    };
  }

  componentWillMount = () => {
    const dataSource = this.generateMockChannels(5);
    const count = dataSource.length

    this.setState({
      dataSource,
      count
    })
  }

  generateMockChannels = (n) => {
    const data = [];
    for (let i = 0; i < n; i++) {
      data.push({
        key: i.toString(),
        name: `channel-${i}`,
        peers: `peer-${i}, peer-${i+1}`,
        chaincodes: `test_chaincode-${i}`
      });
    }
    this.setState({count: data.length})
    return data
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(key) {
    const { dataSource, count } = this.state
    this.setState({ dataSource: dataSource.filter(item => item.key !== key), count: count-1});
  }

  add = (key) => {
    this.setState({ editingKey: key });
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

  addMock = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `channel-${count}`,
      peers: `peer-${count}, peer-${count+1}`,
      chaincodes: `chaincode-${count}`
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
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
    });
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
            <Button className='topButton' type="primary" onClick={() => this.addMock(nextChannel)}>Add Mock</Button>
            <span>Channels:{this.state.count}</span>
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