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

    /**
     * 分页查询用户列表
     */
    getAllByPage(data:Object) {
        const res = http.post('/users/getAllByPage',data);
        console.log(res);
        return res;
    },

    /**
     * 开通VIP权限的 提交方法
     */
    setVip(data:Object) {
        const res = http.post('/users/setVip',data);
        console.log(res);
        return res;
    },

    /**
     * 查询用户的所有权限
     */
    getVipByUserId(data:Object) {
        const res = http.post('/users/getVipByUserId',data);
        console.log(res);
        return res;
    },

    /**
     * 修改用户状态
     */
    setStatus(data:Object) {
        const res = http.post('/users/setStatus',data);
        console.log(res);
        return res;
    },

    /**
     * 更具ID获取用户基本信息
     */
    getInfoById(data:Object) {
        const res = http.post('/users/getInfoById',data);
        console.log(res);
        return res;
    }
}


export default api
