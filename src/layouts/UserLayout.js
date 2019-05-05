import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import styles from './UserLayout.less';
import logo from '../images/zhuhua.png';
import GlobalFooter from '@/components/GlobalFooter';
import { Icon } from 'antd';
const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 广州辂轺信息科技有限公司出品
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }
  componentDidMount() {

  }
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        {/*   <div className={styles.lang}>
         <SelectLang />
         </div>*/}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>南方阀门智慧产品设备数据平台</span>
            </div>
            <div className={styles.desc}>集设备管理数据分析于一体</div>
          </div>
          {children}
        </div>
        <GlobalFooter  copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
