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
  }
  render() {
    const {device_types}=this.props
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };
    return (
      <div>
          <Form  onSubmit={this.handleSubmit} >
            <Form.Item label="设备编号" {...formItemLayout}>
              {getFieldDecorator(`number`, {
                initialValue:this.props.editRecord ? this.props.editRecord.number : '',
                rules: [{required: true, message: '请输入设备编号'}],
              })(
                <Input disabled={this.props.editRecord?true:false}/>

              )}
            </Form.Item>
            <Form.Item label="设备名称"  {...formItemLayout}>
              {getFieldDecorator(`name`, {
                initialValue: this.props.editRecord ? this.props.editRecord.name : '',
                rules: [{required: true, message: '请输入设备名称'}],
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator(`remark`, {
                initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
              })(
                <TextArea rows={2} />
              )}
            </Form.Item>
          </Form>

      </div>
    );
  }
}

export default SearchList
