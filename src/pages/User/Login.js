import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form,Button,Input,Icon} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],//根据 loading.effects 对象判断当前异步加载是否完成
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };


  handleSubmit = (e) => {
    e.preventDefault();
      this.props.form.validateFields({force: true},
        (err, values) => {
          console.log('values')
          if (!err) {
            this.props.dispatch({
              type: `login/login`,
              payload: {
                ...values,
                // company_id:values.company_id.key,
              },
              callback: ()=> {

              }
            });
          }
        }
      )
  }


  render() {
    const {  submitting ,form} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{
                required: true, message: '请输入用户名！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder="密码"
              />
            )}
          </FormItem>
          <FormItem >
            <Button size="large" loading={submitting} block type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default Form.create()(LoginPage);
