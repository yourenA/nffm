import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List ,Form,Steps,Modal,message,Drawer,Badge,Menu,Dropdown} from 'antd';
import Step1 from './StepForm/Step1'
import Step2 from './StepForm/Step2'
import Step3 from './StepForm/Step3'
import Step4 from './StepForm/Step4'
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DetailAnalysis from './DetailAnalysis';
import SendData from './SendData';
import styles from './Index.less';
const { Step } = Steps;
@connect(({ devices, loading }) => ({
  devices,
}))
@Form.create()
class Devices extends PureComponent {
  state = {
    addContent: false,
    stepData:{},
    current: 0,
    page: 1,
    per_page: 30
  };
  hideContent=()=>{

    this.setState({
      current: 0,
      stepData:{},
      addContent:false
    })
    this.handleSearch({
      page: this.state.page,
      per_page: this.state.per_page,
    })
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'devices/fetch',
      payload: {
        page: 1,
        per_page: 30
      },

    });
  }
  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/fetch',
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
  setStep=(step)=>{
    this.setState({
      current:step
    })
  }
  setStepData=(data,step)=>{
    // console.log('data',data)
    this.setState({
      stepData:data
    },function () {
      console.log('setStepData',this.state.stepData)
      this.setStep(step)
    })
  }
  deleteItem = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除设备成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
        })
      }
    });
  };
  resetItem = id=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'devices/resetPassword',
      payload: {id},
      callback: ()=> {
        message.success('重置设备密码成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
        })
      }
    });
  }
  render() {
    const {
      devices: { data,loading ,meta},
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          添加"设备"同时添加"传感器信息"与"主题信息"
        </p>
        <p>点击设备名称查看传感器历史数据</p>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="设备列表"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
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

    const itemMenu =(item)=> (
      <Menu onClick={(e)=>{
        console.log('key',e.key)
        if(e.key==='delete'){
          Modal.confirm({
            title: '删除设备',
            content: '确定删除该设备吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(item.id),
          })
        }
        if(e.key==='reset'){
          Modal.confirm({
            title: '密码重置',
            content: '确定重置该设备密码吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.resetItem(item.id),
          })
        }
      }}>
        <Menu.Item key="reset">
            重置密码
        </Menu.Item>
        <Menu.Item key="delete">
            删除
        </Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderWrapper title="设备列表" content={content} extraContent={extraContent}>
        {!this.state.addContent?
          <div className={styles.cardList}>
            <List
              rowKey="id"
              loading={loading}
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              dataSource={['', ...data]}
              pagination={paginationProps}
              renderItem={item =>
                item ? (
                  <List.Item key={item.id}>
                    <Card hoverable className={styles.card} actions={[
                      <a onClick={()=>{this.setState({detailModal:true,stepData:{...item}})}}>详情</a>
                      ,<a onClick={()=>{this.setState({addContent:true,stepData:{...item}})}}>编辑</a>,
                      <a onClick={()=>{this.setState({senDataModal:true,stepData:{...item}})}}>发送数据</a>,
                      <Dropdown overlay={itemMenu(item)}>
                        <span>更多</span>
                      </Dropdown>
                    ]}>
                      <Card.Meta
                        title={<span>

                          {item.is_online === -1 && <span>离线<Badge status="error" style={{marginLeft: '5px',marginTop: '-5px'}}/></span>}
                          {item.is_online === 1 && <span>在线<Badge status="success" style={{marginLeft: '5px',marginTop: '-5px'}}/></span>}
                          <a className={styles.title} onClick={()=>{this.setState({analysisModal:true,stepData:{...item}})}}>{item.number}
                          </a>
                        </span>}
                        description={
                          <div>
                            <Ellipsis className={styles.item} lines={1}>
                              用户名 : {item.username}
                            </Ellipsis>
                            <Ellipsis className={styles.item} lines={1}>
                              密钥 : {item.password}
                            </Ellipsis>
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                ) : (
                  <List.Item>
                    <Button type="dashed" className={styles.newButton} onClick={()=>{this.setState({addContent:true,})}}>
                      <Icon type="plus" /> 新增设备
                    </Button>
                  </List.Item>
                )
              }
            />
          </div>:
        <div>
          <Card>
            <h3 style={{marginBottom:'16px'}}>{this.state.stepData.id?`修改设备${this.state.stepData.number}`:'新增设备'}</h3>
            <Fragment>

              <Steps current={this.state.current} className={styles.steps}>
                <Step title="填写设备信息" />
                <Step title="填写传感器信息" />
                <Step title="填写主题信息" />
                <Step title="提交" />
              </Steps>
              {this.state.current===0&&<Step1 hideContent={this.hideContent} stepData={this.state.stepData}  setStepData={this.setStepData} setStep={this.setStep}/>}
              {this.state.current===1&&<Step2 hideContent={this.hideContent} stepData={this.state.stepData}  setStepData={this.setStepData} setStep={this.setStep}/>}
              {this.state.current===2&&<Step3 hideContent={this.hideContent} stepData={this.state.stepData}  setStepData={this.setStepData} setStep={this.setStep}/>}
              {this.state.current===3&&<Step4 hideContent={this.hideContent}  stepData={this.state.stepData}  setStepData={this.setStepData} setStep={this.setStep}/>}
            </Fragment>
          </Card>

        </div>}
        <Modal
          title={this.state.stepData.number+'详情'}
          width={860}
          destroyOnClose
          visible={this.state.detailModal}
          footer={null}
          onCancel={()=>{this.setState({detailModal:false,stepData:{}})}}
        >
          <Step4   stepData={this.state.stepData} hideAction={true}/>

        </Modal>
        <Drawer
          title={`${this.state.stepData.number}设备传感器历史数据`}
          placement="right"
          closable={false}
          width={640}
          onClose={()=>{this.setState({stepData:{},analysisModal:false})}}
          visible={this.state.analysisModal}
        >
          {this.state.analysisModal&&<DetailAnalysis data={this.state.stepData}/>}
        </Drawer>
        <Drawer
          title={`${this.state.stepData.number} 发布消息`}
          placement="right"
          closable={false}
          width={500}
          onClose={()=>{this.setState({stepData:{},senDataModal:false})}}
          visible={this.state.senDataModal}
        >
          {<SendData data={this.state.stepData}/>}
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default Devices;
