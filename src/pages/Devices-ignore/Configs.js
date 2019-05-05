import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeader,Badge,Table,Divider,Card,Button,Modal ,message   } from 'antd';
import EditConfigs from './EditConfigs'
@connect(({configs, loading}) => ({
  configs,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editRecord:{},
      targetKeys: [],
      selectedKeys: [],
    };
  }
  componentDidMount() {
    this.handleSearch()
  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'configs/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        if (cb) cb()
      }

    });
  }
  handleEdit = ()=> {
    const formValues = this.editConfig.props.form.getFieldsValue();
    console.log('formValues2', formValues)
    const that = this;
    this.props.dispatch({
      type: 'configs/edit',
      payload: {
        device_id:that.props.history.location.query.id,
        configs:[{key:formValues.key,value:formValues.value}]
      },
      callback: function () {
        message.success('修改设备配置成功')
        that.setState({
          editModal: false,
        });
        // that.handleSearch()
      }
    });
  }
  render() {
    const {
      configs: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '配置值',
        dataIndex: 'value',
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <a  onClick={()=>{
              this.setState({
                editModal:true,
                editRecord:record,
              })
            }}>编辑</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <Card style={{marginTop:'24px'}}>
          <Table
            size='small'
            loading={loading}
            rowKey={'key'}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </Card>
        <Modal
          title={'编辑'+this.state.editRecord.name }
          destroyOnClose
          visible={this.state.editModal}
          centered
          width={580}
          onOk={this.handleEdit}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <EditConfigs editRecord={this.state.editRecord}
                      wrappedComponentRef={(inst) => this.editConfig = inst}/>

        </Modal>
        </div>
    );
  }
}

export default SearchList;
