import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Row, Col, Form, Card, Select, Input, Table, Alert, Tabs, Transfer, Tooltip} from 'antd';
import {Collapse, Button} from 'antd';
import {routerRedux} from 'dva/router';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const {Option} = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({device_real_data}) => ({
  device_real_data,
}))
class CoverCardList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
    this.echarts = window.echarts;
    this.name = this.props.history.location.query.name
    this.id = this.props.history.location.query.id
    this.myChart=[];
    this.state = {
      showVisible: false,
      targetKeys: [],
      selectedKeys: [],
    }
  }

  componentDidMount() {
    const that=this;
    this.handleSearch()
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

        that['myChart' + i] = that.echarts.init(document.querySelector(`.real_time_chart_${i}`));
        that.myChart.push(that['myChart' + i]);
        let legend=[];
        let yAxis=[];
        let dataSource=[];
        let series=[]
        let date=[]
        for(let j=0;j<data[i].columns.length;j++){
          legend.push(data[i].columns[j].name);
          yAxis.push({
            type: 'value',
            offset:j>1?30*(j-1):0,
            name:  data[i].columns[j].name + `${data[i].columns[j].data_unit ? '(' + data[i].columns[j].data_unit + ')' : ''}`,
          });

          series.push({
            name: data[i].columns[j].name,
            type: 'line',
            data:  data[i].columns[j].data.reduce((pre,item)=>{pre.push(item.value);return pre},[]).reverse(),
            yAxisIndex: j,

            smooth: true,
          });
          dataSource.push({
            [ data[i].columns[j].name]:data[i].columns[j].data
          })
        }
        let parseData=that.transformData(dataSource);
        for (let i=0;i<parseData.length;i++){
          if(parseData[i] instanceof Array){
            parseData=parseData[0]
          }
        }
        // console.log('legend',legend)
        // console.log('yAxis',yAxis)
        // console.log('parseData',parseData);
        for(let k=0;k<parseData.length;k++){
          date.push( moment(parseData[k].timestamp).format('MM-DD HH:mm:ss'))
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
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.resizeChart)
  }
  handleSearch = (cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_real_data/fetch',
      payload: {
        device_id: that.props.history.location.query.id
      },
      callback: function () {
        const {
          device_real_data: {data, loading},
        } = that.props;
        that.dynamic(data);
        if(that.timer){
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.handleSearch();
        },5000)
      }

    });
  }
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({targetKeys: nextTargetKeys});

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  }

  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  transformData = (original)=> {
    const mapOriginal = original
      .map(item => Object.keys(item).map(category => item[category].map(categoryData => ({
        ...categoryData,
        [category]: categoryData.value,
        [`${category}_status`]: categoryData.status,
      }))))
      .reduce((a, b) => (a.reduce((p, n) => p.concat(n),[]))
        .concat(
          (b.reduce((p, n) => p.concat(n),[]))
        )
      )
    const obj = {}
    mapOriginal.forEach(d => {
      if (!obj[d.timestamp]) {
        obj[d.timestamp] = d
      }
      Object.assign(obj[d.timestamp], d)
    })
    return Object.values(obj).map(item => {
      delete item['value']
      delete item['status']
      return item
    })
  }

  render() {
    const {
      device_real_data: {data, loading},
    } = this.props;
    const renderItem = data.map((item, index)=> {
      const columns = [{
        title: '时间',
        dataIndex: 'timestamp',
        width:`${1/(item.columns.length+1)*100}%`,
        render:(text)=>{
        return moment(text).format('MM-DD HH:mm:ss')
      }
      }];
      const dataSource = []
      for (let i = 0; i < item.columns.length; i++) {
        if(i===item.columns.length-1){
          columns.push({
            title: <Tooltip title={item.columns[i].alias + `${item.columns[i].data_unit ? '(' + item.columns[i].data_unit + ')' : ''}`}>
              <span>{item.columns[i].name + `${item.columns[i].data_unit ? '(' + item.columns[i].data_unit + ')' : ''}`}</span>
            </Tooltip> ,
            dataIndex: item.columns[i].name,
          })
        }else{
          columns.push({
            title: <Tooltip title={item.columns[i].alias + `${item.columns[i].data_unit ? '(' + item.columns[i].data_unit + ')' : ''}`}>
              <span>{item.columns[i].name + `${item.columns[i].data_unit ? '(' + item.columns[i].data_unit + ')' : ''}`}</span>
            </Tooltip> ,
            width:`${1/(item.columns.length+1)*100}%`,
            dataIndex: item.columns[i].name,
          })
        }

        dataSource.push({
          [item.columns[i].name]:item.columns[i].data
        })

      }
      let data=this.transformData(dataSource);

      for (let i=0;i<data.length;i++){
        if(data[i] instanceof Array){
          data=data[0]
        }
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
            <h3 style={{marginBottom:'0'}}>{item.name}</h3>
          }
        >
              <div style={{width: '100%', height: '200px'}} className={`real_time_chart_${index}`}></div>
              <Table size="small" rowKey="timestamp"   scroll={{ y: 140 }} columns={columns} dataSource={data} bordered={true} pagination={false}/>
        </Card>
      </Col>
    })
    return (
      <div>
        <Card bordered={false} style={{marginTop: '24px'}}>
          <div><Row  gutter={12}>
            <Alert style={{margin:'6px'}} message="数据每隔5秒刷新一次" type="info"  />
            {renderItem}
          </Row></div>

        </Card>
      </div>
    );
  }
}

export default CoverCardList;
