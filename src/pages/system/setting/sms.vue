<template>
  <div>
    <a-form ref="formRef" :model="form" :style="{width:'600px'}" @submit="handleSubmit">

      <a-form-item field="sms_type" label="服务商">
        <a-radio-group v-model="form.sms_type">
          <a-radio value="1">阿里云</a-radio>
          <a-radio disabled value="2">腾讯云</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="sms_aliyun_access_key_id" label="key"
        :rules="[{required:true,message:'key 不能为空'}]"
        :validate-trigger="['blur']"
      >
        <a-input v-model="form.sms_aliyun_access_key_id" placeholder="请输入阿里云的access key id" />
      </a-form-item>

      <a-form-item field="sms_aliyun_access_key_secret" label="secret"
                   :rules="[{required:true,message:'secret 不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input-password v-model="form.sms_aliyun_access_key_secret" placeholder="请输入阿里云的access key secret" />
      </a-form-item>

      <a-form-item field="sms_aliyun_sign_name" label="签名"
                   extra="短信前面【XXX】里边的内容，需要审核通过之后才可以使用"
                   :rules="[{required:true,message:'签名不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.sms_aliyun_sign_name" placeholder="请设置短信签名" />
      </a-form-item>

      <a-form-item field="sms_aliyun_template_register" label="注册模板"
                   extra="例：您正在申请手机注册，验证码为：${code}，5分钟内有效！"
                   :rules="[{required:true,message:'模板不能为空'},{minLength:13,message:'长度最多13个字符'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.sms_aliyun_template_register" placeholder="格式：SMS_000000000，需要审核通过之后才可以使用" />
      </a-form-item>

      <a-form-item field="sms_aliyun_template_login" label="登录模板"
                   extra="例：您正在申请手机验证码登录，验证码为：${code}，5分钟内有效！"
                   :rules="[{required:true,message:'模板不能为空'},{minLength:13,message:'长度最多13个字符'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.sms_aliyun_template_login" placeholder="格式：SMS_000000000，需要审核通过之后才可以使用" />
      </a-form-item>

      <a-form-item field="sms_aliyun_template_seekpwd" label="找回密码模板"
                   extra="例：您正在申请手机验证码找回密码，验证码为：${code}，5分钟内有效！"
                   :rules="[{required:true,message:'模板不能为空'},{minLength:13,message:'长度最多13个字符'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.sms_aliyun_template_seekpwd" placeholder="格式：SMS_000000000，需要审核通过之后才可以使用" />
      </a-form-item>

      <a-form-item field="sms_aliyun_template_updatePwd" label="修改密码模板"
                   extra="例：您正在申请修改密码，验证码为：${code}，5分钟内有效！"
                   :rules="[{required:true,message:'模板不能为空'},{minLength:13,message:'长度最多13个字符'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.sms_aliyun_template_updatePwd" placeholder="格式：SMS_000000000，需要审核通过之后才可以使用" />
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">保存</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';

const {proxy: instance} = getCurrentInstance()

const form = ref({
  sms_type:"1",
  sms_aliyun_access_key_id: "",
  sms_aliyun_access_key_secret: "",
  sms_aliyun_sign_name: "",
  sms_aliyun_template_register: "",
  sms_aliyun_template_login: "",
  sms_aliyun_template_seekpwd: "",
  sms_aliyun_template_updatePwd: "",
});

const getAllRouter = (e:string) => {
  instance.$http.config.getInfoByKey({"key":e}).then((res:any)=>{
    // console.log(res)
    if(res.data){
      form.value = res.data
    }
  })
}

getAllRouter("sms_")


const handleSubmit = ({values, errors}) => {
  if (!errors) {
    instance.$http.config.save(values).then((res:any)=>{
      instance.$message.success("保存成功");
      getAllRouter("sms_")
    })
  }
}

</script>

<style scoped>

</style>