import React, { Component } from 'react';
import styles from './valves.less';
import { connect } from 'dva';
import { Alert,Badge,InputNumber,Select,Card,Button,List ,message,Collapse,Switch   } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import findIndex from 'lodash/findIndex';
const Panel = Collapse.Panel;
const {Description} = DescriptionList;
const Option = Select.Option;
@connect(({valves, loading}) => ({
  valves,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    console.log(this.props)
    this.state = {
      editRecord:{},
      mode:'1',
      valves:[]
    };
  }

  componentDidMount() {
    this.handleSearch()
  }
  handleSearch = ( cb) => {
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

        that.setState({
          over:data.over,
          over_recover:data.over_recover,
          under:data.under,
          under_recover:data.under_recover,
          valves:valves,
          showEdit:true
        })
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
        message.success('修改阀门成功')
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
    console.log(e)
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
        <Card style={{marginTop:'24px'}}>
          <Collapse activeKey={['1']}>
            <Panel showArrow={false} header={<div>当前策略</div>} key="1"
            >
              <div style={{marginBottom:'10px'}}>
                <DescriptionList  size="small" col="4" >
                  <Description term="模式"> <h3>{data.mode===1?'手动':'自动'}</h3></Description>
                </DescriptionList>
              </div>
              {
                data.mode===2&&
                <div style={{marginBottom:'10px'}}>
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
              <Panel  showArrow={false} header={<div>修改策略</div>} key="2"
              >
                <div style={{marginBottom:'10px'}}>
                  <DescriptionList  size="small" col="4" >
                    <Description term="模式">
                      <Select   value={this.state.mode.toString()} style={{ width: 120 }} onChange={this.handleChangeMode}>
                        <Option value="1">手动</Option>
                        <Option value="2">自动</Option>
                      </Select>
                    </Description>
                  </DescriptionList>
                </div>
                {
                  this.state.mode==='2'&&
                  <div  style={{marginBottom:'10px'}}>
                    <Alert message="over必须大于overRecover，overRecover必须大于underRecover，underRecover必须大于 under" type="info"   style={{marginBottom:'10px'}} />
                    <DescriptionList  size="small" col="4" >
                      <Description term="over"> <InputNumber style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto('over',e)
                      }} defaultValue={data.over}/> Mpa</Description>
                      <Description term="overRecover">  <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto('over_recover',e)
                      }}  defaultValue={data.over_recover}/> Mpa</Description>
                      <Description term="under">  <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto('under',e)
                      }}  defaultValue={data.under}/> Mpa</Description>
                      <Description term="underRecover"> <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                        this.changeAuto("under_recover",e)
                      }}   defaultValue={data.under_recover}/> Mpa</Description>
                    </DescriptionList>
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
                  }}>确定</Button>

                </div>
              </Panel>

            </Collapse>
          }



        </Card>
        </div>
    );
  }
}

export default SearchList;
