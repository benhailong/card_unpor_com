<template>
  <div>
    <a-form ref="formRef" :model="form" :style="{width:'600px'}" @submit="handleSubmit">

      <a-form-item field="pay_wechat_type" label="微信支付" :validate-trigger="['blur']">
        <a-switch checked-value="true" unchecked-value="false" v-model="form.pay_wechat_type" >
          <template #checked>
            启用
          </template>
          <template #unchecked>
            停用
          </template>
        </a-switch>
      </a-form-item>

      <div v-if="form.pay_wechat_type">
        <a-form-item field="pay_wechat_name" label="商户名称"
                     :rules="[{required:true,message:'公众号标题不能为空'}]"
                     :validate-trigger="['blur']"
        >
          <a-input v-model="form.pay_wechat_name" placeholder="请输入公众号名称" />
        </a-form-item>

        <a-form-item field="pay_wechat_appid" label="app_id"
                     extra="公众号/小程序的AppID，需要绑定改商户号"
                     :rules="[{required:true,message:'AppID 不能为空'}]"
                     :validate-trigger="['blur']"
        >
          <a-input v-model="form.pay_wechat_appid" placeholder="请输入公众号的AppID" />
        </a-form-item>

        <a-form-item field="pay_wechat_mchid" label="支付商户号"
                     :rules="[{required:true,message:'签名不能为空'}]"
                     :validate-trigger="['blur']"
        >
          <a-input v-model="form.pay_wechat_mchid" placeholder="请输入公众号的app secret" />
        </a-form-item>

        <a-form-item field="pay_wechat_appkey" label="支付密钥"
                     extra="使用3.0秘钥"
                     :rules="[{required:true,message:'签名不能为空'}]"
                     :validate-trigger="['blur']"
        >
          <a-input v-model="form.pay_wechat_appkey" placeholder="请输入公众号的app secret" />
        </a-form-item>

        <a-form-item field="pay_wechat_cert" label="CERT文件证书"
                     extra="下载证书cert.zip中的 apiclient_cert.pem文件"
                     :rules="[{required:true,message:'请先上传证书文件'}]"
                     :validate-trigger="['blur']"
        >
          <a-input v-model="form.pay_wechat_cert" disabled placeholder="请输入公众号的app secret" />
          <a-upload style="margin-left: 10px" :show-file-list="false" :custom-request="checkCert" />
        </a-form-item>

        <a-form-item field="pay_wechat_key" label="KEY密钥文件"
                     extra="下载证书cert.zip中的 apiclient_key.pem文件"
                     :rules="[{required:true,message:'请先上传密钥文件'}]"
                     :validate-trigger="['blur']"
        >
          <a-input v-model="form.pay_wechat_key" disabled placeholder="请输入公众号的app secret" />
          <a-upload style="margin-left: 10px" :show-file-list="false" :custom-request="checkKey" />
        </a-form-item>
      </div>

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
  pay_wechat_type:"false",
  pay_wechat_name:'',
  pay_wechat_appid:'',
  pay_wechat_mchid:'',
  pay_wechat_appkey:'',
  pay_wechat_cert:'',
  pay_wechat_key:''
});

const getAllRouter = (e:string) => {
  instance.$http.config.getInfoByKey({"key":e}).then((res:any)=>{
    // console.log(res)
    if(res.data){
      form.value = res.data
    }
  })
}

getAllRouter("pay_")


const handleSubmit = ({values, errors}) => {
  if (!errors) {
    instance.$http.config.save(values).then((res:any)=>{
      instance.$message.success("保存成功");
      getAllRouter("pay_")
    })
  }
}

/**
 * 上传cert文件
 * @param option
 */
const checkCert = (option) => {
  uploadPem(option,'cert');
};
/**
 * 上传key文件
 * @param option
 */
const checkKey = (option) => {
  uploadPem(option,'key');
};

/**
 * 上传pem文件方法
 * @param formData
 * @param type
 */
const uploadPem = (option, type) => {
  const {fileItem, name} = option
  const formData = new FormData();
  formData.append(name || 'file', fileItem.file);

  instance.$http.file.uploadPem(formData).then((res:any)=>{
    if(res.code == 0){
      if(type == "key"){
        form.value.pay_wechat_key = res.data
      }else{
        form.value.pay_wechat_cert = res.data
      }
    }else{
      // onError(res.msg)
      instance.$message.error(res.msg)
    }
  }).catch((err:any)=>{
    // onError(err)
    instance.$message.error(err)
  })
}

</script>

<style scoped>

</style>