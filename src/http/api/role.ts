import http from '../axios.ts'


const api = {
    /**
     * 查询所有的接口列表
     */
    getAll(params:Object) {
        const res = http.post('/role/getAll',params);
        return res;
    },
    /**
     * 添加接口
     */
    add(params:Object) {
        const res = http.post('/role/add',params);
        return res;
    },

    /**
     * 删除接口
     * @param id 主键
     */
    delete(params:Object) {
        const res = http.post('/role/delete',params);
        return res;
    },


    /**
     * 编辑接口
     * @param id 主键
     */
    getInfoById(params:Object) {
        const res = http.post('/role/getInfoById',params);
        return res;
    },

    /**
     * 更具ID修改接口详情
     * @param id 主键
     */
    update(params:Object) {
        const res = http.post('/role/update',params);
        return res;
    },

    /**
     * 角色-根据角色ID查已授权路由
     * @param id 主键
     */
    getRouterByRoleId(params:Object) {
        const res = http.post('/role/getRouterByRoleId',params);
        return res;
    },

    /**
     * 角色-根据角色ID  修改  授权路由
     * @param id 主键
     */
    saveRouterByRoleId(params:Object) {
        const res = http.post('/role/saveRouterByRoleId',params);
        return res;
    },

    /**
     * 角色-根据角色ID查已授权路由
     * @param id 主键
     */
    getPortByRoleId(params:Object) {
        const res = http.post('/role/getPortByRoleId',params);
        return res;
    },

    /**
     * 角色-根据角色ID  修改  授权路由
     * @param id 主键
     */
    savePortByRoleId(params:Object) {
        const res = http.post('/role/savePortByRoleId',params);
        return res;
    },
    /**
     * 查询所有的角色列表-不分页
     * @param id 主键
     */
    getAllNoPage() {
        const res = http.post('/role/getAllNoPage');
        return res;
    }
}

export default api
