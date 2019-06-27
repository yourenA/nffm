export default [
  // user
  {
    path: '/none',
    component: '../layouts/UserLayout',
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/login/:id',exact:true, component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
      { path: '/', redirect: '/monitor' },
      {
        path: '/monitor',
        name: '首页',
        icon: 'home',
        component: './Home/Index',
      },
      {
        path: '/collectors',
        name: '采集器管理',
        icon: 'apartment',
        routes: [
          {
            path: '/collectors/collectors_list',
            name: '采集器列表',
            // component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/collectors/collectors_list',
                name: '采集器列表',
                redirect: '/collectors/collectors_list/list',
              },
              {
                path:'/collectors/collectors_list/list',
                name: '采集器列表',
                component: './Collectors/Index',
              },
              {
                path: '/collectors/collectors_list/info',
                component: './Collectors/CollectorsInfo',
                routes: [
                  {
                    path: '/collectors/collectors_list/info/parameters',
                    name: '采集器参数',
                    component: './Collectors/Parameters',
                  },
                  {
                    path: '/collectors/collectors_list/info/config',
                    name: '采集器配置',
                    component: './Collectors/Configs',
                  },
                  {
                    path: '/collectors/collectors_list/info/information',
                    name: '采集器信息',
                    component: './Collectors/Information',
                  },
                  {
                    path: '/collectors/collectors_list/info/mqtt_logs',
                    name: '通讯日志',
                    component: './Collectors/MqttLogs',
                  },
                  {
                    path: '/collectors/collectors_list/info/login_logs',
                    name: '登陆日志',
                    component: './Collectors/LoginLogs',
                  },
                ]
              },

            ],
          }
        ],

      },
 /*     {
        path: '/models',
        name: '应用管理',
        icon: 'apartment',
        routes: [
          {
            path: '/models/device_model',
            name: '应用列表',
            // component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/models/device_model',
                name: '应用列表',
                redirect: '/models/device_model/list',
              },
              {
                path:'/models/device_model/list',
                name: '应用列表',
                component: './Device_types/Index',
              },
              {
                path: '/models/device_model/info',
                component: './Device_types/DeviceTypeInfo',
                routes: [
                  {
                    path: '/models/device_model/info/sensors',
                    name: '应用传感器',
                    component: './Device_types/channels',
                  },
                  {
                    path: '/models/device_model/info/views',
                    name: '应用视图',
                    component: './Device_types/Views',
                  },

                ]
              },

            ],
          }
        ],

      },*/
      {
        path: '/device',
        name: '设备管理',
        icon: 'dashboard',
        routes: [
          {
            path: '/device/devices',
            name: '设备列表',
            // component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/device/devices',
                name: '设备管理',
                redirect: '/device/devices/list',
              },
              {
                path: '/device/devices/list',
                name: '设备列表',
                component: './Devices-ignore/TableList',
              },
              {
                path: '/device/devices/add_or_edit',
                name: '设备添加/编辑',
                component: './Devices-ignore/AddOrEditDevice',
              },
              // {
              //   path: '/device/devices/sensors',
              //   name: '传感器列表',
              //   component: './Devices-ignore/Sensors',
              // },
              {
                path: '/device/devices/info',
                component: './Devices-ignore/DeviceInfo',
                routes: [
                  {
                    path: '/device/devices/info/history',
                    name: '设备历史数据',
                    component: './Devices-ignore/DeviceHistory',
                  },
                  {
                    path: '/device/devices/info/real_time',
                    name: '设备实时数据',
                    component: './Devices-ignore/DeviceRealTime',
                  },
                  {
                    path: '/device/devices/info/valves',
                    name: '阀门控制',
                    component: './Devices-ignore/Valves',
                  },
                  {
                    path: '/device/devices/info/parameters',
                    name: '设备参数',
                    component: './Devices-ignore/DeviceParameters',
                  },
                  {
                    path: '/device/devices/info/views',
                    name: '设备视图',
                    component: './Devices-ignore/Views',
                  },
                  {
                    path: '/device/devices/info/error',
                    name: '故障信息',
                    component: './Devices-ignore/DeviceError',
                  },
                  {
                    path: '/device/devices/info/electric_valves',
                    name: '故障信息',
                    component: './Devices-ignore/ElectricValve',
                  },
                ]
              },

            ],
          },
          // {
          //   path: '/monitor/map',
          //   name: '地图信息',
          //   component: './Monitor/Monitor',
          // },
          // {
          //   path: '/monitor/workplace',
          //   name: '视频监控',
          //   component: './Monitor/Workplace',
          // },
        ],
      },
   /*   {
        path: '/views',
        name: '视图管理',
        icon: 'eye',
        routes: [
          {
            path: '/views/device_views',
            name: '设备视图',
            // component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/views/device_views',
                name: '设备类型',
                redirect: '/views/device_views/list',
              },
              {
                path: '/views/device_views/list',
                name: '设备列表',
                component: './Device_types/Index',
              },
              // {
              //   path: '/device/devices/sensors',
              //   name: '传感器列表',
              //   component: './Devices-ignore/Sensors',
              // },
              {
                path: '/views/device_views/info',
                component: './Device_types/DeviceTypeInfo',
                routes: [
                  {
                    path: '/views/device_views/info/views',
                    name: '视图列表',
                    component: './Device_types/Views',
                  },
                ]
              },

            ],
          },
          {
            path: '/views/view_templates',
            name: '视图模板',
            // component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/views/view_templates',
                name: '视图模板列表',
                redirect: '/views/view_templates/list',
              },
              {
                path: '/views/view_templates/list',
                name: '视图模板列表',
                component: './View_templates/Index',
              },
              {
                path: '/views/view_templates/add_or_edit',
                name: '视图模板',
                component: './View_templates/AddOrEdit',
              },
            ],
          },
          // {
          //   path: '/monitor/map',
          //   name: '地图信息',
          //   component: './Monitor/Monitor',
          // },
          // {
          //   path: '/monitor/workplace',
          //   name: '视频监控',
          //   component: './Monitor/Workplace',
          // },
        ],

      },*/
      {
        path: '/system',
        name: '系统配置',
        icon: 'setting',
        component: './Home/SystemConfigs',
      },
      {
        path: '/users',
        name: '用户管理',
        icon: 'user',
        routes: [
          {
            path: '/users/users-list',
            name: '用户列表',
            component: './UsersManage/Index',
          },
        ],
      },
      /* {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                name: 'stepform',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },*/
      // list
      /*  {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },

        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },*/
     /* {
        name: '账号管理',
        icon: 'user',
        path: '/account',
        routes: [
          /!*  {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },*!/
          {
            path: '/account/settings',
            name: '个人中心',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },*/
      {
        component: '404',
      },
    ],
  },
];
