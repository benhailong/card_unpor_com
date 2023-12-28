<template>
  <div>
    <div class="list-top">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
        <a-breadcrumb-item>用户列表</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="list-top">
      <a-space>
        <a-input style="width:200px" v-model="searchInfo.username" placeholder="用户名" allow-clear />
        <a-input style="width:200px" v-model="searchInfo.phone" placeholder="手机号" allow-clear />
        <a-input style="width:200px" v-model="searchInfo.email" placeholder="邮箱" allow-clear />
        <a-button type="primary" @click="getSearch">搜索</a-button>
      </a-space>
    </div>
<!--VIP授权-->
    <a-drawer :width="700" :visible="vipVisible" @ok="vipHandleOk" @cancel="vipHandleCancel" unmountOnClose>
      <template #title>
        会员授权
      </template>
      <a-spin style="width: 100%" :loading="vipvisibleLoding" tip="加载中...">
        <div>
          <a-form ref="vipFormRef" :model="vipForm" style="width:100%" @submit="vipSubmit">
            <template v-for="(post,index) in vipForm.posts">
              <div>
                <a-form-item field="title" :label="post.title" extra="后面日期选择到期时间" :field="`posts[${index}].vip`"  >
                  <a-select v-model="post.vip" placeholder="请选择接口类型" >
                    <a-option  v-for="(vip, i) in post.vips" :key="i" :value="vip.id">{{vip.title}}</a-option>
                  </a-select>
                  <a-date-picker v-model="post.expire_time" style="width: 200px;margin-left: 10px" />
                </a-form-item>
              </div>
            </template>
          </a-form>
        </div>
      </a-spin>
<!--      <div>{{vipForm}}</div>-->
    </a-drawer>

    <!--用户信息编辑信息-->
    <a-drawer :width="700" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
      <template #title>
        编辑用户信息
      </template>
      <a-spin style="width: 100%" :loading="visibleLoding" tip="加载中...">
        <div>
          <a-form ref="vipFormRef" :model="form" style="width:100%" @submit="submit">
            <template v-for="(post,index) in vipForm.posts">
              <div>
                <a-form ref="formRef" :model="form" style="width:100%" @submit="handleSubmit">
                  <a-form-item field="username" label="用户名">
                    <a-input v-model="form.username" placeholder="请输入会员级别" />
                  </a-form-item>
                  <a-form-item field="title" label="手机号">
                    <a-input v-model="form.phone" placeholder="请输入手机号码" />
                  </a-form-item>
                  <a-form-item field="title" label="邮箱">
                    <a-input v-model="form.email" placeholder="请输入会员名称，(例：SVIP)" />
                  </a-form-item>

                  <a-form-item field="role_id" label="角色">
                    <a-select v-model="form.role_id" placeholder="请选择接口类型" >
                      <a-option v-for="(t,index) in roles" :key="index" :value="t.id">{{t.name}}</a-option>
                    </a-select>
                  </a-form-item>
                </a-form>
              </div>
            </template>
          </a-form>
        </div>
      </a-spin>
<!--            <div>{{roles}}</div>-->
    </a-drawer>

    <a-table :columns="columns" :data="data" row-key="name" :pagination="false">
      <template #type="{ record }">
        <a-switch :disabled="record.id==1"  v-model="record.status" :checked-value="1" :unchecked-value="2" @change="updateStatus(record.id,record.status)" />
      </template>
      <template #optional="{ record }">
        <a-button type="primary" size="mini" @click="getInfoById(record.id)">编辑</a-button>
        <a-button type="primary" style="margin-left: 10px" size="mini" @click="setVip(record.id)">会员授权</a-button>
      </template>
    </a-table>
    <div style="float: right;margin-top: 10px">
      <a-pagination :total="pageInfo.total" :current="pageInfo.current" :page-size="pageInfo.page_size" @change="pageChange"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {ref,getCurrentInstance} from "vue";
  const {proxy: instance} = getCurrentInstance()

  const user_id = ref(0);
  const vipVisible = ref(false);
  const vipvisibleLoding = ref(false);
  const visible = ref(false);
  const visibleLoding = ref(false);

  const searchInfo = ref({
    phone: "",
    username: "",
    email: ""
  });

  const pageInfo = ref({
    total: 0,
    current: 1,
    page_size: 10
  });

  const data = ref([]);
  const vipList = ref([]);
  const vipForm = ref({
    posts: [],
  });

  const form = ref({}); // 用户详细信息
  const roles = ref([]); // 所有角色列表

  const columns = ref([{
    title: 'ID',
    dataIndex: 'id',
    width:80
  },{
    title: '用户名',
    dataIndex: 'username',
    width:150
  }, {
    title: '手机号',
    dataIndex: 'phone',
    width:200
  },{
    title: '邮箱',
    dataIndex: 'email',
    width:280
  }, {
    title: '角色',
    dataIndex: 'role_name',
    width:200
  }, {
    title: '状态',
    dataIndex: 'status',
    slotName: 'type',
    width:200
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
  
  const setVip = (e:number) => {
    user_id.value = e;
    vipVisible.value = true;
    // 获取用户角色
    vipvisibleLoding.value = true;
    instance.$http.users.getVipByUserId({"user_id": e}).then((res:any) => {
      console.log(res);
      vipvisibleLoding.value = false;
      for(let i = 0; i < vipForm.value.posts.length; i++){
        for(let j = 0; j < res.data.length; j++){
          if(vipForm.value.posts[i].typeid === res.data[j].vip_type_id){
            vipForm.value.posts[i].vip = res.data[j].vip_id;
            vipForm.value.posts[i].expire_time = res.data[j].vip_expire_time.substring(0,10);
          }
        }
      }
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }

  /**
   * 分页查询用户列表
   */
  const getAllByPage = () => {
    const parems = {
      phone: searchInfo.value.phone,
      username: searchInfo.value.username,
      email: searchInfo.value.email,
      page_size: pageInfo.value.page_size,
      page: pageInfo.value.current
    }
    instance.$http.users.getAllByPage(parems).then((res:any) => {
      console.log("res",res)
      data.value = res.data.list;
      pageInfo.value.total = res.data.total;
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }

  /**
   * 查询会员等级
   */
  const getAllVipByAllType = () => {
    instance.$http.vip.getAllVipByAllType().then((res:any) => {
      console.log("res",res)
      vipList.value = res.data;
      // 生成动态表单
      for (let i = 0; i < vipList.value.length; i++){
        vipForm.value.posts.push({
          'typeid':vipList.value[i].id,
          'title':vipList.value[i].title,
          'vips':vipList.value[i].vips,
          'vip': '',
          'expire_time': ''
        })
      }
    }).catch( (err:any) => {
      // instance.$message.error("????")
    })
  }

  getAllByPage();
  getAllVipByAllType();

  const pageChange = (e) => {
    pageInfo.value.current = e;
    getAllByPage();
  }

  const vipHandleOk = () => {
    // debugger
    instance.$refs['vipFormRef'].handleSubmit();
    // visible.value = false;
  };

  const vipHandleCancel = () => {
    vipVisible.value = false;
  };

  /**
   * 开通VIP权限的 提交方法
   * @param values
   * @param errors
   */
  const vipSubmit = ({values, errors}) => {
    // console.log('values:', values, '\nerrors:', errors)
    let vips = [];
    for (let i = 0; i < values.posts.length; i++) {
      console.log("values"+i,values.posts[i]);
      if(values.posts[i].vip && values.posts[i].expire_time){
        // 追加数据
        vips.push({
          'vip':values.posts[i].vip,
          'vip_type_id':values.posts[i].typeid,
          'expire_time':values.posts[i].expire_time
        })
      }
    }
    // 将数据封装
    const data = {
      'user_id':user_id.value,
      'vips':JSON.stringify(vips)
    }

    instance.$http.users.setVip(data).then((res:any)=>{
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

  
  const updateStatus = (user_id:number,status:number) => {
    const data = {
      'user_id':user_id,
      'status':status
    };
    instance.$http.users.setStatus(data).then((res:any)=>{
      if(res.code==0){
        instance.$message.success('保存成功');
      }else{
        instance.$message.error(res.msg);
      }
    })
  }

  /**
   * 获取会员详细信息
   * @param e
   */
  const getInfoById = (e:number) => {
    const data = {
      'user_id':e
    };
    visible.value =  true;
    visibleLoding.value = true;
    instance.$http.users.getInfoById(data).then((res:any)=>{
      visibleLoding.value = false;
      console.log(res)
      form.value = res.data;
    })
  };

  /**
   * 查询所有角色列表
   */
  const getAllRoleNoPage = () => {
    instance.$http.role.getAllNoPage().then((res:any)=>{
      console.log(res)
      roles.value = res.data;
    })
  }

  getAllRoleNoPage();

  const handleOk = () => {
    // debugger
    // instance.$refs['vipFormRef'].handleSubmit();
    // visible.value = false;
  };

  const handleCancel = () => {
    visible.value = false;
  };
  
</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>