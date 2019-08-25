import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },

    '/empmgmt/card': {
        component: dynamicWrapper(app, ['card'], () => import('../routes/EmpMgmt/CardSet/CardSet')),
    },
    '/sysmgmt/account': {
        component: dynamicWrapper(app, ['account'], () => import('../routes/SysMgmt/Account/Account')),
    },
    '/sysmgmt/role': {
        component: dynamicWrapper(app, ['role'], () => import('../routes/SysMgmt/Role/Role')),
    },
    '/comgmt/levelset': {
        component: dynamicWrapper(app, ['levelset'], () => import('../routes/CoMgmt/LevelSet/LevelSet')),
    },
    '/comgmt/homeset': {
        component: dynamicWrapper(app, ['homeset'], () => import('../routes/CoMgmt/HomeSet/HomeSet')),
    },
    '/comgmt/authset': {
        component: dynamicWrapper(app, ['authset'], () => import('../routes/CoMgmt/AuthSet/AuthSet')),
    },
    '/comgmt/awardset': {
        component: dynamicWrapper(app, ['awardset'], () => import('../routes/CoMgmt/AwardSet/AwardSet')),
    },
    '/empmgmt/emptree': {
        component: dynamicWrapper(app, ['emptree'], () => import('../routes/EmpMgmt/EmpTree/EmpTree')),
    },
    '/empmgmt/entry': {
        component: dynamicWrapper(app, ['entry'], () => import('../routes/EmpMgmt/Entry/Entry')),
    },
    '/empmgmt/dimission': {
        component: dynamicWrapper(app, ['dimission'], () => import('../routes/EmpMgmt/Dimission/Dimission')),
    },
    '/sysmgmt/company': {
        component: dynamicWrapper(app, ['company'], () => import('../routes/SysMgmt/Company/Company')),
    },


    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/user/agreement': {
        component: dynamicWrapper(app, [], () => import('../routes/User/Agreement')),
    },
    '/comgmt/idcard': {
        component: dynamicWrapper(app, ['idcard'], () => import('../routes/CoMgmt/IDCard/Idcard')),
    },
    '/comgmt/cocode': {
        component: dynamicWrapper(app, ['login'], () => import('../routes/CoMgmt/CoCode/CoCode')),
    },
    '/sysmgmt/realuser': {
        component: dynamicWrapper(app, ['realuser'], () => import('../routes/SysMgmt/RealUser/RealUser')),
    },
    '/sysmgmt/realcoinfo': {
        component: dynamicWrapper(app, ['realcoinfo'], () => import('../routes/SysMgmt/RealCoInfo/RealCoInfo')),
    },

    '/qrcode/qrcode': {
        component: dynamicWrapper(app, ['qrcode'], () => import('../routes/QrCode/QrCode/QrCode')),
    },
    '/qrcode/batchcode': {
        component: dynamicWrapper(app, ['batchcode'], () => import('../routes/QrCode/BatchCode/BatchCode')),
    },
    '/psnlcard': {
        component: dynamicWrapper(app, ['psnlcard'], () => import('../routes/PsnlMgmt/PsnlCard/PsnlCard')),
    },

    '/rlsaut': {
        component: dynamicWrapper(app, ['rlsaut'], () => import('../routes/PsnlMgmt/RlsAut/RlsAut')),
    },
    '/rlscert': {
        component: dynamicWrapper(app, ['rlscert'], () => import('../routes/PsnlMgmt/RlsCert/RlsCert')),
    },
    '/rlsnotice/add': {
        component: dynamicWrapper(app, ['rlsnotice'], () => import('../routes/PsnlMgmt/RlsNotice/RlsNotice')),
    },
    '/rlsnotice/history': {
        component: dynamicWrapper(app, ['rlsnotice'], () => import('../routes/PsnlMgmt/RlsNotice/RlsNotice')),
    },
    '/rlsseal': {
        component: dynamicWrapper(app, ['rlsseal'], () => import('../routes/PsnlMgmt/RlsSeal/RlsSeal')),
    },
    '/rlsfsign': {
        component: dynamicWrapper(app, ['rlsfsign'], () => import('../routes/PsnlMgmt/RlsFsign/RlsFsign')),
    },

    '/sysmgmt/auditaut': {
        component: dynamicWrapper(app, ['auditaut'], () => import('../routes/SysMgmt/AuditAut/AuditAut')),
    },
      '/sysmgmt/auditcert': {
          component: dynamicWrapper(app, ['auditcert'], () => import('../routes/SysMgmt/AuditCert/AuditCert')),
      },
      '/sysmgmt/auditnotice': {
          component: dynamicWrapper(app, ['auditnotice'], () => import('../routes/SysMgmt/AuditNotice/AuditNotice')),
      },
      '/sysmgmt/auditseal': {
          component: dynamicWrapper(app, ['auditseal'], () => import('../routes/SysMgmt/AuditSeal/AuditSeal')),
      },
      '/sysmgmt/auditfsign': {
          component: dynamicWrapper(app, ['auditfsign'], () => import('../routes/SysMgmt/AuditFsign/AuditFsign')),
      },

    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };

  return routerConfig;
};
