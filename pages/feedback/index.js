// pages/feedback/index.js
Page({
    data:{
    tabs: [
        {
            id: 0,
            value:"体验问题",
            isActive:true
        },
        {
            id: 1,
            value:"商品、商家投诉",
            isActive:false
        }
    ],
    //被选中图片的路径 数组
    chooseImgs:[],
    //文本域的内容
    textVal:""
},
//外网的图片路径数组
UpLoadImgs:[],
handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
        tabs
    })
},
//点击“+”选择图片
handleChooseImg(){
//2 调用小程序内置的选址图片pai
wx.chooseImage({
    //同时选中图片数量
    count: 9,
    //图片格式 原图 压缩
    sizeType: ['original','compressed'],
    //图片的来源 相册 照相机
    sourceType: ['album','camera'],
    success: (result)=>{
        this.setData({
            //图片数组 进行拼接
            chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
    }
});
},
//点击 自定义图片组件
handleRemoveImg(e){
    //2 获取被点击的组件的索引
    const {index}=e.currentTarget.dataset;
    //3 获取data中的图片数组
    let {chooseImgs}=this.data;
    //4 删除元素
    chooseImgs.splice(index,1);
    this.setData({
        chooseImgs
    })
},
//文本域的输入事件
handleTextInput(e){
    this.setData({
        textVal:e.detail.value
    })
},
// 提交按钮的点击
handleFormSubmit(){
    //1 获取文本域的内容
    const {textVal,chooseImgs}=this.data;
    //2 合法性的验证
    if(!textVal.trim()){
        //不合法
        wx.showToast({
            title: '输入不合法',
            icon: 'none',
            mask: true
        });
        return;
    }
    //3 准备上传图片 到专门的图片服务器
    //上传文件的api不支持多个文件同时上传 遍历数组 逐个上传
    //显示正在等待的图片
    wx.showLoading({
        title: "正在上传中",
        mask: true,    
    });

    //判断有没有需要上传的图片数组
    if(chooseImgs.length!=0){
    chooseImgs.forEach((v, i)=>{
    wx.uploadFile({
        //上传到哪
        url: 'https://img.coolcr.cn/api/upload',
        //被上传的路径
        filePath: v,
        //上传文件的名称
        name: "image",
        //顺带的文本信息
        formData: {},
        success: (result)=>{
            console.log(result);
            let url=JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            // 所有图片都上传完毕了才触发
            if(i===chooseImgs.length-1){
                wx.hideLoading();
                console.log("000111222");
                //提交成功 充值页面
                this.setData({
                    textVal:"",
                    chooseImgs:[]
                })
                wx.navigateBack({
                    delta:1
                })
            }
                }
            });
        })
    }else{
        wx.hideLoading();
        console.log("只是提交文本");
        wx.navigateBack({
            delta:1
        });
    }
    }
})