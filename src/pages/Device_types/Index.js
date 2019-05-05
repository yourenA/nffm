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
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Index.less';
const FormItem = Form.Item;
const {Description} = DescriptionList;

/* eslint react/no-multi-comp:0 */
@connect(({device_types, loading}) => ({
  device_types,
}))
@Form.create()
class TableList extends PureComponent {
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
    stepData: {},
    mqttInfo: {}
  };


  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'device_types/fetch',
      payload: {
        page: 1,
        per_page: 30,
      },

    });
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


  handleModalVisible = flag => {
    this.setState({
      addModal: !!flag,
    });
  };
  setStep = (step)=> {
    this.setState({
      current: step
    })
  }
  setStepData = (data, step)=> {
    // console.log('data',data)
    this.setState({
      stepData: data
    }, function () {
      console.log('setStepData', this.state.stepData)
      this.setStep(step)
    })
  }

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_types/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
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
                    ...values,
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

  getMqttInfo = (id)=> {
    const that = this;
    request(`/device_types/${id}/mqtt_account`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        mqttInfo: response.data.data,
        mqttModal: true
      })
    });
  }
  handleDelete = id => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_types/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除视图模板成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  };
  render() {
    const {
      device_types: {data, loading, meta},
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
          this.setState({
            editModal: true,
            editRecord: record
          })
        }
        if (e.key === 'mqtt') {
          this.getMqttInfo(record.id)
        }
        if (e.key === 'view') {
          dispatch(routerRedux.push(`/device/device_types/info/views?id=${record.id}&&name=${record.name}`));
        }
        if (e.key === 'sensors') {
          dispatch(routerRedux.push(`/device/device_types/info/sensors?id=${record.id}&&name=${record.name}`));

        }
        if (e.key === 'configs') {
          dispatch(routerRedux.push(`/device/device_types/info/configs?id=${record.id}&&name=${record.name}`));

        }
      }}>
        <Menu.Item key="edit">
          编辑
        </Menu.Item>
        <Menu.Item key="configs">
          设备配置
        </Menu.Item>
        <Menu.Item key="sensors">
          传感器列表
        </Menu.Item>
        <Menu.Item key="view">
          设备视图
        </Menu.Item>
        <Menu.Item key="mqtt">
          MQTT信息
        </Menu.Item>
        <Menu.Item key="delete">
          删除
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '设备类型名称',
        dataIndex: 'name',
      },
      {
        title: '设备类型型号',
        dataIndex: 'model',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <Link to={`/device/device_types/info/views?id=${record.id}&name=${record.name}`}>查看型号视图</Link>
          </Fragment>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize})
      },
    };
    return (
      <div>
        <Card bordered={false}>

          <div className={styles.tableList}>
            <Table
              className={styles.whiteBg}
              loading={loading}
              rowKey={'id'}
              dataSource={data}
              columns={columns}
              size="large"
              pagination={paginationProps}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default TableList;
