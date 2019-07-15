import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import moment from 'moment';
import {connect} from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Badge,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  message ,
  Select,
} from 'antd';
import request from '@/utils/request';


@connect(({user_manage, loading}) => ({
}))
@Form.create()
class BasicList extends PureComponent {
  state = {
    visible: false,
    done: false,
    page: 1,
    per_page: 30
  };

  componentDidMount() {
    request(`/users`,{
      method:'GET',
    })
  }


  render() {
    return (
      <div className="info-page-container" >
        <Card style={{height:'100%'}}>
          <p style={{margin:'50px auto',fontSize:'28px',textAlign:'center'}}>南方阀门智慧产品设备数据平台</p>
        </Card>
      </div>

    )
  }
}

export default BasicList;
