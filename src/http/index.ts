import users from './api/users.ts'
import email from './api/email.ts'
import sms from './api/sms.ts'
import captcha from './api/captcha.ts'
import router from './api/router.ts'
import port from './api/port.ts'
import role from './api/role.ts'

import axios from 'axios'

const api = {
    users,
    email,
    sms,
    captcha,
    router,
    port,
    role
}
export default {
    install(app:any) {
        app.config.globalProperties.$http = api
        app.config.globalProperties.axios = axios
    }
}
