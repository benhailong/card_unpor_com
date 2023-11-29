<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>系统设置</a-breadcrumb-item>
        <a-breadcrumb-item>接口设置</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="list-top">
      <a-space>
        <a-input :style="{width:'320px'}" v-model="search.address" default-value="" placeholder="接口地址" allow-clear />
        <a-button type="primary" @click="getSearch">搜索</a-button>
      </a-space>
    </div>
    <div class="list-top">
      <a-space>
        <a-button @click="addOrUpdate()" shape="round" type="primary">
          <template #icon>
            <icon-plus />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>新增接口</template>
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
            <a-form-item field="title" label="接口名称"
                         :rules="[{required:true,message:'接口名称不能为空'},{maxLength:30,message:'最大长度30个字符'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.title" placeholder="请输入接口名称" />
            </a-form-item>
            <a-form-item field="address" label="接口地址"
                         :rules="[{required:true,message:'接口地址不能为空'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.address" placeholder="请输入接口地址，(例：port/getAll)" />
            </a-form-item>
            <a-form-item field="router_id" label="所属路由">
              <a-cascader v-model="form.router_id" :options="routerData" :field-names="fieldNames"  placeholder="请选择接口所属路由" allow-search/>
            </a-form-item>
            <a-form-item field="type" label="接口类型">
              <a-select v-model="form.type" placeholder="请选择上级路由">
                <a-option :value="0">公共接口</a-option>
                <a-option :value="1">需要登录</a-option>
                <a-option :value="2">登录并授权</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="introduce" label="介绍">
              <a-textarea v-model="form.introduce" placeholder="请输入接口说明" allow-clear/>
            </a-form-item>
          </a-form>
        </div>
      </a-spin>

    </a-drawer>
    <a-table :columns="columns" :data="data" row-key="name" :pagination="false">
      <template #type="{ record }">
        <div v-if="record.type==0">公开</div>
        <div v-if="record.type==1">需要登录</div>
        <div v-if="record.type==2">登录并授权</div>
      </template>
      <template #optional="{ record }">
        <a-button type="primary" size="mini" @click="getInfoById(record.id)">编辑</a-button>
        <a-popconfirm content="确定删除吗?" @ok="handleDelete(record.id)">
          <a-button style="margin-left: 10px" type="primary" status="danger" size="mini" @click="">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <div style="float: right;margin-top: 10px">
      <a-pagination :total="pageInfo.total" :current="pageInfo.current" :page-size="pageInfo.page_size" @change="pageChange"/>
    </div>
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
  address: '',
  introduce: '',
  router_id: null,
  type: 0,
})

const search = reactive({
  address: '',
})


const updateId = ref(0);

const columns = ref([{
  title: '接口名称',
  dataIndex: 'title',
  width:300
}, {
  title: '接口地址',
  dataIndex: 'address',
  width:280
},{
  title: '所属路由',
  dataIndex: 'router_title',
  width:200
}, {
  title: '类型',
  dataIndex: 'type',
  slotName: 'type',
  width:200
}, {
  title: '说明',
  dataIndex: 'introduce',
},{
  title: '操作',
  slotName: 'optional',
  width:200
}]);

const data = ref([]);
const pageInfo = ref({
  total: 0,
  current: 1,
  page_size: 10
});
const routerData = ref([]);
const fieldNames = {
  label: 'title',
  value: 'id',
}

const getSearch = () => {
  pageInfo.value.current = 1;
  getAll();
}

const getAll = () => {
  const params = {
    page: pageInfo.value.current,
    size: pageInfo.value.page_size,
    address: search.address,
  }
  instance.$http.port.getAll(params).then((res:any)=>{
    console.log(res.data.list)
    data.value = res.data.list;
    pageInfo.value.total = res.data.total;
  })
}

getAll();

const addOrUpdate = () => {
  form.title = '';
  form.address = '';
  form.introduce = '';
  form.router_id = null;
  form.type = 0;
  title.value = '新增接口';
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

  if (title.value == '修改接口') {
    values["id"]=updateId.value;
    instance.$http.port.update(values).then((res:any)=>{
      // console.log(res)
      if(res.code==0){
        instance.$message.success('保存成功');
        visible.value = false;
        getAll();
      }else{
        instance.$message.error(res.msg);
      }
    })
  } else {
    // 添加
    instance.$http.port.add(values).then((res:any)=>{
      // console.log(res)
      if(res.code==0){
        instance.$message.success('保存成功');
        visible.value = false;
        getAll();
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
    instance.$http.port.delete({"id":e}).then((res:any)=>{
      if(res.code==0){
        instance.$message.success('删除成功');
        getAll();
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
  form.address = '';
  form.introduce = '';
  form.router_id = null;
  form.type = 0;
  title.value = '修改接口';
  updateId.value = e;
  visible.value = true;
  visibleLoding.value = true;

  instance.$http.port.getInfoById({"id":e}).then((res:any)=>{
    // console.log(res)
    visibleLoding.value = false;
    form.title = res.data.title;
    form.address = res.data.address;
    form.introduce = res.data.introduce;
    form.router_id = res.data.router_id;
    form.type = res.data.type;
  })
}


const getAllRouter = (e:number) => {
  instance.$http.router.getAllRouter({"fid":e}).then((res:any)=>{
    // console.log(res)
    routerData.value = res.data
  })
}

getAllRouter(-1);

const pageChange = (e) => {
  pageInfo.value.current = e;
  getAll();
}

</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>