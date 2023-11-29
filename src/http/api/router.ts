import http from '../axios.ts'


const api = {
    /**
     * 查询所有的路由列表
     */
    getAllRouter(params:Object) {
        const res = http.post('/router/getAllRouter',params);
        return res;
    },
    /**
     * 添加路由
     * @param routerName 路由名称
     * @param routerUrl 路由地址
     * @param routerType 路由类型
     * @param routerIcon 路由图标
     * @param routerSort 路由排序
     * @param routerStatus 路由状态
     */
    addRouter(params:Object) {
        const res = http.post('/router/addRouter',params);
        return res;
    },

    /**
     * 删除路由
     * @param id 主键
     */
    delete(params:Object) {
        const res = http.post('/router/delete',params);
        return res;
    },


    /**
     * 编辑路由
     * @param id 主键
     */
    getInfoById(params:Object) {
        const res = http.post('/router/getInfoById',params);
        return res;
    },

    /**
     * 更具ID修改路由详情
     * @param id 主键
     */
    update(params:Object) {
        const res = http.post('/router/update',params);
        return res;
    }
}

export default api
