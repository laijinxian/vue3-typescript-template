import { defineAsyncComponent } from 'vue'
import { app } from '../main'

// 获取所有vue文件
function getComponent() {
  return require.context('../views', true, /\.vue$/);
}

// 首字母转换大写
function letterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 首字母转换小写
function letterToLowerCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export const asyncComponent = function () {

  // 获取文件全局对象
  const requireComponents = getComponent();

  requireComponents.keys().forEach((fileSrc: string) => {

    const viewSrc = requireComponents(fileSrc);

    const fileNameSrc = fileSrc.replace(/^\.\//, '')

    const file = viewSrc.default;

    if (viewSrc.default.isComponents) {
      
      // 异步注册组件
      let componentRoot = defineAsyncComponent(
        () => import(`@/views/${fileNameSrc}`)
      )
      
      app.component(letterToUpperCase(file.name), componentRoot)
    }
    
    // 异步注册组件
    // app.component(
    //   componentName,
    //   import(`@/views/${fileNameSrc}`)
    //   // () => import(viewSrc.default || viewSrc)
    //   // (resolve: any) => { require([`@/views/${fileNameSrc}`], resolve); }
    //   // 
    // )
  });
};

// 获取路由文件
export const vueRouters = function () {

  const routerList: any = [];

  const requireRouters = getComponent();

  requireRouters.keys().forEach((fileSrc: string) => {

    // 获取 components 文件下的文件名
    const viewSrc = requireRouters(fileSrc);

    const file = viewSrc.default;
    // const view = fileSrc.split('/')[fileSrc.split('/').length - 1];

    // 首字母转大写
    // const vueRouterUpper = letterToUpperCase(view.replace(/^\.\//, '').replace(/\.\w+$/, ''));
    const routerName = letterToUpperCase(file.name);

    // 首字母转小写
    // const vueRouterLower = letterToLowerCase(view.replace(/^\.\//, '').replace(/\.\w+$/, ''));
    const routerPath = letterToLowerCase(file.name);

    // 设置路由路径  (resolve: any) => { require([`@/views/${fileNameSrc}`], resolve); },
    const fileNameSrc = fileSrc.replace(/^\.\//, '');

    if (file.isRouter) {
      routerList.push({
        path: `/${routerPath}`,
        name: `${routerName}`,
        component: () => import(`@/views/${fileNameSrc}`)
      });
    }
  });
  return routerList;
};
