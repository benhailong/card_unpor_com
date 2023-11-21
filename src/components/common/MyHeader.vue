<template>
  <div class="up-flex up-jc-sb">
    <div></div>
    <div class="up-flex up-jc-sb">
      <div style="margin-top: 15px">
        <a-badge :count="9" dot :offset="[2, -2]" style="margin-right: 20px;cursor: pointer">
          <IconNotification
              style="color: #888;font-size: 22px; vertical-align: -3px"
          />
        </a-badge>
      </div>
      <div style="margin-top: 7px;">
        <a-avatar style="background-color: #165DFF;margin-right: 5px">
          <IconUser />
        </a-avatar>
        <a-dropdown :popup-max-height="false">
          <a-button type="text" style="margin-right: 5px">{{ userinfo.username }} <icon-down/></a-button>
          <template #content>
            <a-doption>个人中心</a-doption>
            <a-doption @click="loginout">退出登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import upTools from "@/utils/upTools.ts";

import { ref, defineProps, getCurrentInstance, defineEmits } from 'vue';
const {proxy: instance} = getCurrentInstance()

// 调用pinia存储
import {storeToRefs} from "pinia";
import { userStore } from "@/stores/userStore";
let {userinfo,startTime} = storeToRefs(userStore());

/**
 * 退出
 */
const loginout = () => {

  instance.$http.users.loginout()
      .then((res:any) => {
        if(res.code == 0){
          userinfo.value = null;
          startTime.value = "";
          // 退出登录，获取当前路径
          upTools.goPath("/login");
        }else{
          instance.$message.error(res.msg);
        }
      }).catch( (err:any) => {
    console.log(err)
          // err ? instance.$message.error(err) : console.log(err)
  })
}

</script>


<style scoped>
  @import "@/assets/scss/_style.scss";
</style>