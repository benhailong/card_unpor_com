<template>
  <div style="">
    <svg-icon name="logo" style="font-size: 180px;margin-left: 40px;margin-top: -40px;" />
    <div class="login">
      <div class="login-title">找回密码</div>
      <div class="up-flex">
        <div :class="['login_tab', {'login_tab_action':change_tab==0}]" @click="changeTab(0)">手机号</div>
        <div :class="['login_tab', {'login_tab_action':change_tab==1}]" @click="changeTab(1)">邮箱</div>
      </div>

      <div style="margin-top: 20px;width: 100%">
        <template v-if="change_tab==0">
          <a-input style="width:100%;margin-bottom: 20px" v-model="phone" placeholder="手机号码" :max-length="11" size="large" allow-clear></a-input>
          <div style="margin-bottom: 20px" class="up-flex up-jc-sb">
            <a-input style="width:100%;flex: 1" size="large" v-model="code" :max-length="6" placeholder="请输入验证码" search-button status="warning"/>
            <a-button v-if="countdown_phone==0" style="margin-left: 10px;width: 100px" type="primary" size="large" @click="sendSmsCode">发送验证码</a-button>
            <a-button v-if="countdown_phone>0" style="margin-left: 10px;width: 100px" type="primary" size="large" disabled>{{ countdown_phone }} S</a-button>
          </div>
        </template>
        <template v-if="change_tab==1">
          <a-input style="width:100%;margin-bottom: 20px" v-model="email" placeholder="邮箱地址" size="large" allow-clear></a-input>
          <div style="margin-bottom: 20px" class="up-flex up-jc-sb">
            <a-input style="width:100%;flex: 1" size="large" v-model="code" :max-length="6" placeholder="请输入验证码" search-button status="warning"/>
            <a-button v-if="countdown==0" style="margin-left: 10px;width: 100px" type="primary" size="large" @click="sendEmailCode">发送验证码</a-button>
            <a-button v-if="countdown>0" style="margin-left: 10px;width: 100px" type="primary" size="large" disabled>{{ countdown }} S</a-button>
          </div>
        </template>

        <a-input-password v-model="password"  style="width:100%;margin-bottom: 20px" size="large" placeholder="请设置密码" allow-clear/>
        <a-input-password v-model="password_agen" style="width:100%;" size="large" placeholder="请确认密码" allow-clear/>
        <div class="login-error-info">{{msg}}</div>
        <div class="up-flex" style="margin-bottom: 20px">
          <a-checkbox value="1" v-model="checkboxValue"></a-checkbox>
          <div class="login-xieyi">我已阅读并同意 <a-link href="link">服务协议</a-link> 和 <a-link href="link">隐私条款</a-link></div>
        </div>
        <a-button type="primary" style="width: 100%;margin-bottom: 20px" size="large" @click="register">提交</a-button>
        <div class="up-flex up-jc-sb login-register">
          <div @click="upTools.goPath('/register')">注册</div>
          <div @click="upTools.goPath('/login')">登录</div>
        </div>
      </div>
    </div>
    <div class="login-fotter">
      © 2014 - 2023 unpor.com
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,getCurrentInstance} from "vue";
import upTools from "@/utils/upTools.ts";
import {sha256} from "js-sha256";

const {proxy: instance} = getCurrentInstance()

const change_tab = ref(0);
const countdown = ref(0); // 倒计时-邮箱的
const countdown_phone = ref(0); // 倒计时-手机的

const msg = ref("");
const checkboxValue = ref(true);

const email = ref("");
const phone = ref("");
const code = ref("");
const password = ref("");
const password_agen = ref("");

/**
 * 切换状态栏
 * @param e
 */
const changeTab = (e) => {
  change_tab.value = e;
  code.value = "";
}

/**
 * 邮箱注册发送验证码
 */
const sendEmailCode = () => {
  if(!upTools.check(email.value, "email")){
    msg.value = "请输入正确的邮箱";
    return false;
  }
  instance.$http.email.send({"toEmail": email.value, "type":"seekpwd"})
      .then((res:any) => {
        console.log(res);
        countdown.value = 60;
        let interval = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          }else{
            clearInterval(interval); // 清除定时器
          }
        }, 1000);
        instance.$message.success("邮件发送成功")
      }).catch( (err:any) => {
    // instance.$message.error("????")
  })
}


/**
 * 手机号码注册 发送验证码
 */
const sendSmsCode = () => {
  if(!upTools.check(phone.value, "phone")){
    msg.value = "请输入正确的手机号码";
    return false;
  }
  instance.$http.sms.send({"phone": phone.value, "type":"seekpwd"})
      .then((res:any) => {
        console.log(res);
        countdown_phone.value = 60;
        let interval = setInterval(() => {
          if (countdown_phone.value > 0) {
            countdown_phone.value--;
          }else{
            clearInterval(interval); // 清除定时器
          }
        }, 1000);
        instance.$message.success("验证码发送成功")
      }).catch( (err:any) => {
    // instance.$message.error("????")
  })
}

/**
 * 注册
 */
const register = () => {
  msg.value="";
  if(change_tab.value==1 && !upTools.check(email.value, "email")){
    msg.value = "请输入正确的邮箱";
    return false;
  }
  if(change_tab.value==0 && !upTools.check(phone.value, "phone")){
    msg.value = "请输入正确的手机号码";
    return false;
  }
  // 校验密码
  if(!upTools.check(password.value, "password")){
    msg.value = "密码格式为6-16位字母+数字";
    return false;
  }
  if(password.value != password_agen.value){
    msg.value = "两侧密码输入不一致";
    return false;
  }

  if(!checkboxValue.value){
    msg.value = "请先阅读并同意服务协议盒隐私条款";
    return false;
  }
  // 校验成功
  if (change_tab.value==0) {
    // 手机号码注册
    const data = {
      "phone": phone.value,
      "password": sha256(password.value),
      "code": code.value
    }
    instance.$http.users.seekpwd_phone(data).then((res:any) => {
      instance.$message.success("密码修改成功")
      upTools.goPath("/login")
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })

  } else if (change_tab.value==1){
    // 邮箱注册
    const data = {
      "email": email.value,
      "password": sha256(password.value),
      "code": code.value
    }
    instance.$http.users.seekpwd_email(data).then((res:any) => {
      instance.$message.success("密码修改成功")
      upTools.goPath("/login")
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }
}


</script>


<style scoped>
@import "@/assets/scss/_style.scss";
</style>
<style>
body{
  background-color: #F2F3F5;
}
</style>