/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber, } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const { TextArea } = Input;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="传感器编号">
          {getFieldDecorator(`number`, {
            initialValue: this.props.editRecord ? this.props.editRecord.number:'' ,
            rules: [{required: true, message: '请输入传感器编号'}],
          })(
            <Input disabled={this.props.editRecord ? true:false }/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="传感器名称">
          {getFieldDecorator(`name`, {
            initialValue: this.props.editRecord ? this.props.editRecord.name:'' ,
            rules: [{required: true, message: '请输入传感器名称'}],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="数据单位">
          {getFieldDecorator(`data_unit`, {
            initialValue: this.props.editRecord ? this.props.editRecord.data_unit:'' ,
            rules: [{required: true, message: '请输入数据单位'}],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="传感器数据类型"
        >
          {getFieldDecorator(`data_type`, {
            initialValue: this.props.editRecord ? String(this.props.editRecord.data_type) : '1' ,
            rules: [{required: true, message: '请选择传感器数据类型'}],
          })(
            <Radio.Group>
              <Radio value="1">整型</Radio>
              <Radio value="2">浮点型</Radio>
              <Radio value="3">字符型</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="是否可控"
        >
          {getFieldDecorator(`is_controllable`, {
            initialValue: this.props.editRecord ? String(this.props.editRecord.is_controllable) : '1' ,
            rules: [{required: true, message: '请选择是否可控'}],
          })(
            <Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="-1">否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
