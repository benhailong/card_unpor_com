<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
        <a-breadcrumb-item>会员等级</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="list-top">
      <a-space>
        <a-select style="width: 200px" v-model="searchInfo.type" placeholder="请选择接口类型">
          <a-option :value="0">全部</a-option>
          <a-option v-for="(t,index) in apiType" :key="index" :value="t.id">{{t.title}}</a-option>
        </a-select>
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
          <template #default>新增</template>
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
            <a-form-item field="title" label="会员类型" extra="新增会员类型，左侧用户管理-会员类型">
              <a-select v-model="form.type" placeholder="请选择接口类型" >
                <a-option v-for="(t,index) in apiType" :key="index" :value="t.id">{{t.title}}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="title" label="会员名称"
                         :rules="[{required:true,message:'会员名称不能为空'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.title" placeholder="请输入会员名称，(例：SVIP)" />
            </a-form-item>
            <a-form-item field="sort" label="会员级别" extra="等级越高权限越大，最高100，默认0">
              <a-input-number v-model="form.sort" placeholder="请输入会员级别"  :min="0" :max="100"/>
            </a-form-item>
            <a-form-item field="introduce" label="介绍">
              <a-textarea v-model="form.introduce" placeholder="请输入会员等级简介" allow-clear/>
            </a-form-item>
          </a-form>
        </div>
      </a-spin>

    </a-drawer>

    <a-table :columns="columns" :data="data" row-key="name" :pagination="false">
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
  import {ref,reactive,getCurrentInstance} from "vue";
  const {proxy: instance} = getCurrentInstance()

  const searchInfo = ref({
    type: 0,
  });

  const apiType = ref([]);

  const visible = ref(false);
  const visibleLoding = ref(false);
  const title = ref("新增会员等级");
  const updateId = ref(0);

  const form = reactive({
    type: 1,
    title: '',
    introduce: '',
    sort: 0,
  })

  const pageInfo = ref({
    total: 0,
    current: 1,
    page_size: 10
  });

  const data = ref([]);

  const columns = ref([{
    title: 'ID',
    dataIndex: 'id',
    width:80
  },{
    title: '会员名称',
    dataIndex: 'title',
    width:150
  }, {
    title: '会员类型',
    dataIndex: 'vt_title',
    width:150
  },{
    title: '会员级别',
    dataIndex: 'sort',
    width:200
  },{
    title: '会员简介',
    dataIndex: 'introduce',
  },{
    title: '操作',
    slotName: 'optional',
    width:200
  }]);
  /**
   * 搜索方法
   */
  const getSearch = () => {
    pageInfo.value.current = 1;
    getAllByPage();
  }

  const addOrUpdate = () => {
    form.type = 1;
    form.title = '';
    form.introduce = '';
    form.sort = 0
    title.value = '新增会员等级';
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

  /**
   * 分页查询用户列表
   */
  const getAllByPage = () => {
    const parems = {
      type: searchInfo.value.type,
      page_size: pageInfo.value.page_size,
      page: pageInfo.value.current
    }
    instance.$http.vip.getAllByPage(parems).then((res:any) => {
      console.log("res",res)
      data.value = res.data.list;
      pageInfo.value.total = res.data.total;
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }

  /**
   * 获取所有的会员类型
   */
  const vipTypeGetAll = () => {
    instance.$http.viptype.getAll().then((res:any) => {
      console.log(res)
      apiType.value = res.data;
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }

  getAllByPage();
  vipTypeGetAll();

  const pageChange = (e) => {
    pageInfo.value.current = e;
    getAllByPage();
  }

  const getInfoById = (e:number) =>{
    form.type = 1;
    form.title = '';
    form.introduce = '';
    form.sort = 0
    title.value = '修改接口';
    updateId.value = e;
    visible.value = true;
    visibleLoding.value = true;

    instance.$http.vip.getInfoById({"id":e}).then((res:any)=>{
      // console.log(res)
      visibleLoding.value = false;
      form.type = res.data.type;
      form.title = res.data.title;
      form.introduce = res.data.introduce;
      form.sort = res.data.sort;
    })
  }

  /**
   * 删除
   */
  const handleDelete = (e:number) =>{
    instance.$http.vip.delete({"id":e}).then((res:any)=>{
      if(res.code==0){
        instance.$message.success('删除成功');
        getAllByPage();
      }else{
        instance.$message.error(res.msg);
      }
    })
  }

  const handleSubmit = ({values, errors}) => {
    console.log('values:', values, '\nerrors:', errors)

    if (title.value == '修改接口') {
      values["id"]=updateId.value;
      instance.$http.vip.update(values).then((res:any)=>{
        // console.log(res)
        if(res.code==0){
          instance.$message.success('保存成功');
          visible.value = false;
          getAllByPage();
        }else{
          instance.$message.error(res.msg);
        }
      })
    } else {
      // 添加
      instance.$http.vip.add(values).then((res:any)=>{
        // console.log(res)
        if(res.code==0){
          instance.$message.success('保存成功');
          visible.value = false;
          getAllByPage();
        }else{
          instance.$message.error(res.msg);
        }
      })
    }
  }

</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>