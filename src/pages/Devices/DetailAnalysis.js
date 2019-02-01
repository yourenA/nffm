import React, {PureComponent} from 'react';
import { Tabs,DatePicker,Button,Table,Card, Select,Empty} from 'antd';
import request from "@/utils/request";
import moment from "moment"
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
    this.echarts = window.echarts;
    this.myChart = [];
    this.state = {
      data: [],
      initRange:[moment(new Date(), 'YYYY-MM-DD').subtract('month', 1), moment(new Date(), 'YYYY-MM-DD')],
      sensor_id:""
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.getData({
      start:this.state.initRange[0].valueOf(),
      end:this.state.initRange[1].valueOf(),
      sensor_id:this.state.sensor_id
    });

  }

  getData = (values)=> {
    console.log('get data')
    const that = this;
    request(`/device_values/${this.props.data.id}`, {
      method: 'get',
      params: {
        started_timestamp:values.start,
        ended_timestamp:values.end,
        sensor_number:values.sensor_id,
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data
      },function () {
        that.dynamic(that.state.data);
      })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  dynamic = (data)=> {

    if (data.length === 0) {
      return
    }

    const that = this;
    setTimeout(function () {
      for (let i = 0; i < data.length; i++) {
        that['myChart' + i] = that.echarts.init(document.querySelector(`.detail-item-${i}`));
        that.myChart.push(that['myChart' + i])
        let xData = [];
        let yData = [];
        for(let j=0;j<data[i].values.length;j++){
          xData.push(data[i].values[j].timestamp)
          yData.push(data[i].values[j].value)
        }
        let option = {
          title : {
            text: "传感器: "+data[i].number,
            x:'right'
          },
          backgroundColor: '#eee',
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
          xAxis: {
            type: 'category',
            data: xData,
            name: '时间戳',
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            data: yData,
            type: 'bar',
            large: true,
            label: {
              normal: {
                show: true,
                position: 'inside'
              }
            },
          }]
        };


        that['myChart' + i].setOption(option);

      }
    }, 300)


  }
  onChange=(value, dateString)=>{
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    this.setState({
      initRange:value
    })
  }
  onOk=(value)=>{
    console.log('onOk: ', value);
    this.setState({
      initRange:value
    },function () {
      this.getData({
        start:this.state.initRange[0].valueOf(),
        end:this.state.initRange[1].valueOf(),
        sensor_id:this.state.sensor_id
      });
    })
  }
  handleChange=(value)=>{
    console.log('value',value)
    this.setState({
      sensor_id:value
    },function () {
      this.getData({
        start:this.state.initRange[0].valueOf(),
        end:this.state.initRange[1].valueOf(),
        sensor_id:this.state.sensor_id
      });
    })
  }
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return (index+1)
        }
      },
      {title: '时间戳', dataIndex: 'timestamp', key: 'timestamp'},
      {title: '时间', dataIndex: 'time', key: 'time',render: (val, record, index) => {
        return moment(record.timestamp).format('YYYY-MM-DD hh:mm:ss')
      }},
      {title: '读值', dataIndex: 'value', key: 'value'},
    ];
    return (
          <Card bordered={false} style={{margin: '-16px -16px 0'}}>
            时间区间: <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange}
              onOk={this.onOk}
              value={this.state.initRange}
            />
            <div style={{marginTop:'12px'}}>
              传感器编号: <Select value={this.state.sensor_id}  style={{ width: 120 }}  allowClear={true}  onChange={this.handleChange}>
                {
                  this.props.data.sensors.map((item,index)=>{
                    return  <Option key={item.number} value={item.number} >{item.number} </Option>
                  })
                }
              </Select>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane tab="折线图" key="1">
                {this.state.data.length>0?
                  <div>
                    {this.state.data.map((item, index)=> {
                      return   <div key={index} className={ `detail-item-${index}`} style={{marginBottom:'16px',width: '100%', height: '300px'}}></div>

                    })}

                  </div>
                  : <Empty />}
              </TabPane>
              <TabPane tab="表格" key="2">
                {this.state.data.length > 0 ?
                  <div>
                    {this.state.data.map((item, index)=> {
                      return  <Table
                        key={index}
                        style={{marginTop:'12px'}}
                        title={() => <h3>传感器: {item.number}</h3>}
                        bordered
                        columns={columns}
                        dataSource={item.values}
                        pagination={false}
                        size="small"
                        rowKey={record => record.timestamp}
                      />

                    })}

                  </div>
                  : <Empty />
                }

              </TabPane>
            </Tabs>

          </Card>
    );
  }
}
