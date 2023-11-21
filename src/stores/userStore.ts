import { defineStore } from 'pinia'

export const userStore = defineStore({
    id: 'user',
    state:()=>{
        return {
            userinfo: null,
            startTime: ''  // token 存储开始时间
        }
    },
    getters:{

    },
    actions:{

    },
    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'my_user',
                storage: localStorage,
            }
        ]
    }
})
