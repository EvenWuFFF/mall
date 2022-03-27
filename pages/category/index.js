import { request } from "../../request/index.js";
Page({
    data: {
        //左侧的菜单数据
        leftMenuList:[],
        //右侧的商品数据
        reghtContent:[],
        // 被点击的左侧菜单
        currentIndex:0,
        //右侧内容的滚动条距离顶部的距离
        scrollTop:0
    },
    //接口的返回数据
    Cates:[],

    onLoad: function (options) {
        /*
        0 web中的本地存储和小程序的本地存储的区别
            1 写代码的方式不一样
                web:localStorage.setItem("key","value") localStorage.getItem("key")
            小程序中：wx.setStorageSync("key","value");wx.getStorageSync('key');
            2:存的时候 有没有做类型转换
                web:不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
                小程序:不存在类型转换这个操作 存什么类型的数据进去 获取的时候就是什么类型的数据
        1 先判断一下本地存储中有没有旧的数据
        2 没有旧数据 直接发送新请求
        3 有旧数据 同时 旧数据也没有过期 就使用 本地存储中的旧数据即可
        */

        //1 获取本地存储中的数据 （小程序也存在本地存储技术）
        const Cates = wx.getStorageSync("cates");
        // 2 判断
        if(!Cates){
            //不存在 发送请求获取数据
            this.getCates();
        }else{
            //有旧的数据 定义过期时间 10s 改成5min
            if(Date.now()-Cates.time>1000*10){
                //重新发送请求
                this,getCates();
            }else{
                this.Cates=Cates.data;
                let leftMenuList=this.Cates.map(v=>v.cat_name);
                let rightContent=this.Cates[0].children;
                this.setData({
                leftMenuList,
                rightContent
            })

            }

        }

    
    },
    // 获取分类的数据
   async getCates(){
        // request({
        //     url: "/categories"
        // })
        // .then(res=>{
        //     this.Cates=res.data.message;

        //     // 把接口的数据 存入本地存储中
        //     wx.getStorageSync("cates",{time:Date.now(),data:this.Cates});

        //     //构造左侧的大菜单数据
        //     let leftMenuList=this.Cates.map(v=>v.cat_name);
        //     //构造右边的商品数据
        //     let rightContent=this.Cates[0].children;
        //     this.setData({
        //         leftMenuList,
        //         rightContent
        //     })
        // })

        // 1 使用es7的async awit来发送请求
        const res=await request({url:"/categories"});
        this.Cates=res;
        // 把接口的数据 存入本地存储中
        wx.getStorageSync("cates",{time:Date.now(),data:this.Cates});
        //构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //构造右边的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    // 左侧菜单的点击事件
    handleItemTap(e){
        /*
        1 获取被点击的标题身上的索引
        2 给data中的currentIndex赋值就可以了
        3 根据不同的索引渲染右侧的商品内容
        */

        const{index}=e.currentTarget.dataset;
        
        let rightContent=this.Cates[index].children;
         //重新设置 右侧内容的scroll-view标签距离顶部的距离
        this.setData({
            currentIndex:index,
            rightContent,
            scrollTop:0
        })

    }

})