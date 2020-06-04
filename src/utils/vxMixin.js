// import {
//   getWxConfig
// } from "../service/service"
// export default {
//   methods: {
//     async wxConfig() {
//       let res = await getWxConfig();
//       // const {
//       //   appId,
//       //   timestamp,
//       //   nonceStr,
//       //   signature
//       // } = res.data;
//       // 需要检测的JS接口列表，所有JS接口列表见附录2,
//       res.data.debug = false;
//       res.data.jsApiList = ["updateTimelineShareData", "updateAppMessageShareData", "getLocation"];
//       await wx.config(
//         res.data
//         //   {
//         //   // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         //   // debug: true,

//         //   // 必填，公众号的唯一标识
//         //   appId,

//         //   // 必填，生成签名的时间戳
//         //   timestamp,

//         //   // 必填，生成签名的随机串
//         //   nonceStr,

//         //   // 必填，签名
//         //   signature,

//         //   // 必填，需要使用的JS接口列表
//         //   jsApiList: ["updateTimelineShareData", "updateAppMessageShareData"]
//         // }
//       )


//       wx.error(function (res) {
//         // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
//         console.log("微信验证失败", res)
//       })
//       wx.ready(() => {
//         this.updateAppMessageShareData()
//         this.updateTimelineShareData()
//       })

//       wx.checkJsApi({
//         jsApiList: ["updateTimelineShareData", "updateAppMessageShareData", "getLocation"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
//         success: function (res) {
//           console.log(res, 'checkJsApiBack')
//           // 以键值对的形式返回，可用的api值true，不可用为false
//           // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
//         }
//       })
//     },

//     // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
//     updateAppMessageShareData(cb) {
//       wx.updateAppMessageShareData({
//         // TODO: 以下根据实际情况填写
//         title: "震惊！同安区委区政府竟然干了这种事",
//         desc: "",
//         link: "http://tongan-gov.jihoukeji.vip/",
//         // imgUrl一定要是绝对地址，否则可能出问题
//         imgUrl: "http://tongan-gov.jihoukeji.vip/wxHeadImg.png",

//         success() {
//           // 用户确认分享后执行的回调函数
//           console.log('updateAppMessageShareData success')

//           cb();
//         },
//         fail(error) {
//           console.log(error, 123);
//         }
//       });
//     },

//     // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
//     updateTimelineShareData(cb) {
//       wx.updateTimelineShareData({
//         // TODO: 以下根据实际情况填写
//         title: "震惊！同安区委区政府竟然干了这种事",
//         desc: "",
//         link: "http://tongan-gov.jihoukeji.vip/",
//         // imgUrl一定要是绝对地址，否则可能出问题
//         imgUrl: "http://tongan-gov.jihoukeji.vip/wxHeadImg.png",
//         success() {
//           // 用户确认分享后执行的回调函数
//           console.log('updateTimelineShareData success')
//           cb();
//         },
//         fail(error) {
//           console.log(error, 123);
//         }
//       })
//     },

//     getLocation(cb) {
//       wx.getLocation({
//         type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
//         success(res) {
//           console.log(res, 'getLocation');
//           cb(res);
//         },
//         fail(error) {
//           console.log(error, 123);
//         }
//       });
//     }
//   }
// }