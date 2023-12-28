import http from '../axios.ts'


const api = {
    /**
     * 根据前缀查询配置信息
     * @param params  $toEmail：收件箱地址，$type：login、register、seekpwd、updatePwd
     */
    getInfoByKey(params:Object) {
        const res = http.post('/config/getInfoByKey', params);
        return res;
    },

    /**
     * 保存或者修改
     * @param params
     */
    save(params:Object) {
        const res = http.post('/config/save', params);
        return res;
    }
}

export default api
