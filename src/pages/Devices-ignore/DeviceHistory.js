import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Row, Col, Form, Card, Select, Tabs, Table, DatePicker, Divider, Transfer, Tooltip} from 'antd';
import {Collapse, Button} from 'antd';
import {routerRedux} from 'dva/router';
import request from '@/utils/request';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const {Option} = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({device_history_data,sensors}) => ({
  device_history_data,sensors
}))
class CoverCardList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.name = this.props.history.location.query.name
    this.id = this.props.history.location.query.id
    this.myChart=[];
    this.state = {
      showVisible: false,
      targetKeys: [],
      selectedKeys: [],
      date: moment(new Date(), 'YYYY-MM-DD'),
      sensor_numbers:[],
      sensors:[]
    }
  }

  componentDidMount() {
    const that=this;
    this.handleSearch()
    this.handleSearchSensors();
    window.addEventListener('resize', this.resizeChart)
  }
  dynamic=(data)=>{
    console.log('dynamic data',data)
    const that=this;
    if (data.length === 0) {
      return
    }
    setTimeout(function () {

      for (let i = 0; i < data.length; i++) {

        that['myChart' + i] = that.echarts.init(document.querySelector(`.history_chart_${i}`));
        that.myChart.push(that['myChart' + i]);
        let legend=[];
        let yAxis=[{
          type: 'value',
          name:  data[i].name + `${data[i].data_unit ? '(' + data[i].data_unit + ')' : ''}`,
        }];
        let series=[{
          name: data[i].alias,
          type: 'line',
          data:  data[i].data.reduce((pre,item)=>{pre.push(item.value);return pre},[]),
          smooth: true,
        }]
        let date=[]
        for(let k=0;k<data[i].data.length;k++){
          date.push( moment(data[i].data[k].timestamp).format('MM-DD HH:mm:ss'))
        }
        // console.log('date',date)
        let option = {
          backgroundColor: '#eee',
          tooltip: {
            trigger: 'axis'
          },

          legend: {
            data: legend
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [...date].reverse()
          },
          yAxis: yAxis,
          grid: {
            top: '20%',
            left: '3%',
            right: '5%',
            bottom: '1%',
            containLabel: true
          },
          series: series
        };
        that['myChart' + i].setOption(option);
      }
    }, 400)
  }
  componentWillUnmount() {
    console.log('reset')
    const {dispatch} = this.props;
    dispatch({
      type: 'device_history_data/reset',
      payload: {
      }

    });
    window.removeEventListener('resize', this.resizeChart)

  }
  handleSearch = (param) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_history_data/fetch',
      payload: {
        device_id: that.props.history.location.query.id,
        date:moment(this.state.date).format('YYYY-MM-DD'),
        channel_ids:this.state.sensor_numbers
      },
      callback: function () {
        that.setState({
          ...param
        })
        const {
          device_history_data: {data, loading},
        } = that.props;
        that.dynamic(data);
      }

    });
  }
  handleChange=(value)=>{
    console.log('value',value)
    this.setState({
      sensor_numbers:value
    },function () {
      this.handleSearch();
    })
  }
  onChange=(value, dateString)=>{
    this.setState({
      date:value
    },function () {
      this.handleSearch();
    })
  }
  handleSearchSensors = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    request(`/devices/${this.props.history.location.query.id}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.setState({
          sensors:response.data.data.channels
        })
      }
    })
  }
  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }

  render() {
    const {
      device_history_data: {data, loading},
    } = this.props;
    const renderItem = data.map((item, index)=> {
      const columns = [{
        title: '时间',
        dataIndex: 'timestamp',
        width: '50%',
      render:(text)=>{
        return moment(text).format('MM-DD HH:mm:ss')
      }
      },
        {
          title: <Tooltip title={item.remark + `${item.data_unit ? '(' + item.data_unit + ')' : ''}`}>
            <span>{item.name + `${item.data_unit ? '(' + item.data_unit + ')' : ''}`}</span>
          </Tooltip> ,
          dataIndex: item.name,
        }];
      const dataSource = []
      for (let i = 0; i < item.data.length; i++) {
        dataSource.push({
          [item.name]:item.data[i].value,
          ...item.data[i]
        })
      }
      return <Col key={index} xxl={12} xl={24} lg={24} md={24} sm={24} xs={24} style={{marginBottom: 16}}>
        <Card
          hoverable={true}
          size="small"
          headStyle={{
            paddingLeft: '10px',
          }}
          bodyStyle={{
          }}
          title={
            <h3 style={{marginBottom:'0'}}>{ item.alias}</h3>

          }
        >
          <div style={{width: '100%', height: '200px'}} className={`history_chart_${index}`}></div>
          <Table size="small" rowKey="timestamp"  scroll={{ y: 140 }} columns={columns} dataSource={[...dataSource]} bordered={true} pagination={false}/>
        </Card>
      </Col>
    })
    return (
      <div>
        <Card bordered={false} style={{marginTop: '24px'}}>
          <div style={{marginTop:'12px',marginBottom:'12px',display:'flex'}}>
            <div>
              日期: <DatePicker
              format="YYYY-MM-DD"
              onChange={this.onChange}
              onOk={this.onOk}
              value={this.state.date}
              style={{marginRight:'12px'}}
              allowClear={false}
            />
              传感器: &nbsp;
            </div>
            <div style={{flex:1}}>
               <Select value={this.state.sensor_numbers}  mode="multiple" style={{ width: '100%' }}  allowClear={true}  onChange={this.handleChange}>
              {
                this.state.sensors.map((item,index)=>{
                  return  <Option key={item.id} value={item.id} >{item.number} </Option>
                })
              }
            </Select>
            </div>

          </div>

              <div><Row gutter={12}>
                {renderItem}
              </Row></div>

        </Card>
      </div>
    );
  }
}

export default CoverCardList;
