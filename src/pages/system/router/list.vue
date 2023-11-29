<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>系统设置</a-breadcrumb-item>
        <a-breadcrumb-item>系统路由</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
<!--    <div class="list-top">-->
<!--      <a-space>-->
<!--        <a-input :style="{width:'320px'}" default-value="" placeholder="路由名称" allow-clear />-->
<!--        <a-input :style="{width:'320px'}" default-value="" placeholder="路由地址" allow-clear />-->
<!--        <a-button type="primary">搜索</a-button>-->
<!--      </a-space>-->
<!--    </div>-->
    <div class="list-top">
      <a-space>
        <a-button @click="addOrUpdate()" shape="round" type="primary">
          <template #icon>
            <icon-plus />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>新增路由</template>
        </a-button>
      </a-space>
    </div>
    <a-drawer :width="700" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
      <template #title>
        {{title}}
      </template>
      <a-spin style="width: 100%" :loading="visibleLoding" tip="加载中...">
        <div>
          <a-form ref="formRef" :model="form" style="width:100%" @submit="handleSubmit">
            <a-form-item field="title" label="路由名称"
                         :rules="[{required:true,message:'路由名称不能为空'},{maxLength:5,message:'最大长度5个字符'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.title" placeholder="请输入路由名称" />
            </a-form-item>
            <a-form-item field="path" label="路由路径"
                         :rules="[{required:true,message:'路由路径不能为空'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.path" placeholder="请输入路由名称，(例：/home)" />
            </a-form-item>
            <a-form-item field="name" label="路由标识"
                         :rules="[{required:true,message:'路由标识不能为空'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.name" placeholder="请输入路由标识，(例：home)" />
            </a-form-item>
            <a-form-item field="component" label="vue文件路径"
                         :rules="[{required:true,message:'vue文件路径不能为空'}]"
                         :validate-trigger="['change','input']"
            >
              <a-input v-model="form.component" placeholder="请输入vue文件路径，(例：/system/router/list.vue)" />
            </a-form-item>
            <a-form-item field="icon" label="图标">
              <a-input v-model="form.icon" placeholder="请输入图标名称，例如:menu-setting" />
            </a-form-item>
            <a-form-item field="fid" label="上级路由">
              <a-select v-model="form.fid" placeholder="请选择上级路由">
                <a-option :value="0">无</a-option>
                <a-option v-for="(t,index) in data" :key="index" :value="t.id">{{t.title}}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="sort" label="排序"
                         extra="请输入路由的排序，越大越靠前">
              <a-input v-model="form.sort" placeholder="请输入路由的排序，越大越靠前" />
            </a-form-item>
          </a-form>
        </div>
      </a-spin>

    </a-drawer>
    <a-table :columns="columns" :data="data" row-key="name">
      <template #optional="{ record }">
        <a-button type="primary" size="mini" @click="getInfoById(record.id)">编辑</a-button>
        <a-popconfirm content="确定删除吗?" @ok="handleDelete(record.id)">
          <a-button style="margin-left: 10px" type="primary" status="danger" size="mini" @click="">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">

import {reactive,ref,getCurrentInstance} from "vue";

const {proxy: instance} = getCurrentInstance()

const visible = ref(false);
const title = ref("");
const visibleLoding = ref(false);
const form = reactive({
  title: '',
  path: '',
  name: '',
  component:'',
  icon: '',
  fid: 0,
  sort: 0,
})

const updateId = ref(0);

const columns = ref([{
  title: '路由名称',
  dataIndex: 'title',
  width:200
}, {
  title: '路由地址',
  dataIndex: 'path',
  width:280
}, {
  title: '页面',
  dataIndex: 'component',
}, {
  title: '标识符',
  dataIndex: 'name',
  width:200
}, {
  title: '路径',
  dataIndex: 'path',
  width:200
}, {
  title: '排序',
  dataIndex: 'sort',
  width:200
}, {
  title: '操作',
  slotName: 'optional',
  width:200
}]);

const data = ref([]);

const getAllRouter = (e:number) => {
  instance.$http.router.getAllRouter({"fid":e}).then((res:any)=>{
    // console.log(res)
    data.value = res.data
  })
}

getAllRouter(-1);

const addOrUpdate = () => {
  form.title = '';
  form.path = '';
  form.name = '';
  form.component = '';
  form.icon = '';
  form.fid = 0;
  form.sort = 0;
  title.value = '新增路由';
  visible.value = true;
}

const handleOk = () => {
  // debugger
  instance.$refs['formRef'].handleSubmit();
  // visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

const handleSubmit = ({values, errors}) => {
  console.log('values:', values, '\nerrors:', errors)

  if (title.value == '修改路由') {
    values["id"]=updateId.value;
    instance.$http.router.update(values).then((res:any)=>{
      // console.log(res)
      if(res.code==0){
        instance.$message.success('保存成功');
        visible.value = false;
        getAllRouter(-1);
      }else{
        instance.$message.error(res.msg);
      }
    })
  } else {
    // 添加
    instance.$http.router.addRouter(values).then((res:any)=>{
      // console.log(res)
      if(res.code==0){
        instance.$message.success('保存成功');
        visible.value = false;
        getAllRouter(-1);
      }else{
        instance.$message.error(res.msg);
      }
    })
  }
}

/**
 * 删除
 */
const handleDelete = (e:number) =>{
    instance.$http.router.delete({"id":e}).then((res:any)=>{
      if(res.code==0){
        instance.$message.success('删除成功');
        getAllRouter(-1);
      }else{
        instance.$message.error(res.msg);
      }
    })
}

/**
 * 根据ID查看详情
 */
const getInfoById = (e:number) =>{
  form.title = '';
  form.path = '';
  form.name = '';
  form.component = '';
  form.icon = '';
  form.fid = 0;
  form.sort = 0;
  title.value = '修改路由';
  updateId.value = e;
  visible.value = true;

  visibleLoding.value = true;

  instance.$http.router.getInfoById({"id":e}).then((res:any)=>{
    // console.log(res)
    visibleLoding.value = false;
    form.title = res.data.title;
    form.path = res.data.path;
    form.name = res.data.name;
    form.component = res.data.component;
    form.icon = res.data.icon;
    form.fid = res.data.fid;
    form.sort = res.data.sort;
  })
}

</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>