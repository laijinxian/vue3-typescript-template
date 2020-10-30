import { defineAsyncComponent } from 'vue'
import { app } from '../main'
import { IRouter } from './interface'

// 获取所有vue文件
function getComponent() {
  return require.context('../views', true, /\.vue$/);
}

// 首字母转换大写
function letterToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 首字母转换小写
function letterToLowerCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export const asyncComponent = (): void => {

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
  });
};

// 获取路由文件
export const vueRouters = (): IRouter[] => {

  const routerList: IRouter[] = [];

  const requireRouters = getComponent();

  requireRouters.keys().forEach((fileSrc: string) => {

    // 获取 components 文件下的文件名
    const viewSrc = requireRouters(fileSrc);

    const file = viewSrc.default;

    // 首字母转大写
    const routerName = letterToUpperCase(file.name);

    // 首字母转小写
    const routerPath = letterToLowerCase(file.name);

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