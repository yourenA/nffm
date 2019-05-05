import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeader,Badge,Table,Divider,Card,Button,Modal ,message   } from 'antd';
import AddOrEditSensors from './AddOrEditView'
@connect(({views, loading}) => ({
  views,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    this.state = {
      editRecord:{},
      targetKeys: [],
      selectedKeys: [],
    };
  }
  handleChange = (nextTargetKeys) => {
    this.setState({targetKeys: nextTargetKeys});

  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
  }
  componentDidMount() {
    this.handleSearch()

  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'views/fetch',
      payload: {
        device_types_id:that.props.history.location.query.id
      },
      callback: function () {
        if (cb) cb()
      }

    });
  }
  handleAdd = ()=> {
    const formValues = this.addViews.props.form.getFieldsValue();
    console.log('formValues', formValues)
    console.log(this.state)
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'views/add',
      payload: {
        device_types_id:that.props.history.location.query.id,
        channel_numbers:that.state.targetKeys,
        ...formValues,
      },
      callback: function () {
        message.success('新建视图成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleEdit = ()=> {
    const formValues = this.editSensors.props.form.getFieldsValue();
    console.log('formValues2', formValues)
    const that = this;
    this.props.dispatch({
      type: 'views/edit',
      payload: {
        id: that.state.editRecord.id,
        device_types_id:that.props.history.location.query.id,
        channel_numbers:that.state.targetKeys,
        ...formValues,


      },
      callback: function () {
        message.success('修改视图成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleDelete = id => {
    const that=this
    const {dispatch} = this.props;
    dispatch({
      type: 'views/remove',
      payload: {
        device_types_id:this.props.history.location.query.id,
        id
      },
      callback: ()=> {
        message.success('删除视图成功')
        that.handleSearch()
      }
    });
  };
  render() {
    const {
      views: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '视图名称',
        dataIndex: 'name',
      },
      {
        title: '视图列信息',
        dataIndex: 'columns',
        render: (text, record) => {
          return text.reduce((pre,item)=>{
            pre.push(item.name);
            return pre
          },[]).join(' | ')
        }
      },
      {
        title: '包含通道',
        dataIndex: 'channels',
        render: (text, record) => {
          return text.reduce((pre,item)=>{
            pre.push(item.name);
            return pre
          },[]).join(' | ')
        }
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <a  onClick={()=>{
              let channels=[]
              for(let i=0;i<record.channels.length;i++){
                channels.push(record.channels[i].number)
              }
              this.setState({
                editModal:true,
                editRecord:record,
                targetKeys:channels
              })
            }}>编辑</a>
            <Divider type="vertical" />
            <a  onClick={()=>{
              Modal.confirm({
                title: '删除设备视图',
                content: `确定删除 ${record.name} 吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => this.handleDelete(record.id),
              })
            }}>删除</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <Card style={{marginTop:'24px'}}>
          <div className="operate-content">
            <Button icon="plus" type="primary" onClick={() =>{this.setState({addModal:true})}}>
              新建 "{this.name}" 视图
            </Button>
          </div>

          <Table
            size='small'
            loading={loading}
            rowKey={'id'}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </Card>
        <Modal
          title={`新建 ${this.name} 视图` }
          visible={this.state.addModal}
          centered
          destroyOnClose
          width={580}
          onOk={this.handleAdd}
          onCancel={()=> {
            this.setState({addModal: false})
          }}
        >
          <AddOrEditSensors history={this.props.history}
                            targetKeys={this.state.targetKeys}
                            selectedKeys={this.state.selectedKeys}
                            handleChange={this.handleChange}
                            handleSelectChange={this.handleSelectChange}
                            wrappedComponentRef={(inst) => this.addViews = inst}/>

        </Modal>
        <Modal
          title={'编辑'+this.state.editRecord.name }
          destroyOnClose
          visible={this.state.editModal}
          centered
          width={580}
          onOk={this.handleEdit}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {},      targetKeys: [],
              selectedKeys: [],})
          }}
        >
          <AddOrEditSensors editRecord={this.state.editRecord}
                            history={this.props.history}
                            targetKeys={this.state.targetKeys}
                            selectedKeys={this.state.selectedKeys}
                            handleChange={this.handleChange}
                            handleSelectChange={this.handleSelectChange}
                      wrappedComponentRef={(inst) => this.editSensors = inst}/>

        </Modal>
        </div>
    );
  }
}

export default SearchList;
