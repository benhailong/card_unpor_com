import http from '../axios.ts'


const api = {
    /**
     * 发送邮箱验证码
     * @param params  $toEmail：收件箱地址，$type：login、register、seekpwd、updatePwd
     */
    send(params:Object) {
        const res = http.post('/email/send', params);
        return res;
    }
}

export default api
