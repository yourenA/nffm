import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha ,logout} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log('payload',payload)
      let response = yield call(fakeAccountLogin, {...payload});
      if (response.status === 200) {
        localStorage.setItem('username', response.data.data.username);
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('company_name', response.data.data.company_name);
        localStorage.setItem('company_code', response.data.data.company_code);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        console.log('redirect',redirect)
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        console.log('go to /')
        // yield put(routerRedux.replace(redirect || '/'));
        window.location.href=redirect || '/'
        // location.reload();
      }
    },


    *logout(_, { call, put }) {
      const response = yield call(logout);
      console.log(response);
      let company_code=localStorage.getItem('company_code');
      console.log('company_code',company_code)
      localStorage.clear();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login/'+company_code,
          search: stringify({
            redirect: window.location.href,
          }),
        })

      );

      location.reload();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
