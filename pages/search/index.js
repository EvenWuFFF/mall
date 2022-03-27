import { request } from "../../request/index.js";
Page({
    data: {
        goods:[],
        // 取消按钮是否显示
        isFocus:false,
        isValue:""
    },
    TimeId:-1,
    // 输入框的值改变就会触发
    handleInput(e){
        //1 获取输入框的值
        const {value}=e.detail;
        //2 检测合法性
        if(!value.trim()){
            this.setData({
                goods:[],
                isFocus:false
            })
            //不合法
            return;
        }
        //3 准备发送请求获取数据
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId=setTimeout(() => {
            this.qsearch(value);
        }, 1000);
    },
    // 发送请求
    async qsearch(query){
        const res=await request({url:"/goods/qsearch",data:{query}});
        console.log(res);
        this.setData({
            goods:res
        })
    },
    // 点击取消
    handleCancel(){
        this.setData({
            isValue:"",
            isFocus:false,
            goods:[]
        })
    }
})