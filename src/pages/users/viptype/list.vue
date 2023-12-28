<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
        <a-breadcrumb-item>会员类型</a-breadcrumb-item>
      </a-breadcrumb>
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
            <a-form-item field="title" label="会员名称"
                         :rules="[{required:true,message:'会员名称不能为空'}]"
                         :validate-trigger="['blur']"
            >
              <a-input v-model="form.title" placeholder="请输入会员名称，(例：电影票)" />
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

  const visible = ref(false);
  const visibleLoding = ref(false);
  const title = ref("新增会员等级");
  const updateId = ref(0);

  const form = reactive({
    title: '',
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
    title: '类型标题',
    dataIndex: 'title',
  }, {
    title: '添加时间',
    dataIndex: 'create_time',
    width:300
  },{
    title: '修改时间',
    dataIndex: 'update_time',
    width:300
  },{
    title: '操作',
    slotName: 'optional',
    width:200
  }]);

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
      page_size: pageInfo.value.page_size,
      page: pageInfo.value.current
    }
    instance.$http.viptype.getAllByPage(parems).then((res:any) => {
      console.log("res",res)
      data.value = res.data.list;
      pageInfo.value.total = res.data.total;
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }

  getAllByPage();

  const pageChange = (e) => {
    pageInfo.value.current = e;
    getAllByPage();
  }

  const getInfoById = (e:number) =>{
    form.title = '';
    title.value = '修改接口';
    updateId.value = e;
    visible.value = true;
    visibleLoding.value = true;

    instance.$http.viptype.getInfoById({"id":e}).then((res:any)=>{
      // console.log(res)
      visibleLoding.value = false;
      form.title = res.data.title;
    })
  }

  /**
   * 删除
   */
  const handleDelete = (e:number) =>{
    instance.$http.viptype.delete({"id":e}).then((res:any)=>{
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
      instance.$http.viptype.update(values).then((res:any)=>{
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
      instance.$http.viptype.add(values).then((res:any)=>{
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