<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>系统设置</a-breadcrumb-item>
        <a-breadcrumb-item>角色</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
<!--    <div class="list-top">-->
<!--      <a-space>-->
<!--        <a-input :style="{width:'320px'}" v-model="search.address" default-value="" placeholder="接口地址" allow-clear />-->
<!--        <a-button type="primary" @click="getSearch">搜索</a-button>-->
<!--      </a-space>-->
<!--    </div>-->
    <div class="list-top">
      <a-space>
        <a-button @click="addOrUpdate()" shape="round" type="primary">
          <template #icon>
            <icon-plus />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>新增角色</template>
        </a-button>
      </a-space>
    </div>
    <a-drawer :width="700" :visible="visibleRouter" @ok="saveRouter" @cancel="handleCancel" unmountOnClose>
<!--      路由配置-->
      <template #title>
        路由权限
      </template>
<!--      {{checkedKeys}}-->
      <a-spin style="width: 100%" :loading="visibleLoding" tip="加载中...">
        <div>
          <a-tree
              :checkable="true"
              :check-strictly="true"
              v-model:checked-keys="checkedKeys"
              :fieldNames="{
              key: 'id',
              title: 'title',
              children: 'children',
              icon: 'customIcon'
            }"
              :data="routerData"
          />
        </div>
      </a-spin>
    </a-drawer>
    <a-drawer :width="700" :visible="visiblePort" @ok="savePortByRoleId" @cancel="handleCancel" unmountOnClose>
      <!--      接口配置-->
      <template #title>
        接口权限
      </template>
      <a-spin style="width: 100%" :loading="visibleLoding" tip="加载中...">
        <div>
          <a-tree
              :checkable="true"
              checked-strategy="child"
              v-model:checked-keys="checkedKeys"
              :fieldNames="{
              key: 'id',
              title: 'title',
              children: 'children',
              icon: 'customIcon'
            }"
              :data="portList"
          />
        </div>
      </a-spin>
    </a-drawer>
    <a-drawer :width="700" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
      <template #title>
        {{title}}
      </template>
      <a-spin style="width: 100%" :loading="visibleLoding" tip="加载中...">
        <div>
          <a-form ref="formRef" :model="form" style="width:100%" @submit="handleSubmit">
            <a-form-item field="name" label="角色名称"
                         :rules="[{required:true,message:'角色名称不能为空'},{maxLength:15,message:'最大长度15个字符'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.name" placeholder="请输入角色名称" />
            </a-form-item>
            <a-form-item field="label" label="英文标识"
                         :rules="[{required:true,message:'英文标识不能为空'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.label" placeholder="请输入角色英文标识，(例：admin)" />
            </a-form-item>
            <a-form-item field="introduce" label="介绍">
              <a-textarea v-model="form.introduce" placeholder="请输入角色说明" allow-clear/>
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
        <a-button style="margin-left: 10px" type="primary" size="mini" @click="getRouterById(record.id)">路由</a-button>
        <a-button style="margin-left: 10px" type="primary" size="mini" @click="getPortById(record.id)">接口</a-button>
        <a-popconfirm v-if="record.id > 2" content="确定删除吗?" @ok="handleDelete(record.id)">
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

const checkedKeys = ref([]);

const visible = ref(false);
const visibleRouter = ref(false);
const visiblePort = ref(false);

const title = ref("");
const visibleLoding = ref(false);
const form = reactive({
  name: '',
  label: '',
  introduce: '',
})

const search = reactive({
  address: '',
})


const updateId = ref(0);

const columns = ref([{
  title: '角色名称',
  dataIndex: 'name',
  width:200
}, {
  title: '类型',
  dataIndex: 'label',
  width:280
}, {
  title: '说明',
  dataIndex: 'introduce',
},{
  title: '操作',
  slotName: 'optional',
  width:300
}]);

const data = ref([]);
const pageInfo = ref({
  total: 0,
  current: 1,
  page_size: 10
});
const routerData = ref([]);
const portList = ref([]);

const getSearch = () => {
  pageInfo.value.current = 1;
  getAll();
}

const getAll = () => {
  const params = {
    page: pageInfo.value.current,
    size: pageInfo.value.page_size,
    keywords: search.address,
  }
  instance.$http.role.getAll(params).then((res:any)=>{
    // console.log(res.data.list)
    data.value = res.data.list;
    pageInfo.value.total = res.data.total;
  })
}

getAll();

const addOrUpdate = () => {
  form.name = '';
  form.label = '';
  form.introduce = '';
  title.value = '新增角色';
  visible.value = true;
}

const handleOk = () => {
  // debugger
  instance.$refs['formRef'].handleSubmit();
  // visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
  visibleRouter.value = false;
  visiblePort.value = false;
};

const handleSubmit = ({values, errors}) => {
  console.log('values:', values, '\nerrors:', errors)

  if (title.value == '修改角色') {
    values["id"]=updateId.value;
    instance.$http.role.update(values).then((res:any)=>{
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
    instance.$http.role.add(values).then((res:any)=>{
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
    instance.$http.role.delete({"id":e}).then((res:any)=>{
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
  form.name = '';
  form.label = '';
  form.introduce = '';
  title.value = '修改角色';
  updateId.value = e;
  visible.value = true;
  visibleLoding.value = true;

  instance.$http.role.getInfoById({"id":e}).then((res:any)=>{
    // console.log(res)
    visibleLoding.value = false;
    form.name = res.data.name;
    form.label = res.data.label;
    form.introduce = res.data.introduce;
  })
}


const getAllRouter = (e:number) => {
  instance.$http.router.getAllRouter({"fid":e}).then((res:any)=>{
    // console.log(res)
    routerData.value = res.data
  })
}

getAllRouter(-1);

const getAllNeedAuthAndGroupByRouterId = () =>{
  // 获取当前已经选择的路由
  instance.$http.port.getAllNeedAuthAndGroupByRouterId().then((res:any)=>{
    // console.log(res)
    portList.value = res.data
  })
}
getAllNeedAuthAndGroupByRouterId();

const pageChange = (e) => {
  pageInfo.value.current = e;
  getAll();
}

const getRouterById = (e:number) =>{
  updateId.value = e;
  // 获取当前已经选择的路由
  visibleLoding.value = true;
  instance.$http.role.getRouterByRoleId({"role_id":e}).then((res:any)=>{
    visibleLoding.value = false;
    // console.log(res)
    checkedKeys.value = res.data
  })
  visibleRouter.value = true;
}

// 保存路由权限
const saveRouter = () =>{
  visibleLoding.value = true;
  instance.$http.role.saveRouterByRoleId({"role_id":updateId.value,'routers':checkedKeys.value}).then((res:any)=>{
    visibleLoding.value = false;
    instance.$message.success('保存成功');
    visibleRouter.value = false;
  })
}

const getPortById = (e:number) =>{
  updateId.value = e;
  // 获取当前已经选择的接口
  visibleLoding.value = true;
  instance.$http.role.getPortByRoleId({"role_id":e}).then((res:any)=>{
    visibleLoding.value = false;
    // console.log(res)
    checkedKeys.value = res.data
  })
  visiblePort.value = true;
}

// 保存接口权限
const savePortByRoleId = () =>{
  visibleLoding.value = true;
  instance.$http.role.savePortByRoleId({"role_id":updateId.value,'ports':checkedKeys.value}).then((res:any)=>{
    visibleLoding.value = false;
    instance.$message.success('保存成功');
    // console.log(res)
    visiblePort.value = false;
  })
}

</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>