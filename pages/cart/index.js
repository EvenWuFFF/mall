import { getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
Page({
    data:{
        address:{},
        cart:[],
        allChecked:false,
        totalPrice:0,
        totalNum:0
    },
    onShow(){
        //1
        const address=wx.getStorageSync("address");
        const cart=wx.getStorageSync("cart") || [];
        // const allChecked=cart.length?cart.every(v=>v.checked):false;
        this.setData({address});
        this.setCart(cart);
    },
    async handleChooseAddress(){
        try{
            //1
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            //2
            if(scopeAddress === false) {
                await openSetting();
            }
            //4
            let address = await chooseAddress();
            address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
            //5
            wx.setStorageSync("address",address); 
        }catch(error) {
            console.log(error);
        }
    },
    // 商品的选中
    handleItemChange(e){
        const goods_id=e.currentTarget.dataset.id;
        let {cart}=this.data;
        let index=cart.findIndex(v=>v.goods_id===goods_id);
        cart[index].checked=!cart[index].checked;
        // this.setData({
        //     cart
        // });
        // wx.setStorageSync("cart",cart);
        // let allChecked=true;
        // let totalPrice=0;
        // let totalNum=0;
        // cart.forEach(v=>{
        //     if(v.checked){
        //         totalPrice+=v.num*v.goods_price;
        //         totalNum+=v.num;
        //     }else{
        //         allChecked=false;
        //     }
        // })
        // allChecked=cart.length!=0?allChecked:false;
        // this.setData({
        //     cart,totalNum,allChecked
        // });
        this.setCart(cart);
    },
        setCart(cart){
            let allChecked=true;
            let totalPrice=0;
            let totalNum=0;
            cart.forEach(v=>{
                if(v.checked){
                    totalPrice+=v.num*v.goods_price;
                    totalNum+=v.num;
                }else{
                    allChecked=false;
                }
            })
            allChecked=cart.length!=0?allChecked:false;
            this.setData({
                cart,
                totalPrice,totalNum,allChecked
            });
            wx.setStorageSync("cart",cart);
        },

        //商品全选
        handleItemAllCheck(){
            let {cart,allChecked}=this.data;
            allChecked=!allChecked;
            cart.forEach(v=>v.checked=allChecked);
            this.setCart(cart);
        },
        // 商品数量编辑
        async handleItemNumEdit(e){
            const {operation,id}=e.currentTarget.dataset;
            let {cart}=this.data;
            const index=cart.findIndex(v=>v.goods_id===id);
            if(cart[index].num===1&&operation===-1){               
                  const res=await showModal({content:"您是否要删除？"});
                  if (res.confirm) {
                    cart.splice(index,1);
                    this.setCart(cart);
                  }
            }else{
                cart[index].num+=operation;
                this.setCart(cart);
            }
        },
        // 点击结算
        async handlePay(){
            const {address,totalNum}=this.data;
            if(!address.userName){
                await showToast({title:"您还没有选择收货地址"});
                return;
            }
            if(totalNum===0){
                await showToast({title:"您还没有选购商品"});
                return;
            }
            wx.navigateTo({
                url:'/pages/pay/index'
            });
        }
    })


/*
1 获取用户的收货地址
    1 绑定点击事件
    2 调用小程序内置api 获取用户的收货地址

*/



// import { getSetting,chooseAddress,openSetting,showModal} from "../../utils/asyncWx.js";
// Page({
//     data:{
//         address:{},
//         cart:[],
//         allChecked:false,
//         totalPrice: 0,
//         totalNum: 0
//     },
//     onShow(){
//     const address=wx.getStorageSync("address");
//     const cart=wx.getStorageSync("cart")||[];  
    
//     this.setData({address});
//     this.setCart(cart);
//     },
    
//         // 点击 收货地址
//     async handleChooseAddress(){
//         try {
//         // // 1 获取收货地址
//         // wx.getSetting({
//         //     success: (result) => {
//         //         // 2 获取权限状态 主要发现一些 属性名
//         //         const scopeAddress = result.authSetting["scope.address"];
//         //         if(scopeAddress === true || scopeAddress === undefined){
//         //             wx.chooseAddress({
//         //                 success: (result1) => {
//         //                     console.log(result1);
//         //                 }
//         //             });
//         //         }else{
//         //             // 3 用户 以前拒绝过授予权限 
//         //             wx.openSetting({
//         //                 success: (result3) =>{
//         //                      // 4 可以调用 收货地址代码
//         //                      wx.chooseAddress({
//         //                          success: (result3) => {
//         //                              console.log(result3);
//         //                          }
//         //                      });
//         //                 }
//         //             });
//         //         }
//         //     },
//         //     fail: () => { },
//         //     complete: () => { }
//         // });
       
//         // 1 获取 权限状态
//         const res1 = await getSetting();
//         const scopeAddress = res1.authSetting["scope.address"];
//         // 2 判断 权限状态
//         if(scopeAddress === false){        
//             await openSetting();
//         }
//         // 4 调用获取收货地址 的api
//         const address=await chooseAddress();
//         // 5 存入到缓存
//         wx.getStorageSync("address",address)
//     } catch (error) {
//         console.log(error);
//     }
//     },
//     // 商品的选中
//     async handleItemChange(e){
//         //1 获取被修改的商品id
//         const goods_id=e.currentTarget.dataset.id;
//         //2 获取购物车数组
//         let {cart}=this.data;
//         //3 找到被修改的商品对象
//         let index=cart.findIndex(v=>v.goods_id===goods_id);
//         //4 选中状态选反
//         cart[index].checked=!cart[index].checked;

//         this.setCart(cart);
//     },
//     setCart(cart){
//     let allChecked = true;
//     let totalPrice=0;
//     let totalNum=0;
//     cart.forEach(v => {
//         if(v.checked){
//             totalPrice += v.num * v.goods_price;
//             totalNum += v.num;
//         }else{
//             allChecked=false;
//         }
//     })
//     allChecked=cart.length != 0 ? allChecked : false;
//     this.setData({
//         cart,
//         totalPrice,
//         totalNum,
//         allChecked
//     });
//     wx.setStorageSync("cart",cart);
//     },
//     handleItemAllCheck(){
//         let {cart,allChecked}=this.data;
//         allChecked=!allChecked;
//         cart.forEach(v=>v.checked=allChecked);
//         this.setCart(cart);
//     },
//     async handleItemNumEdit(e){     
//         const {operation,id}=e.currentTarget.dataset;
//         let {cart}=this.data;
//         const index=cart.findIndex(v=>v.goods_id===id);
//         if(cart[index].num===1&&operation===-1){
//               const res=await showModal({content:"您是否要删除"});
//               if (res.confirm) {
//                 cart.splice(index,1);
//                 this.setCart(cart);
//               } 
//         }else{
//             cart[index].num+=operation;
//             this.setCart(cart);
//         }       
//     }
// })