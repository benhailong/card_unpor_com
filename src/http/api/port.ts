import http from '../axios.ts'


const api = {
    /**
     * 查询所有的接口列表
     */
    getAll(params:Object) {
        const res = http.post('/port/getAll',params);
        return res;
    },
    /**
     * 添加接口
     */
    add(params:Object) {
        const res = http.post('/port/add',params);
        return res;
    },

    /**
     * 删除接口
     * @param id 主键
     */
    delete(params:Object) {
        const res = http.post('/port/delete',params);
        return res;
    },


    /**
     * 编辑接口
     * @param id 主键
     */
    getInfoById(params:Object) {
        const res = http.post('/port/getInfoById',params);
        return res;
    },

    /**
     * 更具ID修改接口详情
     * @param id 主键
     */
    update(params:Object) {
        const res = http.post('/port/update',params);
        return res;
    },

    /**
     * 查询所有需要授权才能访问的接口列表,并更具路由id进行分组
     * @param id 主键
     */
    getAllNeedAuthAndGroupByRouterId() {
        const res = http.post('/port/getAllNeedAuthAndGroupByRouterId');
        return res;
    }
}

export default api
