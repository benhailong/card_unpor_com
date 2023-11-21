import axios from "axios";
import { Message } from '@arco-design/web-vue';
import 'nprogress/nprogress.css';
import upTools from "@/utils/upTools.ts";

// 不需要token的页面
import noTokenApiUrl from "./noTokenApiUrl.json"

import {userStore} from '@/stores/userStore'
import {storeToRefs} from 'pinia'

const http = axios.create({
    baseURL: '/admin',
    timeout: 50000
})


// 数据请求拦截
http.interceptors.request.use(async (config) => {
    // 添加token
    const {userinfo, startTime} = storeToRefs(userStore());
    config.headers['Content-Type'] = "application/x-www-form-urlencoded";
    // 判断登录是否超时
    if (noTokenApiUrl.indexOf(config.url) < 0) {
        // 如果不是排除的API
        if(!userinfo.value || !startTime.value){
            // 没有用户的登录信息。直接跳转到登录页面
            Message.error("暂未登录");
            upTools.goPath("/login");
        }
        if(startTime.value){
            let endTime = new Date()
            let dateDiff = endTime.getTime() - startTime.value;
            if (dateDiff > (15 * 60 * 1000)){
                startTime.value = '';
                userinfo.value = null;
                upTools.goPath("/login");
            }
        } else{
            startTime.value = '';
            userinfo.value = null;
            upTools.goPath("/login");
        }
    }
    if (userinfo && userinfo.value) {
        let sTime = new Date()
        startTime.value = sTime.getTime();
        config.headers['Token'] = userinfo.value.token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 返回响应数据拦截
http.interceptors.response.use((res) => {
    const data = res.data;
    // if(data.code=='10002'){
    //     // 接口返回需要登录，也就是如果在user页面需要退到首页
    //     const path = router.currentRoute._value.path;
    //     if(path.indexOf("/user/") != -1){
    //         // 包含
    //         router.push({
    //             path: '/',
    //         })
    //     }
    // }

    // 状态码为 2xx 范围时都会调用该函数，处理响应数据
    // if (res.status === 200) {
    //     const code = data.code;
    //     if (code == 0) {
    //         return Promise.resolve(data);
    //     } else {
    //         Message.error("登录超时");
    //         const {password} = storeToRefs(userStore());
    //         password.value = '';
    //         window.location.href = "/login"
    //         return Promise.reject(data)
    //     }
    // }

    if(data.code!=0 && data.code!=1000){
        Message.error(data.msg);
        throw new Error(response.data.msg);
    }

    return Promise.resolve(data);

}, (error) => {
    if (error && error.response && error.response.status) {
        // 状态码超过 2xx 范围时都会调用该函数，处理错误响应
        switch (error.response.status) {
            case 404:
                Message.error("404 not found！");
                break;
            case 502:
                Message.error("internal error！");
                break;
            default:
                break;
        }
    } else {
        console.error(error)
    }
    return Promise.reject(error);
});
export default http;
