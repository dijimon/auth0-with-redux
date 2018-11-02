import React, { Component, Fragment } from 'react'
import { Card, Table, Input, Popconfirm, Form, Button, Icon, Tooltip } from 'antd'
import Select from 'react-select'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import './styles.css'
// @inject('PeersStore')
// @observer
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
        )
    }
}

const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  getInput = () => {
    
    // if (this.props.inputType === 'number') {
    //   return <InputNumber />
    // }

    if (this.props.dataIndex === 'name') {
      return <Input placeholder='Input name...' />
    } 
    else return <Input className="disabledInput" disabled />
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form
          
          const options = [ // will be get from API later
            { value: 'ch1', label: 'Ch1' },
            { value: 'ch2', label: 'Ch2' },
            { value: 'ch3', label: 'Ch3' }
          ]

          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    // rules: [{
                    //   required: true,
                    //   message: `Please Input ${title}!`,
                    // }],
                    initialValue: record[dataIndex],
                  })(
                    dataIndex !== 'channels' ? this.getInput() :
                    <div>
                    <Select
                      className="selectContainer"
                      onChange={this.handleChannelsChange}
                      options={options}
                      placeholder={'Select Сhannel(s)'}
                      isMulti
                      isSearchable
                    />
                    </div>
                  )}
                </FormItem>
              ) : restProps.children}
            </td>
          )
        }}
      </EditableContext.Consumer>
    )
  }
}
@inject('PeersStore')
@inject('SettingsStore')
@observer
class PeersTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editingKey: 0, 
      delitingKey: '',
      dataSource: [],
      count: 0,
      isEditing: false,
      isCreating: false,
      isLoading: false,
      selectedChannelOption: null,
      channels: [],
      errMessage: ''
    }

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
        render: (status) => {
          const statusText = status ? status : 'Not running'
          const statusColor =  status && status.toLowerCase() === 'running' ? '#5BC62E' 
          : (status && status.toLowerCase() === 'failed' ? '#F78154' 
          : (status && status.toLowerCase() === 'pending' ? '#F2C14E' 
          : '#ccc'))
          
          return <Fragment>
            <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '10px'}}>
              <p
                style={{color: statusColor}}
                className='statusStyle'>
                {statusText}
              </p>
              </span>
            </Fragment>
        }
      },
      {
        title: 'ACTION',
        dataIndex: 'action',
        width: '15%',
        render: (text, record) => {
          const editable = this.isEditing(record)
          const isCreating = this.state.isCreating
          return (
              <Fragment>
            <div>
              {editable ? (
                <span style={{position: 'absolute',
                   right: '8%'}}>
                  <EditableContext.Consumer>
                    {form => (
                      !isCreating ? 
                      (<Tooltip className="actionIcon" placement="top" title="Save">
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ margin: '0 auto' }}
                      >
                        <Icon className="actionIcon" type="check" />
                      </a>
                    </Tooltip>
                      ) :
                      (<Tooltip className="actionIcon" placement="top" title="Create">
                          <a
                            href="javascript:;"
                            onClick={() => this.create(form, record.key)}
                            style={{ marginRight: 8 }}
                          >
                            <Icon className="actionIcon" type="plus" />
                          </a>
                        </Tooltip>)
                    )}
                  </EditableContext.Consumer>
                  {<Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <Tooltip className="actionIcon" placement="top" title="Cancel">
                      <a>
                        <Icon className="actionIcon" type="close" />
                      </a>
                    </Tooltip>
                  </Popconfirm>}
                </span>
              ) : (
                <Tooltip className="actionIcon" placement="top" title="Edit">
                  <a onClick={() => this.edit(record.uid)}>
                    <Icon className="actionIcon" type="edit" />
                  </a>
                </Tooltip>
              )}
              {
                !editable &&
                <span>
                  <span className="actionIconContainer" style={{marginLeft: 10}}>
                    {<Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => this.delete(record.uid)}
                  >
                    <Tooltip className="actionIcon" placement="top" title="Delete">
                      <a>
                        <Icon className="actionIcon" type="delete" />
                      </a>
                    </Tooltip>
                  </Popconfirm>}
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
          )
        },
      },
    ]
  }

  mergePeersWithItsUrls = (peers) => {
    return peers.map((peer, index) => {
      let domain = this.props.SettingsStore.getDomain()
      let url = {'url' : peer.name.concat(domain)}
      let channels = {'channels' : ['ch1, ', 'ch2']}
      return Object.assign({}, peer, url, channels)
    })
  }

  handleChannelsChange = (selectedChannelOption) => {
    this.setState({ selectedChannelOption })
  }

  getPeers = async () => {
    await this.props.PeersStore.getPeers()
    .then((response) => {
      if (!response) response = []
      const peersWithUrls = this.mergePeersWithItsUrls(response)
      this.setState({ dataSource: peersWithUrls, isLoading: false })
    })
    .catch(error => this.setState({ error, isLoading: false }))
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })
    await this.props.PeersStore.getPeers()
    .then((response) => {
      if (!response) response = []
      const peersWithUrls = this.mergePeersWithItsUrls(response)
      this.setState({ dataSource: peersWithUrls, isLoading: false })
    })
    .catch(error => this.setState({ error, isLoading: false }))
  }

  isEditing = (record) => {
    const result = (record.key) ? record.key === this.state.editingKey : record.uid === this.state.editingKey
    return result
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  reloadPeers = () => {
    this.props.PeersStore.getPeers()
    .then((response) => {
      if (!response) response = []
      const peersWithUrls = this.mergePeersWithItsUrls(response)
      this.setState({ dataSource: peersWithUrls, isLoading: false })
    })
    .catch(error => this.setState({ error, isLoading: false }))
  }

  async delete(key) {
    await this.props.PeersStore.deletePeer(key)
    await this.reloadPeers()
  }

  showLogs(key) {
    console.log(`Showing logs for peer${key}- functionality does not have requirements :(`)
  }

  add = (key) => {
    console.log('In add(), key = ', key)
    this.setState({ editingKey: key+1, isCreating: true })

    const { count, dataSource } = this.state
    const newData = {
      key: key+1,
      name: '',
      peers: '',
      chaincodes: ''
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count+1
    })
  }

  handleNewData = (row, key) => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => key === item.key)
    const newCount = this.state.dataSource.length

    if (index > -1) {
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      this.setState({ dataSource: newData, editingKey: '', count: newCount })
    } else {
      newData.push(row)
      this.setState({ dataSource: newData, editingKey: '', count: newCount })
    }
  }

  save(form, key) {
    form.validateFields((error, row, key) => {
      if (error) {
        return
      }

      const {editingKey} = this.state
      // this.handleNewData(row, key)
      this.props.PeersStore.updatePeer(row, editingKey)
      .then(() => {
        this.props.PeersStore.getPeers()
        .then((response) => { 
          const peerWithUrls = this.mergePeersWithItsUrls(response)
          this.setState({ dataSource: peerWithUrls, isLoading: false, editingKey: -1})
        })
      })
      .catch(error => this.setState({ error, isLoading: false }))
    })
    // e.target.reset()
  }

  create = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      // this.handleNewData(row, key)
      const ds = this.state.dataSource
      ds.pop()
      this.setState({ isCreating: false, isLoading: true, dataSource: ds})
      this.props.PeersStore.addPeer(row)
        .then((response) => {
          if (!response) response = []
          if (response.message) {
            this.setState({hasError: true, errMessage: response.message})
          }
          console.log('IN CREATE, response = ', response)
          const peerWithUrls = this.mergePeersWithItsUrls([response])
          console.log('NEW PEER:', peerWithUrls)
          const {dataSource: updatedDataSource} = this.state
          updatedDataSource.push(peerWithUrls[0])
          console.log('updatedDataSource', updatedDataSource)
          this.setState({ dataSource: updatedDataSource, isLoading: false })
        })
        .catch(error => this.setState({ error, isLoading: false }))
    })
    // e.target.reset()
  }

  cancel = () => {
    this.setState({ editingKey: '' })
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
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
      }
    })
    const nextPeer = this.state.dataSource ? this.state.dataSource.length : 0

    return (
        <Fragment>
        <div className='topButtonContainer'>
            <Button
              disabled={this.state.isCreating}
              className='topButton' 
              type="primary" 
              onClick={() => this.add(nextPeer)}>
              <Icon type="plus" />Add Peer
            </Button>
            <Button
              disabled={this.state.isCreating}
              className='topButton' 
              type="primary" 
              onClick={() => this.reloadPeers()}>
              <Icon type="reload" />Reload
            </Button>
            <span> Total Peers: {this.state.dataSource.length}</span>
            <span style={{color: 'red'}} id="errorMessage">{this.state.errMessage}</span>
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
    )
  }
}