import {
  MUTIPLE_TAB_ADD_TAB,
  MUTIPLE_TAB_REMOVE_TAB,
  MUTIPLE_TAB_SELECT_TAB,
  MUTIPLE_TAB_RESET_ALL_TAB_UNACTIVE,
  MUTIPLE_TAB_SET_CURRENT_TAB_INDEX
} from '../mutation-types'
import store from '..'

const mutipleTab = {
  nameSpaced: true,
  state: {
    //tabs缓存当前打开的页签,tabs:Array<tab>,eg tab: {
    //   createdAt:15894484545
    //   meta: {org:{name,....}},
    //   name: '欢迎页',
    //   path: 'welcome',
    //   isActive:true/false
    //   component: ...
    // },
    tabs: [],
    currentTabIndex: 0
  },
  getters: {
    tabs: state => state.tabs,
    currentTabIndex: state => state.currentTabIndex
  },
  mutations: {
    //新增tab
    [MUTIPLE_TAB_ADD_TAB]: (state, route) => {
      //从vue router提供的route对象上挑选部分属性，组成新对象tab
      let { path, name, matched, meta } = route
      //找到对应的需要渲染的vue组件
      let getMatch = matched.find(item => item.name === name)
      let component = getMatch.components.default
      let createdAt = new Date().getTime()
      let props = getMatch.props.default || {}
      let tab = {
        path,
        name,
        meta,
        component,
        isActive: true,
        createdAt,
        props
      }
      store.commit(MUTIPLE_TAB_RESET_ALL_TAB_UNACTIVE)
      let currentTabIndex = state.tabs.push(tab) - 1
      store.commit(MUTIPLE_TAB_SET_CURRENT_TAB_INDEX, currentTabIndex)
    },
    //删除tab
    [MUTIPLE_TAB_REMOVE_TAB]: (state, tabIndex) => {
      //始终保留一个tab
      if (state.tabs.length == 1) return
      state.tabs.splice(tabIndex, 1)
      let tabsLength = state.tabs.length
      //删除的tabIndex < currentIndex时,需要对currentIndex重新分配
      if (tabIndex < state.currentTabIndex) {
        let newCurrentTabIndex = state.currentTabIndex - 1
        if (newCurrentTabIndex < 0) {
          newCurrentTabIndex = 0
        }
        store.commit(MUTIPLE_TAB_SET_CURRENT_TAB_INDEX, newCurrentTabIndex)
        state.tabs[newCurrentTabIndex].isActive = true
        return
      }
      //删除当前正在激活的
      if (tabIndex == state.currentTabIndex) {
        let newCurrentTabIndex
        //如果是最后一位，索引需要前移1位
        if (tabIndex == tabsLength) {
          newCurrentTabIndex = tabIndex - 1
        } else {
          //否则，索引后移1位
          newCurrentTabIndex = tabIndex + 1
        }
        store.commit(MUTIPLE_TAB_SET_CURRENT_TAB_INDEX, newCurrentTabIndex)
        state.tabs[newCurrentTabIndex].isActive = true
      }
    },
    [MUTIPLE_TAB_SELECT_TAB]: (state, tabIndex) => {
      if (state.currentTabIndex === tabIndex) return
      state.tabs[state.currentTabIndex].isActive = false
      store.commit(MUTIPLE_TAB_SET_CURRENT_TAB_INDEX, tabIndex)
      state.tabs[state.currentTabIndex].isActive = true
    },
    [MUTIPLE_TAB_RESET_ALL_TAB_UNACTIVE]: state => {
      state.tabs.forEach(tab => (tab.isActive = false))
    },
    [MUTIPLE_TAB_SET_CURRENT_TAB_INDEX]: (state, tabIndex) => {
      state.currentTabIndex = tabIndex
    }
  },
  actions: {
    addTab({ commit }, tab) {
      commit(MUTIPLE_TAB_ADD_TAB, tab)
    },
    removeTab({ commit }, tabIndex) {
      commit(MUTIPLE_TAB_REMOVE_TAB, tabIndex)
    },
    selectTab({ commit }, tabIndex) {
      commit(MUTIPLE_TAB_SELECT_TAB, tabIndex)
    }
  }
}
export default mutipleTab
