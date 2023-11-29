<template>
  <div style="">

    <Clause v-model="visible"></Clause>
    <svg-icon name="logo" style="font-size: 180px;margin-left: 40px;margin-top: -40px;" />
    <div class="login">
      <div class="login-title">卡券账号登录</div>
      <div class="up-flex">
        <div class="login_tab login_tab_action">账号登录</div>
<!--        <div class="login_tab">验证码</div>-->
      </div>

      <div style="margin-top: 20px;width: 100%">
        <a-input v-model="username" style="width:100%;margin-bottom: 20px" placeholder="手机号码/邮箱地址" size="large" allow-clear></a-input>
        <a-input-password v-model="password"  style="width:100%;margin-bottom: 20px" size="large" placeholder="请输入密码" allow-clear/>
        <div style="" class="up-flex up-jc-sb">
          <a-input style="width:100%;flex: 1" size="large" v-model="code" :max-length="4" placeholder="请输入验证码" search-button status="warning"/>
          <div style="margin-left: 10px;height: 36px;width: 76px">
            <a-skeleton :animation="true" :loading="codeInfo.codeimg==''">
              <a-space direction="vertical" style="width: 76px" >
                <a-skeleton-line  :widths="[76]" :line-height="36" />
              </a-space>
            </a-skeleton>
            <img v-if="codeInfo.codeimg" :src="codeInfo.codeimg" style="height: 36px;width: 76px;" alt="">
          </div>
          <a-button style="margin-left: 10px;width: 60px" type="text" size="large" @click="getCode">刷新</a-button>
        </div>
        <div class="login-error-info">{{msg}}</div>
        <div class="up-flex" style="margin-bottom: 20px">
          <a-checkbox value="1" v-model="checkboxValue"></a-checkbox>
          <div class="login-xieyi">我已阅读并同意 <a-link @click="visible=true">服务协议</a-link> 和 <a-link href="link">隐私条款</a-link></div>
        </div>
        <a-button type="primary" style="width: 100%;margin-bottom: 20px" size="large" @click="login">登录</a-button>
        <div class="up-flex up-jc-sb login-register">
          <div @click="upTools.goPath('/seekPwd')">忘记密码</div>
          <div @click="upTools.goPath('/register')">注册</div>
        </div>
      </div>
    </div>
    <div class="login-fotter">
      © 2012 - 2023 unpor.com
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,getCurrentInstance,onMounted} from "vue";
import upTools from "@/utils/upTools.ts";
import Clause from '@/components/unpor/Clause.vue'
import {sha256} from "js-sha256";

// 调用pinia存储
import {storeToRefs} from "pinia";
import { userStore } from "@/stores/userStore";
import { routerStore } from "@/stores/routerStore";
let {userinfo,startTime} = storeToRefs(userStore());
let {changeId} = storeToRefs(routerStore());

const visible = ref(false)

const {proxy: instance} = getCurrentInstance()

const msg = ref("");
const checkboxValue = ref(true);

const codeInfo = ref({
  'key':'',
  'codeimg':''
});

const username = ref("");
const password = ref("");
const code = ref("");

/**
 * 用户登录
 */
const login = () => {
  // 验证是否正确
  msg.value = "";
  if (!upTools.check(username.value, "email") && !upTools.check(username.value, "phone")) {
    msg.value = "请输入正确的手机号码或者邮箱地址"
    return false;
  }
  if (!password.value) {
    msg.value = "密码不能为空"
    return false;
  }
  if (!code.value) {
    msg.value = "验证码不能为空"
    return false;
  }

  const data = {
    "username": username.value,
    "password": sha256(password.value),
    "code": code.value,
    "key": codeInfo.value.key,
  };
  instance.$http.users.login(data).then((res:any) => {
    if(res.code==0){
      instance.$message.success("登录成功");
      // 存值
      userinfo.value = res.data;
      let stime = new Date();
      startTime.value = stime.getTime();
      // 准备动态路由
      changeId.value = 0;
      upTools.goPath("/home");
    } else {
      instance.$message.error(res.msg);
      getCode();
    }
  }).catch( (err:any) => {
    // instance.$message.error("????")
  })
}

/**
 * 获取验证码图片
 */
const getCode = () => {
  instance.$http.captcha.create({}).then((res:any) => {
    codeInfo.value = res.data;
  }).catch( (err:any) => {
    // instance.$message.error("????")
  })
}

getCode();


</script>


<style scoped>
  @import "@/assets/scss/_style.scss";
</style>
<style>
body{
  background-color: #F2F3F5;
}
</style>