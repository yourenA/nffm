import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import styles from './UserLayout.less';
import logo from '../images/pro-icon.png';



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

      window.Particles.init({
        selector: '.background',
        color: '#59065F',
        maxParticles: 130,
        connectParticles: true,
        responsive: [
          {
            breakpoint: 768,
            options: {
              maxParticles: 80
            }
          }, {
            breakpoint: 375,
            options: {
              maxParticles: 50
            }
          }
        ]
      });

  }
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <canvas className=
                  "background"
        ></canvas>
        {/*   <div className={styles.lang}>
          <SelectLang />
        </div>*/}
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>广州辂轺科技</span>
              </Link>
            </div>
            <div className={styles.desc}>MQTT管理系统</div>
          </div>
          {children}
        </div>

      </div>
    );
  }
}

export default UserLayout;
