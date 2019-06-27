import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { PageHeader,Tabs,Breadcrumb } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import request from '@/utils/request';
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
      activeKey:pathname[pathname.length-1],
      number:'',
      showValve:false,
      showError:false,
      showElectricValve:false
    }
  }
  componentDidMount() {
    const that=this;
    request(`/devices/${this.id}`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        number:response.data.data.number,
        showValve:response.data.data.services.indexOf('double_ball_valve_control')>=0?true:false,
        showElectricValve:response.data.data.services.indexOf('electric_valve_control')>=0?true:false,
        showError:response.data.data.services.indexOf('error')>=0?true:false
      })
    })
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
      case 'parameters':
        dispatch(routerRedux.replace(`/device/devices/info/parameters?id=${this.id}&&name=${this.name}`));
        break;
      case 'error':
        dispatch(routerRedux.replace(`/device/devices/info/error?id=${this.id}&&name=${this.name}`));
        break;
      case 'electric_valves':
        dispatch(routerRedux.replace(`/device/devices/info/electric_valves?id=${this.id}&&name=${this.name}`));
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
        title={  <Breadcrumb>
          <Breadcrumb.Item style={{cursor:'pointer'}} onClick={() => this.props.history.goBack()}>设备列表</Breadcrumb.Item>
          <Breadcrumb.Item>{`${this.state.number}(${this.name})`}</Breadcrumb.Item>
        </Breadcrumb>}
      />
        <Tabs activeKey={this.state.activeKey} onChange={this.handleTabChange}  style={{ margin: '0 -24px ' ,background:'#fff',paddingLeft:'24px'}} >
          <TabPane tab="设备实时数据" key="real_time"></TabPane>
          <TabPane tab="设备参数/阀门" key="parameters"></TabPane>
          {
            this.state.showValve&& <TabPane tab="阀门控制" key="valves"></TabPane>
          }
          {
            this.state.showElectricValve&& <TabPane tab="电控阀门控制" key="electric_valves"></TabPane>
          }
          <TabPane tab="历史数据" key="history"></TabPane>
          <TabPane tab="设备视图" key="views"></TabPane>
          {
            this.state.showError&&  <TabPane tab="故障信息" key="error"></TabPane>
          }

        </Tabs>
        {this.props.children}

        </div>
    );
  }
}

export default SearchList;
