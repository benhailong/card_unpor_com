const upTools:{} = {};

/**
 * 跳转到新地址
 * @param path
 */
upTools.goPathNewTab = ( path: string ):void => {
    window.open(upTools.check(path,"url")? path : "/#"+path, '_blank');
}

/**
 * 当前页路由跳转
 * @param path
 */
upTools.goPath = (path: string):void=> {
    window.location.href = upTools.check(path,"url")? path : "/#"+path;
}


upTools.check =  (e: string, type:string):boolean => {
    var str:string=e;
    var Expression:string = ""
    if(type=="url"){
        Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    }else if(type=="email"){
        Expression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    }else if(type=="phone"){
        Expression = /^1[3-9]\d{9}$/;
    }else if(type=="password"){
        // 密码正则
        Expression = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    }
    var objExp=new RegExp(Expression);
    if(objExp.test(str)==true){
        return true;
    }else{
        return false;
    }
}


export default upTools;