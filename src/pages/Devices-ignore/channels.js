import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {PageHeader, Input, Table, Form, Card, Button, Col, Select, message, Row,Tooltip,Badge} from 'antd';
import styles from './TableList.less';
import findIndex from 'lodash/findIndex'
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea
@connect(({device_types, loading}) => ({
  device_types,
}))
@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      channels: [],
      editChannels:{}
    }
  }

  componentDidMount() {
    this.fetchCurrent()
  }
  fetchCurrent=()=>{
    const that = this;
    request(`/devices/${this.props.history.location.query.id}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.props.form.setFieldsValue({
          name:response.data.data.name,
          number:response.data.data.number,
          remark:response.data.data.remark,
          device_type_id:response.data.data.device_type_id,
        })
        const editChannels=that.state.editChannels;
        for(let i=0;i<response.data.data.channels.length;i++){
          if(response.data.data.channels[i].is_editable===1){
            editChannels[response.data.data.channels[i].number]={};
            editChannels[response.data.data.channels[i].number].name=response.data.data.channels[i].name
            editChannels[response.data.data.channels[i].number].alias=response.data.data.channels[i].alias
            editChannels[response.data.data.channels[i].number].sensor_id=response.data.data.channels[i].installed_sensor?response.data.data.channels[i].installed_sensor.id:''
          }
        }
        console.log('editChannels',editChannels)
        that.setState({
          editChannels:editChannels,
          channels: response.data.data.channels
        })
      }
    })
  }
  render() {
    const columns = [
      {
        title: '通道编号',
        dataIndex: 'number',
      },
      {
        title: '通道名称',
        dataIndex: 'name',
      },
      {
        title: '通道别名',
        dataIndex: 'alias',

      },
      {
        title: '是否物理通道',
        dataIndex: 'is_physical',
        render:(text,record)=>{
          return text===-1?<div><Badge status="error" />否</div>:<div><Badge status="success" />是</div>
        }
      },
      {
        title: '数据单位',
        dataIndex: 'data_unit',
      },
      {
        title: '数据类型',
        dataIndex: 'data_type',
        render:(text,record)=>{
          let data_type = ''
          switch (text.toString()) {
            case '1':
              data_type = '整型';
              break;
            case '2':
              data_type = '浮点型';
              break;
            case '3':
              data_type = '字符型';
              break;
            default:
              break
          }
          return data_type
        }
      },
      {
        title: '保留小数位',
        dataIndex: 'data_accuracy',
      },
      {
        title: '已接入的传感器型号/名称',
        dataIndex: 'installed_sensor',
        render: (text, record) => {
          return  text?`${text.model}/${text.name}`:''
        }
      },
    ];
    return (
      <div>
        <Card bordered={false} style={{marginTop: '24px'}}>
            <Table
              size='small'
              rowKey={'number'}
              dataSource={this.state.channels}
              columns={columns}
              pagination={false}
              style={{marginBottom:'16px'}}
            />
        </Card>

      </div>
    );
  }
}

export default SearchList
