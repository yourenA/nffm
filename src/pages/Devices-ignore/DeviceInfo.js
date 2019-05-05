import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { PageHeader,Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const TabPane = Tabs.TabPane;
@connect()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    this.id=this.props.history.location.query.id
    const pathname=this.props.history.location.pathname.split('/')
    console.log('pathname',pathname)
    this.state={
      activeKey:pathname[pathname.length-1]
    }
  }
  handleTabChange = (key) => {
    const { dispatch } = this.props;
    this.setState({
      activeKey:key
    })
    switch (key) {
      case 'sensors':
        dispatch(routerRedux.replace(`/device/devices/info/sensors?id=${this.id}&&name=${this.name}`));
        break;
      case 'views':
        dispatch(routerRedux.replace(`/device/devices/info/views?id=${this.id}&&name=${this.name}`));
        break;
      case 'real_time':
        dispatch(routerRedux.replace(`/device/devices/info/real_time?id=${this.id}&&name=${this.name}`));
        break;
      case 'history':
        dispatch(routerRedux.replace(`/device/devices/info/history?id=${this.id}&&name=${this.name}`));
        break;
      case 'valves':
        dispatch(routerRedux.replace(`/device/devices/info/valves?id=${this.id}&&name=${this.name}`));
        break;
      case 'information':
        dispatch(routerRedux.replace(`/device/devices/info/information?id=${this.id}&&name=${this.name}`));
        break;
      case 'configs':
        dispatch(routerRedux.replace(`/device/devices/info/configs?id=${this.id}&&name=${this.name}`));
        break;
      default:
        break;
    }
  }
  componentWillReceiveProps=(nextProps)=>{
    const nextPathname=nextProps.history.location.pathname.split('/')
    const  nextLastPathname=nextPathname[nextPathname.length-1];
    console.log('nextPathname',nextLastPathname)
    this.setState({
      activeKey:nextLastPathname
    })

  }
  render() {

    return (
      <div>
      <PageHeader
        style={{ margin: '-24px -24px 0' }}
        onBack={() => this.props.history.goBack()}
        title={this.name}
      />
        <Tabs activeKey={this.state.activeKey} onChange={this.handleTabChange}  style={{ margin: '0 -24px ' ,background:'#fff',paddingLeft:'24px'}} >
          <TabPane tab="设备实时数据" key="real_time"></TabPane>
          <TabPane tab="传感器历史数据" key="history"></TabPane>
          <TabPane tab="阀门控制" key="valves"></TabPane>
          <TabPane tab="设备配置" key="configs"></TabPane>
          <TabPane tab="设备通道" key="sensors"></TabPane>
          <TabPane tab="设备信息" key="information"></TabPane>
        </Tabs>
        {this.props.children}

        </div>
    );
  }
}

export default SearchList;
