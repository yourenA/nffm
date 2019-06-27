import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import findIndex from 'lodash/findIndex'
import {Link} from 'dva/router';
import {
  Row,
  Popconfirm,
  Form,
  message,
  Button,
  Modal,
  Table,
  Collapse
} from 'antd';
import AddParams from './AddParameters';
import AddValve from './AddValve';
import styles from './TableList.less';
const FormItem = Form.Item;
const Panel = Collapse.Panel;
/* eslint react/no-multi-comp:0 */
@connect(({device_parameters,double_ball_valves,electric_valves, loading}) => ({
  device_parameters,double_ball_valves,electric_valves
}))
@Form.create()
class TableList extends PureComponent {
  state = {
  };


  componentDidMount() {
   this.handleSearch({
      });
    this.handleSearchValves()
    this.handleSearchElectricValves()
  }


  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_parameters/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleSearchValves = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'double_ball_valves/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleSearchElectricValves = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'electric_valves/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleAdd = ()=> {
    const formValues = this.AddParams.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const {
      device_parameters: {data},
    } = this.props;
    const that = this;
    this.props.dispatch({
      type: 'device_parameters/add',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_ids:formValues.parameters.reduce(function (pre,item) {
           pre.push(item);
            return pre
        },[]).concat(data.reduce(function (pre,item) {
          pre.push(item.id);
          return pre
        },[]))
      },
      callback: function () {
        message.success('绑定成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleAddValve=()=>{
    const formValues = this.AddValve.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const {
      device_parameters: {data},
    } = this.props;
    const that = this;
    this.props.dispatch({
      type: 'double_ball_valves/add',
      payload: {
        device_id:this.props.history.location.query.id,
        ...formValues
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addValveModal: false,
        });
        that.handleSearchValves()
      }
    });
  }
  handleAddElectricValve=()=>{
    const formValues = this.AddElectricValve.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const {
      device_parameters: {data},
    } = this.props;
    const that = this;
    this.props.dispatch({
      type: 'electric_valves/add',
      payload: {
        device_id:this.props.history.location.query.id,
        ...formValues
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addElectricModal: false,
        });
        that.handleSearchElectricValves()
      }
    });
  }
  handleRemove=(index)=>{
    const that=this
    const {
      device_parameters: {data},
    } = this.props;
    console.log(data[index])
    data.splice(index,1)
    this.props.dispatch({
      type: 'device_parameters/add',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_ids:data.reduce(function (pre,item) {
          pre.push(item.id);
          return pre
        },[])
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleRemoveValve=(record)=>{
    const that=this
    this.props.dispatch({
      type: 'double_ball_valves/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        valve_id:record.id
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addValveModal: false,
        });
        that.handleSearchValves()
      }
    });
  }
  handleRemoveElectricValve=(record)=>{
    const that=this
    this.props.dispatch({
      type: 'electric_valves/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        valve_id:record.id
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addValveModal: false,
        });
        that.handleSearchElectricValves()
      }
    });
  }
  render() {
    const {
      device_parameters: {data, loading, meta},double_ball_valves,electric_valves
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '单位',
        dataIndex: 'data_unit',
      },
      {
        title: '所属采集器编号',
        dataIndex: 'collector_number',
      },
      {
        title: '所属采集器名称',
        dataIndex: 'collector_name',
      },

      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record,index) => {
            return <Fragment>
              <Popconfirm title={'确定要删除吗?'}
                          onConfirm={()=>this.handleRemove(index)}>
                <a >删除</a>
              </Popconfirm>

            </Fragment>
        }
      },

    ];
    const double_ball_valves_columns= [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '所属采集器编号',
        dataIndex: 'collector_number',
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemoveValve(record)}>
              <a >删除</a>
            </Popconfirm>

          </Fragment>
        }
      },

    ];
    const electric_valves_columns= [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '所属采集器编号',
        dataIndex: 'collector_number',
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemoveElectricValve(record)}>
              <a >删除</a>
            </Popconfirm>

          </Fragment>
        }
      },

    ];
    return (
      <div>
        <div className="info-page-container" >
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 参数列表 <Button style={{float: 'right'}} type='primary' size="small"
                                                                onClick={()=> {
                                                                  this.setState({
                                                                    addModal: true
                                                                  })
                                                                }}>绑定参数</Button></div>} key="1"
            >
              <Table
                style={{backgroundColor:'#fff'}}
                loading={loading}
                rowKey={'id'}
                dataSource={data}
                columns={columns}
                size="small"
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['2']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 球阀管理 <Button style={{float: 'right'}} type='primary' size="small"
                                                                onClick={()=> {
                                                                  this.setState({
                                                                    addValveModal: true
                                                                  })
                                                                }}>添加球阀</Button></div>} key="2"
            >
              <Table
                style={{backgroundColor:'#fff'}}
                loading={double_ball_valves.loading}
                rowKey={'id'}
                dataSource={double_ball_valves.data}
                columns={double_ball_valves_columns}
                size="small"
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['2']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 电控阀门管理 <Button style={{float: 'right'}} type='primary' size="small"
                                                                onClick={()=> {
                                                                  this.setState({
                                                                    addElectricModal: true
                                                                  })
                                                                }}>添加电控阀门</Button></div>} key="2"
            >
              <Table
                style={{backgroundColor:'#fff'}}
                loading={electric_valves.loading}
                rowKey={'id'}
                dataSource={electric_valves.data}
                columns={electric_valves_columns}
                size="small"
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Modal
            title={'绑定参数'}
            visible={this.state.addModal}
            centered
            onCancel={()=> {
              this.setState({addModal: false})
            }}
            onOk={this.handleAdd}
          >
            <AddParams
              wrappedComponentRef={(inst) => this.AddParams = inst}/>

          </Modal>
          <Modal
            title={'添加球阀'}
            visible={this.state.addValveModal}
            centered
            onCancel={()=> {
              this.setState({addValveModal: false})
            }}
            onOk={this.handleAddValve}
          >
            <AddValve
              wrappedComponentRef={(inst) => this.AddValve = inst}/>

          </Modal>
          <Modal
            title={'添加电控阀门'}
            visible={this.state.addElectricModal}
            centered
            onCancel={()=> {
              this.setState({addElectricModal: false})
            }}
            onOk={this.handleAddElectricValve}
          >
            <AddValve
              type={"AddElectricValve"}

              wrappedComponentRef={(inst) => this.AddElectricValve = inst}/>

          </Modal>
        </div>
      </div>
    );
  }
}

export default TableList;
