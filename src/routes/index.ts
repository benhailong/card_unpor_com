import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"

import { Message } from '@arco-design/web-vue';

import {storeToRefs} from "pinia";
import { routerStore } from "@/stores/routerStore";
import { userStore } from "@/stores/userStore";

import api from "@/http/api/users";

let routes: Array<RouteRecordRaw> = [
    {
        path:"/",
        name:"login",
        component:() => import("@/pages/login/login.vue")
    },
    {
        path:"/register",
        name:"register",
        component:() => import("@/pages/login/register.vue")
    },
    {
        path:"/seekPwd",
        name:"seekPwd",
        component:() => import("@/pages/login/seekPwd.vue")
    }

]

const router = createRouter({
    history:createWebHashHistory(), // 默认的展示方式URL上面会出现#
    // history: createWebHistory(),  // 去掉URL上面的#
    routes
})
/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach(async (to, from, next) => {
    if(to.path != '/register' && to.path != '/seekPwd' && to.path != '/'){
        let {userinfo,startTime} = storeToRefs(userStore());
        // let {routerList} = storeToRefs(routerStore());
        const store = routerStore();
        // 除去这几个页面，无需要判断是否登录，其他页面需要判断是否登录
        if(!userinfo.value || !startTime.value){
            // 没有用户的登录信息。直接跳转到登录页面
            Message.error("暂未登录");
            next('/');
            return
        }
        if(startTime.value){
            let endTime = new Date()
            let dateDiff = endTime.getTime() - startTime.value;
            if (dateDiff > (15 * 60 * 1000)){
                startTime.value = '';
                userinfo.value = null;
                Message.error("登录超时");
                next('/');
                return
            }
        }
        // 根据用户所在的角色，找出所有的路由
        await store.addRoutes(router)
        // next({ ...to, replace: true });
        console.log("准备好了？")
        next();
    }else{
        next();
    }


    // if (to.path == '/login') {
    //     // 登录或者注册才可以往下进行
    //     next();
    // } else {
    //     const userInfo = userStore()
    //     const { password } = storeToRefs(userInfo)
    //
    //     if (!password.value) {
    //         ElMessage.error('您还没有登录，请先登录');
    //         next('/login');
    //     } else {
    //         // 解析路由
    //         let { topIndex, leftIndex } = storeToRefs(urlStore());
    //         topIndex.value = to.meta.topIndex;
    //         leftIndex.value = to.meta.leftIndex;
    //         next();
    //     }
    // }
});

export default router