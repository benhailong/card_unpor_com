<template>
  <div>
    <a-form ref="formRef" :model="form" :style="{width:'600px'}" @submit="handleSubmit">

      <a-form-item field="smtp_char" label="邮件编码"
                   :rules="[{required:true,message:'邮件编码不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.smtp_char" placeholder="设定邮件编码" />
      </a-form-item>

      <a-form-item field="smtp_host" label="SMTP服务器"
                   :rules="[{required:true,message:'邮件SMTP服务器不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.smtp_host" placeholder="设定邮件SMTP服务器" />
      </a-form-item>

      <a-form-item field="smtp_auth" label="SMTP 认证">
        <a-radio-group v-model="form.smtp_auth">
          <a-radio value="true">允许</a-radio>
          <a-radio value="false">禁止</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="smtp_address" label="邮箱地址"
                   :rules="[{required:true,message:'邮箱地址不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.smtp_address" placeholder="请输入邮箱地址" />
      </a-form-item>

      <a-form-item field="smtp_password" label="邮箱密码"
                   :rules="[{required:true,message:'邮箱密码不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input-password v-model="form.smtp_password" placeholder="请输入邮箱密码" />
      </a-form-item>

      <a-form-item field="smtp_secure" label="协议">
        <a-radio-group v-model="form.smtp_secure">
          <a-radio value="ssl">ssl</a-radio>
          <a-radio value="tls">TLS</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="smtp_port" label="端口"
                   extra="服务器端口 25 或者465 具体要看邮箱服务器支持"
                   :rules="[{required:true,message:'签名不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.smtp_port" placeholder="请设置邮件服务器端口" />
      </a-form-item>

      <a-form-item field="smtp_username" label="发件人"
                   :rules="[{required:true,message:'发件人姓名不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.smtp_username" placeholder="请设置发件人姓名" />
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
  smtp_char: '',
  smtp_host: '',
  smtp_auth: "true",
  smtp_address: '',
  smtp_password: '',
  smtp_secure: "ssl",
  smtp_port: '',
  smtp_username: '',
});

const getAllRouter = (e:string) => {
  instance.$http.config.getInfoByKey({"key":e}).then((res:any)=>{
    // console.log(res)
    if(res.data){
      form.value = res.data
    }
  })
}

getAllRouter("smtp_")


const handleSubmit = ({values, errors}) => {
  if (!errors) {
    instance.$http.config.save(values).then((res:any)=>{
      instance.$message.success("保存成功");
      getAllRouter("smtp_")
    })
  }
}

</script>

<style scoped>

</style>