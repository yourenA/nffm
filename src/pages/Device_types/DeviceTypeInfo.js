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
      case 'valves':
        dispatch(routerRedux.replace(`/views/device_views/info/views?id=${this.id}&&name=${this.name}`));
        break;
      default:
        break;
    }
  }
  componentWillReceiveProps=(nextProps)=>{
    const nextPathname=nextProps.history.location.pathname.split('/')
    const  nextLastPathname=nextPathname[nextPathname.length-1];
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
          <TabPane tab="设备型号视图" key="views"></TabPane>
        </Tabs>
        {this.props.children}

        </div>
    );
  }
}

export default SearchList;
