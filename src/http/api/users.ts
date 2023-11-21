import http from '../axios.ts'
import {sha256} from "js-sha256";

const api = {
    /**
     * 用户登录
     * @param params
     */
    login(params:Object) {
        const res = http.post('/users/login', params);
        console.log(res);
        return res;
    },
    /**
     * 退出登录
     */
    loginout() {
        const res = http.post('/users/loginout');
        console.log(res);
        return res;
    },
    /**
     * 邮箱注册
     */
    register_email(data:Object) {
        const res = http.post('/users/register_email',data);
        console.log(res);
        return res;
    },
    /**
     * 手机号码注册
     */
    register_phone(data:Object) {
        const res = http.post('/users/register_phone',data);
        console.log(res);
        return res;
    },
    /**
     * 邮箱注册
     */
    seekpwd_email(data:Object) {
        const res = http.post('/users/seekpwd_email',data);
        console.log(res);
        return res;
    },
    /**
     * 手机号码注册
     */
    seekpwd_phone(data:Object) {
        const res = http.post('/users/seekpwd_phone',data);
        console.log(res);
        return res;
    },
    /**
     * 根据用户所在的角色，找出所有的路由
     */
    getRoutesByRole() {
        const res = http.post('/users/getRoutesByRole');
        console.log(res);
        return res;
    },
}


export default api
