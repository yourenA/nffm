import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import {message, Badge, Tooltip} from 'antd'

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}
const removeLoginStorage = (company_code) => {
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('permissions');
  sessionStorage.clear();
  // localStorage.clear()
  // localStorage.removeItem('username');
  // localStorage.removeItem('token');
};
exports.removeLoginStorage = removeLoginStorage;

export function converErrorCodeToMsg(error) {
  console.log("error", error.toString())
  if (error.toString() === 'Error: Network Error') {
    message.error('网络错误', 3);
    return false
  }
  if (error.response.status === 401) {
    // message.error(messageJson['token fail']);
    removeLoginStorage();
    setTimeout(function () {
      window.location.href = '/user/login';
    },1000)
  } else if (!error.response.data.errors) {
    message.error(error.response.data.message);
  } else if (error.response.status === 422) {
    let first;
    for (first in error.response.data.errors) break;
    message.error(`${error.response.data.errors[first][0]}`);
  } else {
    message.error('未知错误');
  }
}
export function converDevicesInfo(data) {

  let sensorskey=[]
  let topicskey=[]
  for(let i in data){
    let splitSensorsKey=i.split('#')
    let splitTopicsKey=i.split('&')
    let sensorsLen=splitSensorsKey.length;
    let topicsLen=splitTopicsKey.length;
    if(sensorsLen>=2){
      if(sensorskey.indexOf(splitSensorsKey[1])<0){
        sensorskey.push(splitSensorsKey[1])
      }
    }
    if(topicsLen>=2){
      if(topicskey.indexOf(splitTopicsKey[1])<0){
        topicskey.push(splitTopicsKey[1])
      }
    }
  }

  let sensorsArr=[]
  let topicsArr=[]
  for(let i=0;i<sensorskey.length;i++){
    sensorsArr.push({
      number:data[`number#${sensorskey[i]}`],
      data_type:data[`data_type#${sensorskey[i]}`],
      remark:data[`remark#${sensorskey[i]}`],
    })
  }
  for(let j=0;j<topicskey.length;j++){
    topicsArr.push({
      name:data[`name&${topicskey[j]}`],
      allow_publish:data[`allow_publish&${topicskey[j]}`],
      allow_subscribe:data[`allow_subscribe&${topicskey[j]}`],
    })
  }

  data.sensorsArr=sensorsArr;
  data.topicsArr=topicsArr
  return data
}

export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}
