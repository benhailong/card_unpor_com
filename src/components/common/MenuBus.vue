<template>
  <div>
    <div class="logo">
      卡券充值系统
    </div>

    <a-scrollbar style="height:calc(100vh - 54px) ;overflow: auto;">
      <div class="menu-title up-flex up-jc-sb" style="margin-bottom: 20px">
        <div>
<!--          <icon-home /> 数据中心-->
          <svg-icon name="menu-home"  style="font-size: 16px;margin-top: -3px" /> 数据中心
        </div>
      </div>

      <template v-if="menu" v-for="(item,index) in menu">
        <div class="menu-title up-flex up-jc-sb">
          <div>
            <svg-icon :name="item.icon"  style="font-size: 16px;margin-top: -3px" /> {{item.title}}
          </div>
          <div><icon-right /></div>
        </div>
        <div class="menu-level up-flex up-jc-sb">
          <div class="menu-level-li" v-for="(t,i) in item.children" @click="upTools.goPath(t.path)">{{t.title}}</div>
        </div>
      </template>

<!--      <div class="menu-title up-flex up-jc-sb">-->
<!--        <div>-->
<!--          <icon-mobile /> 充值业务-->
<!--        </div>-->
<!--        <div><icon-right /></div>-->
<!--      </div>-->
<!--      <div class="menu-level up-flex up-jc-sb">-->
<!--        <div class="menu-level-li action">在线下单</div>-->
<!--        <div class="menu-level-li">订单列表</div>-->
<!--        <div class="menu-level-li">代理升级</div>-->
<!--      </div>-->
<!--      <div class="menu-title up-flex up-jc-sb">-->
<!--        <div>-->
<!--          <icon-folder /> 快递业务-->
<!--        </div>-->
<!--        <div><icon-right /></div>-->
<!--      </div>-->
<!--      <div class="menu-level up-flex up-jc-sb">-->
<!--        <div class="menu-level-li">快递下单</div>-->
<!--        <div class="menu-level-li">订单列表</div>-->
<!--        <div class="menu-level-li">工单管理</div>-->
<!--      </div>-->
<!--      <div class="menu-title up-flex up-jc-sb">-->
<!--        <div>-->
<!--          <icon-user /> 个人中心-->
<!--        </div>-->
<!--        <div><icon-right /></div>-->
<!--      </div>-->
<!--      <div class="menu-level up-flex up-jc-sb">-->
<!--        <div class="menu-level-li">充值</div>-->
<!--        <div class="menu-level-li">收支明细</div>-->
<!--        <div class="menu-level-li">退出提现</div>-->
<!--        <div class="menu-level-li">个人资料</div>-->
<!--        <div class="menu-level-li">修改密码</div>-->
<!--      </div>-->


<!--      <div class="menu-title up-flex up-jc-sb">-->
<!--        <div>-->
<!--          <icon-user /> 用户管理（管）-->
<!--        </div>-->
<!--        <div><icon-right /></div>-->
<!--      </div>-->
<!--      <div class="menu-level up-flex up-jc-sb">-->
<!--        <div class="menu-level-li">用户列表</div>-->
<!--        <div class="menu-level-li">代理级别</div>-->
<!--        <div class="menu-level-li">代理商</div>-->
<!--        <div class="menu-level-li">余额记录</div>-->
<!--      </div>-->

<!--      <div class="menu-title up-flex up-jc-sb">-->
<!--        <div>-->
<!--          <icon-subscribed /> 商品（管）-->
<!--        </div>-->
<!--        <div><icon-right /></div>-->
<!--      </div>-->
<!--      <div class="menu-level up-flex up-jc-sb">-->
<!--        <div class="menu-level-li">分类</div>-->
<!--        <div class="menu-level-li">商品</div>-->
<!--      </div>-->

    </a-scrollbar>
  </div>
</template>


<script setup lang="ts">
import { ref, defineProps, getCurrentInstance, defineEmits,h, compile } from 'vue';
const {proxy: instance} = getCurrentInstance()

import {storeToRefs} from "pinia";
import { routerStore } from "@/stores/routerStore";
import upTools from "@/utils/upTools.ts";
let {menu} = storeToRefs(routerStore());
/**
 * 根据用户所在的角色，找出所有的路由
 */
// const getRoutesByRole = () => {
//   instance.$http.users.getRoutesByRole()
//       .then((res:any) => {
//         // console.log(res);
//         menu.value = res.data;
//         routerList.addRoutes(res.data, router)
//       }).catch( (err:any) => {
//     console.log(err)
//     // err ? instance.$message.error(err) : console.log(err)
//   })
// }
//
// getRoutesByRole();

</script>

<style scoped>
  @import "@/assets/scss/_style.scss";
</style>