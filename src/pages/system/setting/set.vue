<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>系统设置</a-breadcrumb-item>
        <a-breadcrumb-item>基础设置</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" title="短信">
        <sms></sms>
      </a-tab-pane>
      <a-tab-pane key="2" title="邮箱">
        <email></email>
      </a-tab-pane>
      <a-tab-pane key="3" title="公众号">
        <gzh></gzh>
      </a-tab-pane>
      <a-tab-pane key="4" title="支付设置">
        <pay></pay>
      </a-tab-pane>
<!--      <a-tab-pane key="5" title="文件上传">-->
<!--        <pay></pay>-->
<!--      </a-tab-pane>-->
    </a-tabs>
  </div>
</template>

<script setup lang="ts">

import sms from './sms.vue'
import email from './email.vue'
import pay from './pay.vue'
import gzh from './gzh.vue'

</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>