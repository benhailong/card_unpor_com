<template>
  <div>
    <a-layout style="height: 100%;background-color: #EFF1F8;">
      <a-layout>
        <a-layout-sider style="width: 160px;background-color: #EFF1F8;padding: 0 10px;" theme="dark">
          <MenuBus ></MenuBus>
        </a-layout-sider>
        <a-layout-content>
          <a-layout style="height: 100vh;">
            <a-layout-header style="height: 54px;background-color: #EFF1F8;">
              <MyHeader></MyHeader>
            </a-layout-header>
            <a-layout-content style="height: calc(100vh - 54px);background-color: #ffffff;border-radius: 20px 20px 0 0 ;">
              <a-scrollbar style="height:calc(100vh - 54px);overflow: auto;">
                <div style="padding: 20px">
                  <router-view></router-view>
                </div>
              </a-scrollbar>
            </a-layout-content>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
  import MenuBus from '@/components/common/MenuBus.vue'
  import MyHeader from '@/components/common/MyHeader.vue'
</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>