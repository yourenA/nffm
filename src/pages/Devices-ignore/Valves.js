import React, { Component } from 'react';
import styles from './valves.less';
import { connect } from 'dva';
import { Alert,Badge,InputNumber,Select,Card,Button,List ,message,Collapse,Switch ,Form ,Icon  } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import findIndex from 'lodash/findIndex';
const Panel = Collapse.Panel;
import find from 'lodash/find'
const {Description} = DescriptionList;
const Option = Select.Option;
@connect(({valves, loading,system_configs}) => ({
  valves,system_configs
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    this.timer=null;
    this.state = {
      editRecord:{},
      mode:'1',
      valves:[],
      over_rate:120,
      over_recover_rate:110,
      under_recover_rate:90,
      under_rate:80,
      channels:[],
      channel:'',
      refresh_second:0
    };
  }

  componentDidMount() {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'system_configs/fetch',
      payload: {

      },
      callback:()=>{
        const {system_configs}=that.props
        const refresh_second=find(system_configs.data,function (o) {
          return o.key==='valve_info_refresh_time'
        })
        if(refresh_second){
          that.setState({
            refresh_second:Number(refresh_second.value),
          },function () {
            that.handleSearch(true)
          })
        }
      }
    });
    // this.handleSearch()
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
  }
  handleSearch = (init) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'valves/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        const {
          valves: {data, loading, meta},
        } = that.props;
        let valves=[];
        if(data.valves){
          for(let i=0;i<data.valves.length;i++){
            valves.push({
              name:data.valves[i].name,
              status:data.valves[i].current_status?data.valves[i].current_status:1,
            })
          }
        }
        if(init){
          that.setState({
            over:data.over,
            over_recover:data.over_recover,
            under:data.under,
            under_recover:data.under_recover,
            valves:valves,
            channels:data.optional_channels,
            channel:data.channel_number,
            showEdit:true
          })
        }

        if(that.timer){
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.handleSearch();
        },that.state.refresh_second*1000)
      }

    });
  }
  handleEdit = ()=> {
    const that=this;
    let sendData={}
    if(this.state.mode==='2'){
      sendData.over=Number(this.state.over)
      sendData.over_recover=Number(this.state.over_recover)
      sendData.under=Number(this.state.under)
      sendData.under_recover=Number(this.state.under_recover)
      sendData.channel_number=this.state.channel
    }else if(this.state.mode==='1'){
      sendData.valves=[]
      for(let i=0;i<this.state.valves.length;i++){
        sendData.valves.push(this.state.valves[i].status===1?1:-1)
      }
    }
    console.log('sendData',sendData)
    this.props.dispatch({
      type: 'valves/edit',
      payload: {
        mode:Number(that.state.mode),
        ...sendData,
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        message.success('修改策略成功')
      }
    });
  }
  handleChangeMode=(value)=>{
    this.setState({
      mode:value
    })
  }
  changeAuto=(mode,e)=>{
    this.setState({
      [mode]:e
    })
    // console.log(e)
  }
  handleChangeValve=(valves,e)=>{
    console.log(valves,e);
    const status=e?1:-1
    const target=findIndex(this.state.valves,{name:valves})
    console.log('target',target)
    this.state.valves.splice(target,1,{name:valves,status:status})
    this.setState({
      valves:this.state.valves
    },function () {
      console.log('valves',this.state.valves)
    })

  }
  render() {
    const {
      valves: {data, loading, meta},
    } = this.props;
    return (
      <div>
        <div className="info-page-container" >
          <Collapse activeKey={['1']}>
            <Panel showArrow={false} header={<div><Icon type="box-plot" /> 当前策略</div>} key="1"
            >
              <Alert style={{marginBottom:'6px'}} message={`数据每隔${this.state.refresh_second}秒刷新一次`} type="info"  />
              <div style={{marginBottom:'6px'}}>
                <DescriptionList  size="small" col="4" >
                  <Description term="模式"> <h3>{data.mode===1?'手动':'自动'}</h3></Description>
                </DescriptionList>
              </div>
              {
                data.mode===2&&
                <div style={{marginBottom:'10px'}}>
                  <DescriptionList  size="small" col="4" >
                    <Description term="当前传感器">  {data.channel_name}</Description>
                  </DescriptionList>
                  <DescriptionList  size="small" col="4" >
                    <Description term="over"> {data.over} Mpa</Description>
                    <Description term="over_recover"> {data.over_recover} Mpa</Description>
                    <Description term="under"> {data.under} Mpa</Description>
                    <Description term="under_recover"> {data.under_recover} Mpa</Description>
                  </DescriptionList>
                </div>
              }
              {
                data.mode===1&&
                <List
                  grid={{ gutter: 16, column: 4 }}
                  dataSource={data.valves}
                  renderItem={item => (
                    <List.Item>
                      <Card className={styles.valve_card} size="small" title={item.name+`  (${item.alias})`}>
                        <h4>目标状态 : <Badge text={item.current_status===-1?'关':item.current_status===1?'开':'未知'}
                                          status={item.current_status===-1?'error':item.current_status===1?'success':'default'}  /></h4>
                      </Card>
                    </List.Item>
                  )}
                />
              }

            </Panel>

          </Collapse>
          {
            this.state.showEdit&&
            <Collapse activeKey={['2']} className={styles.valve_panel} style={{marginTop:'15'}}>
              <Panel  showArrow={false} header={<div><Icon type="sliders" /> 修改策略</div>} key="2"
              >
                <div style={{marginBottom:'10px'}}>
                  <Form layout={'inline'}>
                    <Form.Item
                      label="模式"
                    >
                      <Select   value={this.state.mode.toString()} style={{ width: 120 }} onChange={this.handleChangeMode}>
                        <Option value="1">手动</Option>
                        <Option value="2">自动</Option>
                      </Select>
                    </Form.Item>
                    {
                      this.state.mode === '2' && <Form.Item
                        label="传感器"
                      >
                        <Select value={this.state.channel}  style={{width: 150}}
                                onChange={(e)=>{
                                  this.setState({
                                    channel:e
                                  })
                                }
                                }>
                          {this.state.channels.map((item,index)=>{
                            return <Option key={index} value={item.number}>{item.display_name}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    }
                    </Form>

                </div>
                {
                  this.state.mode==='2'&&
                  <div  style={{marginBottom:'10px'}}>
                    <Form layout={'inline'}>
                      <Form.Item
                        label="over"
                      >
                        <InputNumber  onChange={(e)=>{
                          this.changeAuto('over',e)
                        }} value={this.state.over} defaultValue={data.over}/> Mpa
                      </Form.Item>
                      <Form.Item
                        label="overRecover"
                      >
                        <InputNumber   onChange={(e)=>{
                          this.changeAuto('over_recover',e)
                        }} value={this.state.over_recover} defaultValue={data.over_recover}/> Mpa
                      </Form.Item>
                      <Form.Item
                        label="underRecover"
                      >
                        <InputNumber   onChange={(e)=>{
                          this.changeAuto("under_recover",e)
                        }}  value={this.state.under_recover}  defaultValue={data.under_recover}/> Mpa
                      </Form.Item>
                      <Form.Item
                        label="under"
                      >
                        <InputNumber  onChange={(e)=>{
                          this.changeAuto('under',e)
                        }} value={this.state.under}  defaultValue={data.under}/> Mpa
                      </Form.Item>

                    </Form>
                    <Alert message="over必须大于overRecover，overRecover必须大于underRecover，underRecover必须大于 under" type="info"   style={{marginBottom:'10px'}} />
                    <h3>自动填充数据:</h3>
                    <div  style={{marginBottom:'8px'}}>
                      自动数值 : <InputNumber  onChange={(e)=>{
                        this.setState({
                          autoData:e
                        })
                    }} />
                      <Button type='primary' style={{marginLeft:'10px'}} onClick={()=>{
                        this.setState({
                          over:(this.state.autoData*(this.state.over_rate/100)).toFixed(2),
                          over_recover:(this.state.autoData*(this.state.over_recover_rate/100)).toFixed(2),
                          under_recover:(this.state.autoData*(this.state.under_recover_rate/100)).toFixed(2),
                          under:(this.state.autoData*(this.state.under_rate/100)).toFixed(2),
                        })
                      }}>计算</Button>
                    </div>

                    <Form layout={'inline'}>
                      <Form.Item
                        label="over(%)"
                      >
                        <InputNumber
                          onChange={(e)=>{
                          this.changeAuto('over_rate',e)
                        }} value={this.state.over_rate} />
                      </Form.Item>
                      <Form.Item
                        label="overRecover(%)"
                      >
                        <InputNumber
                          onChange={(e)=>{
                          this.changeAuto('over_recover_rate',e)
                        }} value={this.state.over_recover_rate} />
                      </Form.Item>
                      <Form.Item
                        label="underRecover(%)"
                      >
                        <InputNumber
                          onChange={(e)=>{
                          this.changeAuto("under_recover_rate",e)
                        }}  value={this.state.under_recover_rate}  />
                      </Form.Item>
                      <Form.Item
                        label="under(%)"
                      >
                        <InputNumber
                          onChange={(e)=>{
                          this.changeAuto('under_rate',e)
                        }} value={this.state.under_rate} />
                      </Form.Item>

                    </Form>

             {/*      <DescriptionList  size="small" col="4" >
                      <Description term="over">
                  <InputNumber  onChange={(e)=>{
                  this.changeAuto('over',e)
                  }} value={this.state.over} defaultValue={data.over}/> Mpa
                  </Description>
                      <Description term="overRecover">  <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto('over_recover',e)
                      }}  defaultValue={data.over_recover}/> Mpa</Description>
                      <Description term="under">  <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto('under',e)
                      }}  defaultValue={data.under}/> Mpa</Description>
                      <Description term="underRecover"> <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto("under_recover",e)
                      }}   defaultValue={data.under_recover}/> Mpa</Description>
                    </DescriptionList>*/}
                  </div>
                }
                {
                  this.state.mode==='1'&&
                  <div >
                    <List
                      grid={{ gutter: 16, column: 4 }}
                      dataSource={data.valves}
                      renderItem={(item,index) => (
                        <List.Item>
                          <Card className={styles.valve_card} size="small" title={item.name+`  (${item.alias})`}>
                            <h4>目标状态 :<Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.valves[index].status===1?true:false} onChange={(checked)=>this.handleChangeValve(item.name,checked)}/></h4>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </div>
                }
                <div  style={{overflow:'hidden'}}>
                  <Button type="primary" style={{float:'right'}} onClick={()=>{
                    this.handleEdit()
                  }}>修改策略</Button>

                </div>
              </Panel>

            </Collapse>
          }



        </div>
        </div>
    );
  }
}

export default SearchList;
