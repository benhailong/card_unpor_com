<template>
  <div>
    <a-form ref="formRef" :model="form" :style="{width:'600px'}" @submit="handleSubmit">

      <a-form-item field="gzh_name" label="公众号名称"
                   extra="公众号类型必须是中一种：认证服务号/认证政府订阅号/认证媒体订阅号"
                  :rules="[{required:true,message:'公众号标题不能为空'}]"
                  :validate-trigger="['blur']"
      >
        <a-input v-model="form.gzh_name" placeholder="请输入公众号名称" />
      </a-form-item>

      <a-form-item field="gzh_app_id" label="AppID"
                   :rules="[{required:true,message:'AppID 不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.gzh_app_id" placeholder="请输入公众号的AppID" />
      </a-form-item>

      <a-form-item field="gzh_app_secret" label="AppSecret"
                   :rules="[{required:true,message:'签名不能为空'}]"
                   :validate-trigger="['blur']"
      >
        <a-input v-model="form.gzh_app_secret" placeholder="请输入公众号的app secret" />
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
  gzh_name: '',
  gzh_app_id: '',
  gzh_app_secret: '',
});

const getAllRouter = (e:string) => {
  instance.$http.config.getInfoByKey({"key":e}).then((res:any)=>{
    // console.log(res)
    if(res.data){
      form.value = res.data
    }
  })
}

getAllRouter("gzh_")


const handleSubmit = ({values, errors}) => {
  if (!errors) {
    instance.$http.config.save(values).then((res:any)=>{
      instance.$message.success("保存成功");
      getAllRouter("gzh_")
    })
  }
}

</script>

<style scoped>

</style>