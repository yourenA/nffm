import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Alert,
  PageHeader,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './TableList.less';
import AddOrEditDevice from './AddOrEditDevice2'
import find from 'lodash/find'
const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const {Description} = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({devices, loading,system_configs}) => ({
  devices,system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
  }
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    page: 1,
    per_page: 30,
    number: '',
    name: '',
    editRecord: {},
    current: 0,
    refresh_second:1,
    stepData: {},
    mqttInfo: {}
  };


  componentDidMount() {
    let params = {}
    if (this.props.location.search) {
      const search = this.props.location.search.substring(1);
      const searchArr = search.split("&");
      for (let i = 0; i < searchArr.length; i++) {
        var tmp_arr = searchArr[i].split("=");

        if (tmp_arr[0] === 'page'||tmp_arr[0] === 'page') {
          params[tmp_arr[0]]=Number(tmp_arr[1])

        }else{
          params[tmp_arr[0]]=decodeURI(tmp_arr[1])
          this.props.form.setFieldsValue({[tmp_arr[0]]:decodeURI(tmp_arr[1])})
        }
      }
      // console.log('params', params)
      // this.handleSearch(params)
    }else{
      params={
        page: 1,
        per_page: 30,
        number: '',
        name: '',
      }
    }

    const that=this;
    that.handleSearch(params)

  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
  }
  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        },function () {
          dispatch(routerRedux.replace(`/device/devices/list?name=${encodeURI(this.state.name)}&number=${encodeURI(this.state.number)}&page=${this.state.page}&per_page=${this.state.per_page}`)
          )
        });
        if (cb) cb()
      }
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      number: '',
      name: '',
      per_page: 30
    })
  }

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('number')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;

                  const values = {
                    ...fieldsValue,
                  };
                  this.handleSearch({
                    page: this.state.page,
                    per_page: this.state.per_page,
                    name: values.name?values.name:'',
                    number: values.number?values.number:'',
                  })

                });
              }}>
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    return this.renderSimpleForm()
  }

  handleDelete = id => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除设备成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          number: that.state.number,
          name: that.state.name,
        });
      }
    });
  };
  resetItem = id=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/resetPassword',
      payload: {id},
      callback: ()=> {
        message.success('重置设备密码成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
          number: this.state.number,
          name: this.state.name,
        })
      }
    });
  }
  handleEdit = ()=> {
    const formValues = this.EditDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'devices/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改设备成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          number: that.state.number,
          name: that.state.name,
        });
      }
    });
  }
  handleAdd = ()=> {
    const formValues = this.AddDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'devices/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('新建设备成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          number: that.state.number,
          name: that.state.name,
        });
      }
    });
  }
  getMqttInfo = (id)=> {
    const that = this;
    request(`/devices/${id}/mqtt_account`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        mqttInfo: response.data.data,
        mqttModal: true
      })
    });
  }

  render() {
    const {
      devices: {data, loading, meta},
    } = this.props;
    const { dispatch } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">关闭</Menu.Item>
      </Menu>
    );
    const that = this;
    const itemMenu = (record)=> (
      <Menu onClick={(e)=> {
        if (e.key === 'delete') {
          Modal.confirm({
            title: '删除设备',
            content: `确定删除 ${record.name} 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.handleDelete(record.id),
          })
        }
        if (e.key === 'edit') {
         // dispatch(routerRedux.push(`/device/devices/add_or_edit?id=${record.id}`))
          this.setState({
            editRecord:record,
            editModal:true
          })
        }
        if (e.key === 'mqtt') {
          this.getMqttInfo(record.id)
        }
        if (e.key === 'views') {
          dispatch(routerRedux.push(`/device/devices/info/views?id=${record.id}&&name=${record.name}`));
        }
        if (e.key === 'history') {
          dispatch(routerRedux.push(`/device/devices/info/history?id=${record.id}&&name=${record.name}`));

        }
        if (e.key === 'history') {
          dispatch(routerRedux.push(`/device/devices/info/history?id=${record.id}&&name=${record.name}`));
        }
        if (e.key === 'error') {
          dispatch(routerRedux.push(`/device/devices/info/error?id=${record.id}&&name=${record.name}`));
        }

      }}>
        <Menu.Item key="history">
          历史数据
        </Menu.Item>
        <Menu.Item key="views">
          设备视图
        </Menu.Item>
        {
          record.services.indexOf('error')>=0&&<Menu.Item key="error">
            故障信息
          </Menu.Item>
        }
        <Menu.Item key="edit">
          编辑
        </Menu.Item>
        <Menu.Item key="delete">
          删除
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'number',
        render(val, record, index){
          return <p className="primary_text" onClick={()=> {
            that.setState({
              editRecord: record,
            }, function () {
              setTimeout(function () {
                that.setState({
                  showModal: true,
                })
              }, 200)

            })
          }}>{val}</p>
        }
      },
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <Link to={`/device/devices/info/real_time?id=${record.id}&&name=${record.name}`}>实时数据</Link>
            <Divider type="vertical"/>
            <Link to={`/device/devices/info/parameters?id=${record.id}&&name=${record.name}`}>设备参数/阀门</Link>
            <Divider type="vertical"/>
            {
              record.services.indexOf('double_ball_valve_control')>=0&&<span>
                <Link to={`/device/devices/info/valves?id=${record.id}&&name=${record.name}`}>阀门控制</Link>
            <Divider type="vertical"/>
              </span>
            }
            {
              record.services.indexOf('electric_valve_control')>=0&&<span>
                <Link to={`/device/devices/info/electric_valves?id=${record.id}&&name=${record.name}`}>电控阀门控制</Link>
            <Divider type="vertical"/>
              </span>
            }
            <Dropdown overlay={itemMenu(record)}>
              <a >更多<Icon type="down"/></a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal:total => `共 ${total} 项`,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,name:this.state.name,number:this.state.number})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,name:this.state.name,number:this.state.number})
      },
    };
    return (
      <div>
        <PageHeader
          style={{ margin: '-24px -24px 0' }}
          title={'设备列表'}
        />
        <div className="info-page-container" >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={
                ()=>{this.setState({
                  addModal:true
                })}
              }>
                新建设备
              </Button>
            </div>
            <Table
              style={{backgroundColor:'#fff'}}
              className="custom-small-table"
              loading={loading}
              rowKey={'id'}
              dataSource={data}
              columns={columns}
              pagination={paginationProps}
            />
          </div>
          <Modal
            title={this.state.editRecord.number + '详情'}
            destroyOnClose
            visible={this.state.showModal}
            footer={null}
            centered
            width={700}
            onCancel={()=> {
              this.setState({showModal: false, editRecord: {}})
            }}
          >
            <div style={{overflow: 'hidden'}}>
              <DescriptionList className={styles.headerList} size="small" col="2">
                <Description term="id"> {this.state.editRecord.id}</Description>
                <Description term="编号"> {this.state.editRecord.number}</Description>
                <Description term="名称"> {this.state.editRecord.name}</Description>
                <Description term="状态">
                  <Badge status={this.state.editRecord.is_online === 1 ? 'success' : 'error'}
                         text={this.state.editRecord.is_online === 1 ? '在线' : '离线'}/>
                </Description>
                <Description term="协议">{this.state.editRecord.protocol}</Description>
                <Description term="登录时间">{this.state.editRecord.logined_at}</Description>
                <Description term="创建时间">{this.state.editRecord.created_at}</Description>
                <Description term="备注">{this.state.editRecord.remark}</Description>
              </DescriptionList>
            </div>

          </Modal>
          <Modal
            title={'新建设备'}
            visible={this.state.addModal}
            centered
            onCancel={()=> {
              this.setState({addModal: false})
            }}
            onOk={this.handleAdd}
          >
            <AddOrEditDevice
              wrappedComponentRef={(inst) => this.AddDevice = inst}/>

          </Modal>
          <Modal
            title={'编辑' + this.state.editRecord.number }
            destroyOnClose
            visible={this.state.editModal}
            centered
            onOk={this.handleEdit}
            onCancel={()=> {
              this.setState({editModal: false, editRecord: {}})
            }}
          >
            <AddOrEditDevice editRecord={this.state.editRecord}
                             wrappedComponentRef={(inst) => this.EditDevice = inst}/>

          </Modal>
        </div>
      </div>
    );
  }
}

export default TableList;
