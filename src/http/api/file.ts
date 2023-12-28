import http from '../axios.ts'


const api = {
    /**
     * 上传的微信支付的pem的文件，只能保存到本地
     * @param params  $toEmail：收件箱地址，$type：login、register、seekpwd、updatePwd
     */
    uploadPem(params:Object) {
        const res = http.post('/file/uploadPem', params);
        return res;
    },

}

export default api
