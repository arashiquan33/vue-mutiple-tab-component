<template>
  <v-app>
    <app-tools-bar></app-tools-bar>
    <app-nav-bar></app-nav-bar>
    <app-settings-bar></app-settings-bar>
    <v-content>
      <v-container
        :style="{
          height: style.height + 'px',
          width: style.width + 'px',
        }"
        class="app-container container--fluid"
        pa-0
      >
        <mutiple-tab></mutiple-tab>
        <!-- <router-view></router-view> -->
      </v-container>
    </v-content>
    <app-footer-bar></app-footer-bar>
    <!-- 锁屏 -->
    <lock-login
      :lockScreenDelay="lockScreenDelay"
      v-if="isAutoLockScreen"
    ></lock-login>

    <app-change-password></app-change-password>
  </v-app>
</template>

<script>
import {
  appChangePassword,
  appFooterBar,
  appSettingsBar,
  appNavBar,
  appToolsBar,
  lockLogin
} from '@c/core'
import appMixin from '@/mixins/store/app'
import userMixin from '@/mixins/store/user'
import { base as apiBase } from '@api'
import { system } from '@/settings'
import mutipleTab from '@c/mutiple-tab'
export default {
  name: 'app-layout',
  components: {
    appChangePassword,
    appFooterBar,
    appSettingsBar,
    appNavBar,
    appToolsBar,
    lockLogin,
    mutipleTab
  },
  mixins: [appMixin, userMixin],
  data() {
    return {
      isAutoLockScreen: system.isAutoLockScreen,
      lockScreenDelay:
        typeof system.lockScreenDelay === 'string'
          ? parseInt(system.lockScreenDelay)
          : system.lockScreenDelay,
      // 内容区域尺寸
      style: {
        height: 0,
        width: 0
      }
    }
  },
  methods: {
    /**
     * 导航时先调用操作权限
     */
    getActions(vm, menuCode, next, errNext) {
      apiBase
        .getActionByMenu(menuCode)
        .then(res => {
          let actions = []
          if (res && res.length) {
            actions = res
          }
          vm.$setGroupActions(actions)
          next()
        })
        .catch(err => {
          //eslint-disable-next-line
          console.error(err)
          vm.$Message.error({
            content: vm.$t('common.messages.getPermissionActionsFailure'),
            duration: 5,
            closable: true
          })
          next(errNext)
        })
    },

    /**
     * 获取菜单显示的文字
     * 此文字会出现在左侧菜单栏和顶部
     * @param {Object} menu 菜单对象
     * @returns
     */
    getMenuTitle(menu, vm) {
      if (!menu) {
        return ''
      }
      const lang = vm.$t(menu.i18N)
      const exist = vm.$te(menu.i18N) === true && typeof lang !== 'object'
      return exist === true ? vm.$t(menu.i18N) : menu.name
    },
    onResize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          this.style.height = window.innerHeight - 56
          this.style.width = window.innerWidth
          break
        case 'md':
          this.style.height = window.innerHeight - 64 - 36
          this.style.width = window.innerWidth
          break
        case 'lg':
        case 'xl':
          this.style.height = window.innerHeight - 64 - 36
          this.style.width =
            window.innerWidth - (this.$navbar === true ? 255 : 0)
          break
      }
    }
  },
  /**
   * 首次进入路由时获取操作权限,只执行一次
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta && to.meta.org) {
        const title = vm.getMenuTitle(to.meta.org, vm)
        vm.$setTitle(title || '')
      }
      vm.$store.dispatch('addTab', to)
      // 获取操作权限，失败时返回默认首页
      vm.getActions(vm, to.name, next, { name: 'home' })
    })
  },
  /**
   * 路由改变时获取操作权限
   */
  beforeRouteUpdate(to, from, next) {
    if (to.meta && to.meta.org) {
      const title = this.getMenuTitle(to.meta.org, this)
      this.$setTitle(title || '')
    }
    this.$store.dispatch('addTab', to)
    this.getActions(this, to.name, next, false)
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  }
}
</script>
