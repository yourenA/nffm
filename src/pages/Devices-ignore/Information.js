import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import request from '@/utils/request';
import { PageHeader,Badge,Table,Divider,Card,Button,Modal ,message   } from 'antd';
import AddOrEditSensors from './AddOrEditSensor'
import DescriptionList from '@/components/DescriptionList';
const {Description} = DescriptionList;
@connect(({information, loading}) => ({
  information,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    console.log(this.props)
    this.state = {
      mqttInfo:{},
      editRecord:{}
    };
  }

  componentDidMount() {
    this.handleSearch()
  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'information/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        if (cb) cb()
      }
    });
    request(`/devices/${that.props.history.location.query.id}/mqtt_account`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        mqttInfo: response.data.data,
      })
    });
  }
  render() {
    const {
      information: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '属性值',
        dataIndex: 'value',
      },
    ];
    return (
      <div>
        <Card style={{marginTop:'24px'}}>
          <h2 style={{margin:'0 0 5px 0'}}>设备信息</h2>
          <Table
            size='small'
            loading={loading}
            rowKey={'name'}
            dataSource={data}
            columns={columns}
            pagination={false}
          />

          <h2 style={{margin:'15px 0 8px 0'}}>MQTT信息</h2>
          <DescriptionList  size="small" col="4">
            <Description term="用户名"> {this.state.mqttInfo.username}</Description>
            <Description term="密码"> {this.state.mqttInfo.password}</Description>

          </DescriptionList>
          {
            this.state.mqttInfo.topics && this.state.mqttInfo.topics.map((item, index)=> {

              return(
                <div style={{marginTop:'10px'}} key={index}>
                  <DescriptionList size="small" col="4" >
                    <Description term="主题名称"> {item.name}</Description>
                    <Description term="是否允许发布"> {item.allow_publish === 1 ? '是' : '否'}</Description>
                    <Description term="是否允许订阅"> {item.allow_subscribe === 1 ? '是' : '否'}</Description>
                  </DescriptionList>
                </div>

              )
            })
          }
        </Card>
        </div>
    );
  }
}

export default SearchList;
