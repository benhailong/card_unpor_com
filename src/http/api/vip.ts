import http from '../axios.ts'
import {sha256} from "js-sha256";

/**
 * 会员等级
 */

const api = {

    /**
     * 分页查询用户列表
     */
    getAllByPage(data:Object) {
        const res = http.post('/vip/getAllByPage',data);
        console.log(res);
        return res;
    },

    /**
     * 新增
     */
    add(data:Object) {
        const res = http.post('/vip/add',data);
        console.log(res);
        return res;
    },

    /**
     * 根据ID查询详情
     */
    getInfoById(data:Object) {
        const res = http.post('/vip/getInfoById',data);
        console.log(res);
        return res;
    },

    /**
     * 删除
     */
    delete(data:Object) {
        const res = http.post('/vip/delete',data);
        console.log(res);
        return res;
    },

    /**
     * 修改
     */
    update(data:Object) {
        const res = http.post('/vip/update',data);
        console.log(res);
        return res;
    },

    /**
     * 查询会员等级
     */
    getAllVipByAllType() {
        const res = http.post('/vip/getAllVipByAllType');
        console.log(res);
        return res;
    },
}


export default api
