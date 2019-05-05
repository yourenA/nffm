import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeader,Badge,Table,Divider,Card,Button,Modal ,message   } from 'antd';
import AddOrEditSensors from './AddOrEditSensor'
@connect(({information, loading}) => ({
  information,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    console.log(this.props)
    this.state = {
      editRecord:{}
    };
  }

  componentDidMount() {
    this.handleSearch()
  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'information/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        if (cb) cb()
      }

    });
  }
  render() {
    const {
      information: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '属性值',
        dataIndex: 'value',
      },
    ];
    return (
      <div>
        <Card style={{marginTop:'24px'}}>
          <Table
            size='small'
            loading={loading}
            rowKey={'name'}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </Card>
        </div>
    );
  }
}

export default SearchList;
