import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/reset.less'
import { axionInit } from '@/utils/axios.config'
import { asyncComponent } from '@/utils/global';

import 'vant/lib/index.css'
import { Swipe, SwipeItem, Toast, Field, Button, Cell, CellGroup, Tabbar, TabbarItem , Lazyload, DropdownMenu, DropdownItem, Popup, NoticeBar } from 'vant';

export const app = createApp(App)

axionInit()
asyncComponent()

app.use(Lazyload)
app.use(Swipe)
app.use(SwipeItem)
app.use(Field)
app.use(Toast)
app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(Tabbar)
app.use(TabbarItem)
app.use(DropdownMenu)
app.use(DropdownItem)
app.use(Popup)
app.use(NoticeBar)

app.use(store).use(router).mount('#app')
