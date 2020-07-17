<template>
  <div class="mutiple-tab-group">
    <div class="header">
      <div
        :key="tab.createdAt+'-sheet'"
        @click="selectTab(index)"
        @mouseenter="enterTab($event,tab)"
        @mouseleave="leaveTab($event,tab)"
        class="sheet"
        v-bind:class="{ active: tab.isActive }"
        v-for="(tab,index) in tabs"
      >
        {{tab.meta.org.name}}
        <v-icon
          @click.stop="removeTab($event,index)"
          title="删除"
        >clear</v-icon>
      </div>
    </div>
    <div class="pages">
      <div
        :key="tab.createdAt+'-content'"
        class="mutiple-tab-content"
        v-for="(tab) in tabs"
        v-show="tab.isActive"
      >
        <component
          :is="tab.component"
          v-bind="tab.props"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mutiple-tab',
  methods: {
    selectTab(tabIndex) {
      this.$store.dispatch('selectTab', tabIndex)
    },
    getSheetStaticClassName(tab) {
      let className = tab.isActive ? 'sheet active' : 'sheet'
      return className
    },
    enterTab($event, tab) {
      let target = $event.target
      let className = this.getSheetStaticClassName(tab)
      let newClassName = className + ' mouseenter'
      target.setAttribute('class', newClassName)
    },
    leaveTab($event, tab) {
      let target = $event.target
      let className = this.getSheetStaticClassName(tab)
      target.setAttribute('class', className)
    },
    removeTab($event, tabIndex) {
      this.$store.dispatch('removeTab', tabIndex)
    }
  },
  computed: {
    tabs() {
      return this.$store.getters.tabs
    }
  }
}
</script>
<style  lang="scss" scoped>
.mutiple-tab-group {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  flex-direction: row;
  margin-top: 23px;
}
.sheet {
  border: 1px solid #e4e7ed;
  padding: 4px 15px;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-right: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  &.active {
    background-color: #e4e4e4;
  }
  .v-icon {
    font-size: 22px;
  }
  .v-icon:focus {
    outline: none;
  }
  &.mouseenter {
    .v-icon {
      font-size: 22px;
    }
  }
}

.pages {
  display: flex;
  flex-grow: 1;
}
.mutiple-tab-content {
  display: flex;
  width: 100%;
}
</style>
