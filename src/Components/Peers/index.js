import React, { Component, Fragment } from 'react'
import { Card, Table, Input, Popconfirm, Form, Button, Icon, Tooltip, Badge, Select, Alert, Row, Col } from 'antd'
// import Select from 'react-select'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import './styles.css'

export default class Peers extends Component {

    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }),
    }

    render() {
        return (
          <Card title='Peers' className = 'peersContainer' >
                <div id='tabsContent' style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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

class EditableCell extends Component {

  constructor(props) {
    super(props)

    this.state = {
      channels: [ // TODO: get from API hen it will be provided
        { value: 'ch1', label: 'Channel1' },
        { value: 'ch2', label: 'Channel2' },
        { value: 'ch3', label: 'Channel3' },
        { value: 'ch4', label: 'Channel4' },
        { value: 'ch5', label: 'Channel5' },
        { value: 'ch6', label: 'Channel6' }
      ],
      selectedChannels: []
    }
  }
  getInput = () => {
    
    // if (this.props.inputType === 'number') {
    //   return <InputNumber />
    // }

    if (this.props.dataIndex === 'name') {
      return <Input placeholder='Input name...' />
      // onChange={this.handleNameChanging()}
    } 
    else return <Input className='disabledInput' disabled />
  }

  handleNameChanging = () => {
    console.log('Name')
  }

  handleChannelsChange = (selectedChannelOptions) => {
    console.log('selectedChannelOptions = ', selectedChannelOptions)
    this.setState({selectedChannels: selectedChannelOptions})
    console.log('this.state.selectedChannels = ', this.state.selectedChannels)
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      channels,
      ...restProps
    } = this.props
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form
          const channelsValue = this.state.selectedChannels.length > 0 ? this.state.selectedChannels : 'not available' // TODO: remove when channels will be available in API
          const SelectOption = Select.Option
          const children = []
          const {channels} = this.state
          
          channels.forEach((item, index) => (
            children.push(<SelectOption key={index}>{item.label}</SelectOption>)
          ))

          return (
            <td {...restProps} style={{ margin: 0 }}>
              {editing ? (
                dataIndex !== 'channels' ?
                (dataIndex === 'name' ? <FormItem>
                  {getFieldDecorator(dataIndex, {
                    initialValue: restProps.children[2],
                    rules: [
                      {required: true, message: 'Please input Peer name'},
                      {pattern: /^[a-z0-9]{1,255}$/, message: 'Only alphanumeric lowercase'}
                    ]
                  })(
                    this.getInput()
                  )}
                </FormItem> : this.getInput())
                : <FormItem>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {required: true, message: 'Please select Channels'}
                    ]
                  })(
                      <Select
                        mode='multiple'
                        style={{ width: '100%' }}
                        placeholder='Select channel...'
                        onChange={this.handleChannelsChange}
                      >
                        {children}
                      </Select>
                  )}
                </FormItem>
                ) : (dataIndex !== 'channels' ? restProps.children : channelsValue)}
            </td>
          )
        }}
      </EditableContext.Consumer>
    )
  }
}
@inject('PeersStore')
@inject('SettingsStore')
@inject('ServerEventsStore')
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
      isError: false,
      isInfo: false,
      isSuccess: false,
      message: '',
      pagination: null,
      current: 0,
      domain: ''
    }

    this.columns = []
  }

  componentDidMount = async () => {
    
    this.setState({ isLoading: true })
    
    this.columns = [{
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      className: 'textCenter',
      width: '20%',
      editable: true
    },
    {
      title: 'URL',
      dataIndex: 'url',
      className: 'textCenter',
      width: '20%',
      editable: true
    },
    {
      title: 'Channels',
      dataIndex: 'channels',
      className: 'textCenter',
      width: '20%',
      editable: true,
    },
    // {
    //   title: 'Created',
    //   dataIndex: 'created_at',
    //   className: 'textCenter',
    //   width: '20%',
    //   editable: true,
    // },
    // {
    //   title: 'Started',
    //   dataIndex: 'status.startTime',
    //   className: 'textCenter',
    //   width: '20%',
    //   editable: true,
    // },
    {
      title: 'Status',
      dataIndex: 'status.phase',
      className: 'textCenter',
      width: '15%',
      editable: true,
      key: 'status.phase',
      render: (status) => {
        const statusText = status ? status : 'Not running'
        const statusColor =  status && status.toLowerCase() === 'running' ? '#5BC62E' 
        : (status && status.toLowerCase() === 'failed' ? '#F78154' 
        : (status && status.toLowerCase() === 'pending' ? '#F2C14E' 
        : '#ccc'))

        const statusType = status && status.toLowerCase() === 'running' ? 'success' 
        : (status && status.toLowerCase() === 'failed' ? 'error' 
        : (status && status.toLowerCase() === 'pending' ? 'warning' 
        : 'default'))
        
        return <Fragment>
          <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '10px'}}>
            <p
              style={{color: statusColor}}
              className='statusStyle'>
              <Badge status={statusType} />
              {statusText}
            </p>
            </span>
          </Fragment>
      }
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      className: 'textCenter',
      width: '15%',
      render: (text, record) => {
        const editable = this.isEditing(record)
        const isCreating = this.state.isCreating
        return (
            <Fragment>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            {editable ? (
              <span style={{ display: 'flex', justifyContent: 'center'}}>
                <EditableContext.Consumer>
                  {form => (
                    !isCreating ? 
                    (<Tooltip className='actionIcon' placement='top' title='Save'>
                    <a
                      href='javascript:;'
                      onClick={() => this.save(form, record.key)}
                      style={{ margin: '0 auto' }}
                    >
                      <Icon className='actionIcon iconCircle' type='check' />
                    </a>
                  </Tooltip>
                    ) :
                    (<Tooltip className='actionIcon' placement='top' title='Create'>
                        <a
                          href='javascript:;'
                          onClick={() => this.create(form, record.key)}
                          style={{ marginRight: 8 }}
                        >
                          <Icon className='actionIcon iconCircle' type='plus' />
                        </a>
                      </Tooltip>)
                  )}
                </EditableContext.Consumer>
                
                {
                  <Popconfirm
                  title='Sure to cancel?'
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }}/>}
                  onConfirm={() => this.cancel(record.key)}
                >
                  <Tooltip className='actionIcon' placement='top' title='Cancel'>
                    <a>
                      <Icon className='actionIcon iconCircle' type='close' />
                    </a>
                  </Tooltip>
                </Popconfirm>}
              </span>
            ) : (
              <span>
              <Tooltip className='actionIcon' placement='top' title='Edit'>
                <a className='actionLink' onClick={() => this.edit(record.uid)}>
                  <Icon className='actionIcon iconCircle' type='edit' />
                </a>
              </Tooltip>
              </span>
            )}
            {
              !editable &&
              <Fragment>
                <span className='actionIconContainer' style={{marginLeft: 10}}>
                  {<Popconfirm
                  title='Sure to delete?'
                  onConfirm={() => this.delete(record.uid)}
                >
                  <Tooltip className='actionIcon' placement='top' title='Delete'>
                    <a className='actionLink'>
                      <Icon className='actionIcon iconCircle' type='delete' />
                    </a>
                  </Tooltip>
                </Popconfirm>}
                </span>
                <span className='actionIconContainer' style={{marginLeft: 10}}>
                  <Tooltip placement='top' title='Show logs'>
                    <a className='actionLink' onClick={() => this.showLogs(record.key)}>
                      <Icon className='actionIcon iconCircle' type='file-done' />
                    </a>
                  </Tooltip>
                </span>
              </Fragment>
            }
          </div>
          </Fragment>
        )
      },
    },
  ]

    await this.getDomain()
    await this.props.PeersStore.getPeers()
      .then((response) => {
        if (!response) response = []
        const peersWithUrls = this.mergePeersWithItsUrls(response)
        this.setState({ dataSource: peersWithUrls, isLoading: false })
      }).catch(error => this.setState({ error, isLoading: false }))
  }

  componentWillReceiveProps = () => {
    this.getPeers()
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    const order = this.state.sortedInfo.order
    const newOrder = order === 'descend' ? 'ascend' : 'descend'
    this.setState({
      sortedInfo: {
        order: newOrder,
      },
    })
    console.log(`new sort order = ${this.state.sortedInfo.order}`)
  }

  getDomain = async () => {
    await this.props.SettingsStore.getSettings().then(() => {
      const domain = this.props.SettingsStore.domain
      this.setState({domain: domain})
    })
  }

  mergePeersWithItsUrls = (peers) => {
    return peers.map((peer) => {
      const { domain, selectedChannelOption } = this.state
      const fullURL = peer.name.concat('@').concat(domain)
      const url = {'url' : fullURL}
      const channels = {'channels' : selectedChannelOption}
      return Object.assign({}, peer, url, channels)
    })
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

  isEditing = (record) => {
    return (record.key) ? record.key === this.state.editingKey : record.uid === this.state.editingKey
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

  waitWhenServerDeleteThePeer = (key) => {
    let isDeleted = false
    const _props = this.props
    const _reloadPeers = this.reloadPeers.bind(this)
    const peerName = this.getPeerNameByKey(key)

    let myInterval = setInterval(function() {
      isDeleted = _props.ServerEventsStore.isPeerDeleted(peerName)
      console.log(`isDeleted = ${isDeleted}`)
      
      if (isDeleted) {
        clearInterval(myInterval)
        _reloadPeers()
      }
    }, 1000)
  }

  getPeerNameByKey = (key) => {
    return this.state.dataSource.filter(item => item.uid === key)[0].name
  }

  getServerEvents = () => {
    const se =  this.props.ServerEventsStore.getServerEvents()
    console.log(`@@@ SERVER EVENTS => ${se}`)
  }

  async delete(key) {
    this.setState({isLoading: true})
    this.props.PeersStore.deletePeer(key)
    this.waitWhenServerDeleteThePeer.call(this, key)
  }

  showLogs = (key) => {
    console.log(`Showing logs for peer${key}- functionality does not have requirements :(`)
  }

  getPageForNextPeer = () => {
    return Math.ceil((this.state.dataSource.length+1)/10)
  }

  scrollTableTo = (endPosition) => {
    const table = document.getElementsByClassName('ant-table-content')[0]
    if (endPosition === 'bottom') {
      window.scrollTo(0, table.offsetHeight)
    } else if (endPosition === 'header') {
      window.scrollTo(0, 0)
    }
  }

  handlePaginationChange = (page) => {
    this.setState({current: page})
  }

  add = (key) => {
    const pageToAdd = this.getPageForNextPeer()
    const pagination = {
      current: pageToAdd
    }
    this.setState({ pagination: pagination, editingKey: key+1, isCreating: true })

    const { count, dataSource } = this.state
    const newData = {
      key: key+1,
      name: '',
      peers: '',
      chaincodes: ''
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count+1,
      pagination: pagination
    })
    this.scrollTableTo('bottom')
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

  handleMessageDissapearing = () => {
    setTimeout(() => {
      this.setState({isError: false, isInfo: false, isSuccess: false, message: '',  isLoading: false})
    }, 5000)
  }

  save(form, key) {
    form.validateFields((error, row, key) => {
      if (error) {
        return
      }

      const {editingKey} = this.state
      // this.handleNewData(row, key)
      this.props.PeersStore.updatePeer(row, editingKey)
      .then((response) => {

        console.log('### response = ')
        if ((response.status !== 200 && response.status !== 204) && response.data) {
          // show error; return 0;
          console.log('!!! response = ', response.data.message)
          this.setState({ isError: true, errorMessage: response.data.message, isLoading: false })
          this.handleMessageShowing()
        } else if (response.status === 200 || response.status === 204) {
          this.setState({ isSuccess: true, message: 'Peer has successfully updated', isLoading: false })
          this.handleMessageShowing()
        }
      })
      .catch(error => {
        console.log('ERROR: ', error)
        this.setState({ isError: true, message: error, isLoading: false })
      })
      
      this.props.PeersStore.getPeers()
      .then((response) => { 
        const peerWithUrls = this.mergePeersWithItsUrls(response)
        this.setState({ dataSource: peerWithUrls, isLoading: false, editingKey: -1})
      })
      .catch(error => {
        console.log('ERROR: ', error)
        this.setState({ error, isLoading: false })
      })
    })
    // e.target.reset()
    const {isError, errorText} = this.state
    if (isError) {
      console.log('!!! ERROR: errorText', errorText)
    }
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
          if (response.status && response.status !== 201) {
            this.setState({isError: true, message: response.data.message})
          } else {
            const peerWithUrls = this.mergePeersWithItsUrls([response.data])
            const {dataSource: updatedDataSource} = this.state
            updatedDataSource.push(peerWithUrls[0])
            this.setState({ dataSource: updatedDataSource, isLoading: false, isSuccess: true, message: `Peer ${row.name} was scheduled to be created` })
          }

        }).then(() => {this.handleMessageDissapearing()})
    })
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  cancel = () => {
    let {dataSource} = this.state
    dataSource.pop()
    this.setState({ editingKey: '', isCreating: false, isEditing: false, dataSource: dataSource })
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
    let { isError, isSuccess, message } = this.state
    const ButtonGroup = Button.Group
    const messageAlert = <Alert type = {isError ? 'error' : (isSuccess ? 'success' : 'info')} className = 'alertHideAnimation' style={{marginLeft: 20, opacity: 1,  transition: 'opacity 0.2s 1s ease' }} message = { message || ''} showIcon />

    return (
        <Fragment>
          <div className='topButtonContainer' style={{display: 'flex', justifyContent: 'spaceBetween', minHeight: 40}}>
            <Tooltip placement='top' title='Peers amount'>
              <Badge className='totalInfo' style={{backgroundColor: '#001529', zIndex: 999}} count={this.state.dataSource.length || '0'}>
                <a href='#' />
              </Badge>
            </Tooltip>
            <ButtonGroup>
              <Button
                disabled={this.state.isCreating || this.state.isLoading}
                type='primary' 
                onClick={() => this.reloadPeers()}>
                <Icon type='reload' />Reload
              </Button>
              <Button
                disabled={this.state.isCreating || this.state.isLoading}
                type='primary'
                onClick={() => this.add(nextPeer)}>
                Add Peer {nextPeer}<Icon type='plus' />
              </Button>
              <button onClick={this.getServerEvents}>TEST</button>
            </ButtonGroup>
            <div>{(isSuccess || isError) && messageAlert}</div>
          </div>
          <Table
            className='peersTableContainer'
            components={components}
            // size='small'
            bordered
            dataSource={this.state.dataSource}
            rowKey={record => record.uid}
            columns={columns}
            rowClassName='editable-row'
            loading={this.state.isLoading}
            onChange={this.handleTableChange}
            // scroll={{ y: 500 }}
            pagination={this.state.pagination}
          />
        </Fragment>
    )
  }
}
