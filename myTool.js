//工具包
//继承   圣杯模式
var inherit = (function () {
    function F() { }
    return function (Target, Origin) {
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constructor = Target;
        Target.prototype.uber = Origin.prototype;//可以查询被克隆的引用
    }
}());
//深度克隆
function deepClone(origin, target) { //克隆
    var target = target || {};
    var isArr = "[object Array]";
    var toStr = Object.prototype.toString;
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {//判断元素是否是自身而非原型链上
            if (typeof (origin[prop]) == "object" && origin[prop] !== "null") {
                target[prop] = toStr.call(origin[prop]) === isArr ? [] : {};
                deepClone(origin[prop], target[prop]);
            } else {
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}
//事件绑定
function addEvent(elem, type, handler) {

    if (elem.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else if (elem.attachEvent) {

        elem['' + type + handler] = handler;
        elem[type + handler] = function () {
            elem['' + type + handler].call(elem);//改变this指向  是绑定的函数的this只想DOM
        };
        elem.attachEvent('on' + type, elem[type + handler]);

    } else {
        elem['on' + type] = handler;
    }
}
//异步加载     callback为一个字符串形式的属性名   和被加载的js文件内的obj = {name:function(){}} 配合执行
function asyncLoaded(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (script.readyState) {//IE  script没有onload  但是有readyState   onreadystatechange
        script.onreadystatechange = function () {
            if (script.readyState == "complete" || script.readyState == "loaded") {
                if(typeof(callback) == "function"){
                    callback()
                }else{
                    obj[callback]();
                }
                script.onreadystatechange = null;
            }
        }
    } else {//chrome safari firefox 
        script.onload = function () {
            if(typeof(callback) == "function"){
                callback()
            }else{
                obj[callback]();
            }
        }
    }
    script.src = url;
    document.head.appendChild(script);
}
//数组去重   利用对象属性名来 区分是否重复
Object.prototype.duplicateRemoval = (function(){
    var obj = {};
    var arr = [];
    var len = this.length;
    for(var i = 0; i < len; i++){
        if(obj[this[i]] == undefined){
            arr.push(this[i]);
            obj[this[i]] = "aa";
        }
    }
    return arr;
});
// function ajaxFn(method,url,data,callback,boolean){
//     var xhr = null;
//     if(window.XMLHttpRequest){
//         xhr = new XMLHttpRequest();
//     }else{
//         xhr = new ActiveXObject("Microsoft.XMLHttp");
//     }
//     if(method.toUpperCase() == "GET"){
//         xhr.open(method,url+"?"+data,boolean);
//         xhr.send()
//     }else if(method.toUpperCase() == "POST"){
//         xhr.open(method,url,boolean);
//         xhr.setReuestHeader("Content-type","application/x-www-form-urlencoded");
//         xhr.send(data);
//     }
//     xhr.onreadystatechange = function(){
//         if(xhr == 4){
//             if(xhr.status ==200){
//                 callback(xhr.responseText);
//             }
//         }
//     }
// }
