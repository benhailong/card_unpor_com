import { defineStore } from 'pinia'

import { RouteRecordRaw } from 'vue-router'
let modules = import.meta.glob(["@/pages/system/router/*.vue","@/pages/system/port/*.vue","@/pages/system/role/*.vue"])

import api from "@/http/api/users";

export const routerStore = defineStore({
    id: 'routerList',
    state:()=>{
        return {
            // 路由表
            routerList: [] as Array<RouteRecordRaw>,
            // 左侧导航菜单
            menu:[],
            changeId: 0
        }
    },
    getters:{},
    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'routerList',
                storage: localStorage,
                paths: ['changeId']
            }
        ]
    },
    actions:{
        // 添加动态路由，并同步到状态管理器中
        addRoutes(router: any) {
            return new Promise(async (resolve) => {
                let data= {};
                // 获取后台的权限列表。根据用户所在的角色，找出所有的路由
                api.getRoutesByRole().then((res:any) => {
                    console.log("来了API");
                    data = res.data;
                    // 路由解析
                    this.menu = data;

                    // 回复路由信息
                    this.routerList = [{
                        path:"/home",
                        name:"home",
                        component:() => import("@/pages/home/main.vue"),
                        children: [
                            {
                                path: "/home",
                                name: "home",
                                component: () => import("@/pages/home/home.vue"),
                                meta: {
                                    topIndex: 0,
                                    leftIndex: 0
                                }
                            }
                        ]
                    }];

                    for (var i:number=0; i<data.length; i++ ) {
                        const item =  data[i];
                        this.routerList[0].children.push({
                            path: item.path,
                            name: item.name,
                            // 错误示例：components:()=>import(`../views/Pages/${m.component}`)
                            // 正确示例如下：
                            component: modules[`/src/pages${item.component}`],
                        })
                        for (var n:number=0; n<item.children.length; n++ ) {
                            this.routerList[0].children.push({
                                path: item.children[n].path,
                                name: item.children[n].name,
                                // 错误示例：components:()=>import(`../views/Pages/${m.component}`)
                                // 正确示例如下：
                                component: modules[`/src/pages${item.children[n].component}`],
                            })
                        }
                    }

                    this.routerList.forEach(m =>
                        router.addRoute(m)
                    );
                    resolve("success");
                }).catch( (err:any) => {
                    console.log(err)
                    // err ? instance.$message.error(err) : console.log(err)
                })
            })
        }
    }
})
