import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Row, Col, Form, Card, Select, Tabs, Table, DatePicker, Modal, Checkbox, Tooltip,Empty} from 'antd';
import {Collapse, Button} from 'antd';
import {routerRedux} from 'dva/router';
import request from '@/utils/request';
import {download} from '@/utils/utils';
import ExportData from './ExportForm'
import config from '@/config/config'
const CheckboxGroup = Checkbox.Group;


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
      sensors:[],
      indeterminate: false,
      checkAll: true,

      sensors_numbers_export:[],
      indeterminateExport: false,
      checkAllExport: true,
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
          data:  data[i].data.reduce((pre,item)=>{pre.push(item.value);return pre},[]).reverse(),
          smooth: true,
        }]
        let date=[]
        for(let k=0;k<data[i].data.length;k++){
          date.push( moment(data[i].data[k].timestamp).format('MM-DD HH:mm:ss'))
        }
        // console.log('date',date)
        let option = {
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
            top: '15%',
            left: '3%',
            right: '5%',
            bottom: '5%',
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
  handleChangeDate=(value)=>{
    console.log('value',value)
    this.setState({
      date:value
    },function () {
      this.handleSearch();
    })
  }
  onChange=(checkedList)=>{
    console.log('checkedList',checkedList)
    this.setState({
      sensor_numbers:checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.sensors.length),
      checkAll: checkedList.length === this.state.sensors.length,
    },function () {
      this.handleSearch();
    });
  }
  onChangeExport=(checkedList)=>{
    console.log('checkedList',checkedList)
    this.setState({
      sensors_numbers_export:checkedList,
      indeterminateExport: !!checkedList.length && (checkedList.length < this.state.sensors.length),
      checkAllExport: checkedList.length === this.state.sensors.length,
    });
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
        let channels=[]
        let sensor_numbers=[]
        for(let i=0;i<response.data.data.channels.length;i++){
          channels.push({label:response.data.data.channels[i].name,value:response.data.data.channels[i].id})
          sensor_numbers.push(response.data.data.channels[i].id)
        }
        that.setState({
          sensors:channels,
          sensor_numbers
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
  onCheckAllChange = (e) => {
    this.setState({
      sensor_numbers: e.target.checked ? this.state.sensors.reduce((pre,item)=>{pre.push(item.value);return pre},[]) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    },function () {
      this.handleSearch();
    });
  }
  onCheckAllChangeExport = (e) => {
    this.setState({
      sensors_numbers_export: e.target.checked ? this.state.sensors.reduce((pre,item)=>{pre.push(item.value);return pre},[]) : [],
      indeterminateExport: false,
      checkAllExport: e.target.checked,
    });
  }
  handleExport=()=>{
    const that=this;
    const formValues = this.ExportData.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'device_history_data/exportCSV',
      payload: {
        device_id: that.props.history.location.query.id,
        channel_ids:that.state.sensors_numbers_export,
        started_at: moment(formValues.started_at).format('YYYY-MM-DD'),
        ended_at: moment(formValues.ended_at).format('YYYY-MM-DD'),
      },
      callback: function (download_key) {
        console.log('download',download_key)
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
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
          title: <Tooltip title={item.alias + `${item.data_unit ? '(' + item.data_unit + ')' : ''}`}>
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
      return <Col key={index} xxl={24} xl={24} lg={24} md={24} sm={24} xs={24} style={{marginBottom: 16}}>
        <Card
          hoverable={true}
          size="small"
          headStyle={{
            paddingLeft: '10px',
          }}
          bodyStyle={{
          }}
          title={
            <h3 style={{marginBottom:'0'}}>{ `${item.name}(${item.alias})`}</h3>

          }
        >
          <div className="chart">
            <div style={{width: '100%', height: '250px'}} className={`history_chart_${index}`}>

            </div>
            <div className="chart_empty">
              {dataSource.length===0&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
          </div>

       {/*   <Table size="small" rowKey="timestamp"  scroll={{ y: 140 }} columns={columns} dataSource={[...dataSource]} bordered={true} pagination={false}/>*/}
        </Card>
      </Col>
    })
    return (
      <div>
        <div className="info-page-container" >
          <div  style={{marginTop:'12px',marginBottom:'12px'}}>
            <div  style={{paddingBottom:'12px',marginBottom:'6px',borderBottom: '1px solid #E9E9E9'}}>
              <Button onClick={()=>{
                let sensors_numbers_export=[]
                for(let i=0;i<this.state.sensors.length;i++){
                  sensors_numbers_export.push(this.state.sensors[i].value)
                }
                console.log('sensors_numbers_export',sensors_numbers_export)
                this.setState({
                  sensors_numbers_export:sensors_numbers_export,

                },function () {
                  this.setState({
                    exportModal:true
                  })
                })
              }} type="primary" style={{float:'right'}}>导出数据</Button>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                选择全部
              </Checkbox>
              <br />
            <CheckboxGroup options={this.state.sensors} value={this.state.sensor_numbers} onChange={this.onChange} />
            </div>
            <div >
              日期: <DatePicker
              format="YYYY-MM-DD"
              onChange={this.handleChangeDate}
              value={this.state.date}
              style={{marginRight:'12px'}}
              allowClear={false}
            />
            </div>

          </div>

              <div><Row gutter={12}>
                {renderItem}
              </Row></div>

        </div>
        <Modal
          title={'导出历史数据' }
          visible={this.state.exportModal}
          centered
          onOk={this.handleExport}
          onCancel={()=> {
            this.setState({exportModal: false})
          }}
        >
          <ExportData
            indeterminateExport={this.state.indeterminateExport}
            onCheckAllChangeExport={this.onCheckAllChangeExport}
            checkAllExport={this.state.checkAllExport}
            sensors_numbers_export={this.state.sensors_numbers_export}
            onChangeExport={this.onChangeExport}
            options={this.state.sensors}
            wrappedComponentRef={(inst) => this.ExportData = inst}/>

        </Modal>
      </div>
    );
  }
}

export default CoverCardList;
