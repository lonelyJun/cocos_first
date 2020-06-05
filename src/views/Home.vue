<template>
  <div class="container" @click="()=>{dialogFlag=false}">
    <div id="core">
      <div class="queryGiftResult" @click.stop="queryGiftResult"></div>
      <div class="dialog" v-if="dialogFlag">
        <div>
          <div>{{dialogText}}</div>
        </div>
      </div>
      <div
        class="overlay"
        v-if=" dialogFlag || noGiftAndNoShareFlag || noGiftFlag || gift1Flag || gift2Flag || gift3Flag ||gift4Flag"
      ></div>
      <img src="./img/no_gift.png" alt class="noGift" v-if="noGiftAndNoShareFlag" />
      <img src="./img/no_gift_but_no_share.png" alt class="noGift" v-if="noGiftFlag" />
      <img src="./img/gift1.png" alt class="noGift" v-if="gift1Flag" />
      <img src="./img/gift2.png" alt class="noGift" v-if="gift2Flag" />
      <img src="./img/gift3.png" alt class="noGift" v-if="gift3Flag" />
      <img src="./img/gift4.png" alt class="noGift" v-if="gift4Flag" />
      <ul class="giftList">
        <li v-for="(gift,index) in giftList" :key="index" :class="{giftItem:true,active:gift}"></li>
        <li class="btn" @click.stop="handleClick"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  canGift,
  whichGift,
  getOpenId,
  getWxConfig,
  shareCb
} from "../service/service";
// import vx from "../utils/vxMixin";
import wx from "weixin-js-sdk";

export default {
  data() {
    return {
      debug: "",
      shareFlag: false, //是否用掉了share
      giftList: [false, false, false, false, false, false, false, false],
      intervalEvent: null,
      count: 0,
      curIndex: 0,
      giftIndex: 0,
      dialogFlag: false,
      dialogText: "",
      noGiftFlag: false,
      noGiftAndNoShareFlag: false,
      gift1Flag: false,
      gift2Flag: false,
      gift3Flag: false,
      gift4Flag: false,
      openId: "",
      outOfArea: false
    };
  },
  // mixins: [vx],
  created() {
    let wxSet = this.wxConfig();
    if (wxSet == false) {
      this.dialogText = "微信设置出错！";
      this.dialogFlag = true;
    }
    //加载背景图
    let bg = new Image();
    bg.src = require("./img/bg.jpg");
    bg.onload = () => {
      document.getElementById("core").style.backgroundImage =
        "url(" + bg.src + ")";
    };

    let code = this.getQueryVariable("code");
    this.debug = this.getQueryVariable("debug");

    if (code) {
      let openid = this.getCookie("openid");
      if (openid) {
        this.openId = openid;
      } else {
        getOpenId(code).then(res => {
          if (res.data && res.data.openid) {
            this.openId = res.data.openid;
            this.setCookie("openid", res.data.openid);
          } else {
            this.dialogText = "请先关注公众号";
            this.dialogFlag = true;
          }
        });
      }
    }

    // console.log(vx);
  },

  mounted() {
    document.addEventListener("click", () => {
      this.noGiftAndNoShareFlag = false;
      this.noGiftFlag = false;
      this.gift1Flag = false;
      this.gift2Flag = false;
      this.gift3Flag = false;
      this.gift4Flag = false;
      this.dialogFlag = false;
    });

    //计算可视宽高
    if (document.body.offsetWidth / document.body.offsetHeight > 1080 / 1920) {
      document.getElementById("core").style.width =
        (1080 / 1920) * document.body.offsetHeight + "px";
      document.getElementById("core").style.height = "100%";
    } else {
      document.getElementById("core").style.width = "100%";
      document.getElementById("core").style.height =
        (document.body.offsetWidth * 1920) / 1080 + "px";
    }
  },

  components: {},

  computed: {},

  methods: {
    //查询中奖结果
    queryGiftResult() {
      canGift(this.openId).then(res => {
        if (res.data) {
          let can_lotto = res.data.can_lotto; //是否可以抽奖
          let share_lotto = res.data.share_lotto; //分享投票用过否
          let price = res.data.price;
          if (can_lotto && !share_lotto) {
            //  可以抽奖且没抽过
            this.dialogText = "您还没有抽奖哦";
            this.dialogFlag = true;
          } else if (price == 1) {
            this.gift1Flag = true;
          } else if (price == 2) {
            this.gift2Flag = true;
          } else if (price == 3) {
            this.gift3Flag = true;
          } else if (price == 4) {
            this.gift4Flag = true;
          } else {
            this.noGiftAndNoShareFlag = true;
          }
        } else {
          this.noGiftAndNoShareFlag = true;
        }
      });
    },
    //设置微信
    async wxConfig() {
      let res = await getWxConfig();
      if (!res.data) {
        return false;
      }
      res.data.debug = false;
      res.data.jsApiList = [
        // "updateTimelineShareData",
        // "updateAppMessageShareData",
        "getLocation",
        "onMenuShareAppMessage",
        "onMenuShareTimeline"
      ];
      await wx.config(res.data);
      wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log("微信验证失败", res);
        return false;
      });
      wx.ready(() => {
        // this.updateAppMessageShareData();
        // this.updateTimelineShareData();
        this.onMenuShareAppMessage();
        this.onMenuShareTimeline();
        this.getLocation();
      });
      wx.checkJsApi({
        jsApiList: [
          // "updateTimelineShareData",
          // "updateAppMessageShareData",
          "getLocation",
          "onMenuShareAppMessage",
          "onMenuShareTimeline"
        ] // 需要检测的JS接口列表，所有JS接口列表见附录2,
        // success: function(res) {
        //   console.log(res, "checkJsApiBack");
        //   // 以键值对的形式返回，可用的api值true，不可用为false
        //   // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        // }
      });
    },

    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
    onMenuShareAppMessage() {
      let _self = this;
      wx.onMenuShareAppMessage({
        // TODO: 以下根据实际情况填写
        title: "震惊！同安区委区政府竟然干了这种事",
        desc: "",
        link: "http://tongan-gov.jihoukeji.vip/",
        // imgUrl一定要是绝对地址，否则可能出问题
        imgUrl: "http://tongan-gov.jihoukeji.vip/share_icon.png",
        success() {
          // 用户确认分享后执行的回调函数
          if (_self.giftIndex == 0) {
            shareCb(_self.openId);
          }
        }
      });
    },

    // // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    onMenuShareTimeline() {
      let _self = this;
      wx.onMenuShareTimeline({
        // TODO: 以下根据实际情况填写
        title: "震惊！同安区委区政府竟然干了这种事",
        desc: "",
        link: "http://tongan-gov.jihoukeji.vip/",
        // imgUrl一定要是绝对地址，否则可能出问题
        imgUrl: "http://tongan-gov.jihoukeji.vip/share_icon.png",
        success() {
          // 用户确认分享后执行的回调函数
          if (_self.giftIndex == 0) {
            shareCb(_self.openId);
          }
        }
      });
    },
    // // // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
    // updateAppMessageShareData() {
    //   wx.updateAppMessageShareData({
    //     // TODO: 以下根据实际情况填写
    //     title: "震惊！同安区委区政府竟然干了这种事",
    //     desc: "",
    //     link: "http://tongan-gov.jihoukeji.vip/",
    //     // imgUrl一定要是绝对地址，否则可能出问题
    //     imgUrl: "http://tongan-gov.jihoukeji.vip/share_icon.png",
    //     success() {
    //       // 用户确认分享后执行的回调函数
    //       this.setTimeout(() => {
    //         this.shareSuccess();
    //         console.log(234);
    //       }, 500);
    //     }
    //   });
    // },

    // // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    // updateTimelineShareData() {
    //   wx.updateTimelineShareData({
    //     // TODO: 以下根据实际情况填写
    //     title: "震惊！同安区委区政府竟然干了这种事",
    //     desc: "",
    //     link: "http://tongan-gov.jihoukeji.vip/",
    //     // imgUrl一定要是绝对地址，否则可能出问题
    //     imgUrl: "http://tongan-gov.jihoukeji.vip/share_icon.png",
    //     success() {
    //       // 用户确认分享后执行的回调函数
    //       this.setTimeout(() => {
    //         this.shareSuccess();
    //         console.log(234);
    //       }, 500);
    //     }
    //   });
    // },

    getLocation() {
      let _self = this;
      wx.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success(res) {
          _self.processLocation(res);
        }
      });
    },

    processLocation(res) {
      let lat = res.latitude ? res.latitude : 0;
      let lon = res.longitude ? res.longitude : 0;
      if (
        (lon >= 117.978612 &&
          lon <= 118.258061 &&
          lat <= 24.912773 &&
          lat >= 24.674489) ||
        this.debug
      ) {
        this.outOfArea = false;
      } else {
        this.outOfArea = true;
      }
    },

    setCookie(name, value) {
      var Days = 60;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie =
        name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //读取cookies
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    handleClick() {
      this.count = 0;
      this.curIndex = 0;
      this.giftIndex = 0;
      this.noGiftFlag = false;
      this.shareFlag = false;
      this.gift1Flag = false;
      this.gift2Flag = false;
      this.gift3Flag = false;
      this.gift4Flag = false;
      if (this.outOfArea) {
        this.dialogText = "本次活动仅限同安区地区哦";
        this.dialogFlag = true;
      } else {
        canGift(this.openId).then(res => {
          if (res.data.can_lotto && res.data.price == 0) {
            this.shareFlag = res.data.shared;
            //没抽过
            this.intervalEvent = setInterval(this.gift, 100);
            whichGift(this.openId).then(res => {
              this.giftIndex = res.data ? res.data.price : 0;
            });
          } else {
            //抽过了
            this.dialogText = "您已经抽过奖了哦";
            this.dialogFlag = true;
          }
        });
      }
    },
    gifted() {},
    gift(cb) {
      this.giftList = this.giftList.map((gift, index) => {
        if (index == this.curIndex) return true;
        else return false;
      });
      if (cb) {
        cb();
      }
      this.curIndex++;

      if (this.curIndex >= this.giftList.length) {
        this.curIndex = 0;
        clearInterval(this.intervalEvent);

        this.count++;
        let speed = 200;
        if (this.count == 1) {
          speed = 200;
        } else if (this.count == 2) {
          speed = 300;
        }
        if (this.count < 3) {
          this.intervalEvent = setInterval(this.gift, speed);
        } else if (this.count == 3) {
          this.intervalEvent = setInterval(() => {
            this.gift(() => {
              if (
                this.curIndex ==
                (this.giftIndex == 0 ? 0 : this.giftIndex * 2 - 1)
              ) {
                clearInterval(this.intervalEvent);
                setTimeout(() => {
                  if (this.giftIndex == 0) {
                    if (this.shareFlag) {
                      this.noGiftAndNoShareFlag = true;
                    } else {
                      this.noGiftFlag = true;
                    }
                  } else if (this.giftIndex == 1) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift1Flag = true;
                    this.gifted();
                  } else if (this.giftIndex == 2) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift2Flag = true;
                    this.gifted();
                  } else if (this.giftIndex == 3) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift3Flag = true;
                    this.gifted();
                  } else if (this.giftIndex == 4) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift4Flag = true;
                    this.gifted();
                  }
                }, 1000);
              }
            });
          }, 800);
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  #core {
    .queryGiftResult {
      width: 40%;
      padding-bottom: 10%;
      background-image: url(./img/queryGiftResultBtn.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% auto;
      z-index: 3;
      top: 2%;
      right: 0;
      position: absolute;
    }
    .overlay {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 6;
    }
    .dialog {
      width: 80%;
      height: 0;
      padding-bottom: 50%;
      background-image: url(./img/dialogBg.png);
      background-repeat: no-repeat;
      background-size: 100% auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      > div {
        position: relative;
        width: 100%;
        padding-bottom: 62.5%;
        > div {
          width: 80%;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 10%;
          font-size: 24px;
        }
      }
    }
    background-color: red;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;

    .noGift {
      width: 80%;
      height: auto;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 8;
    }

    .btn {
      width: 22.5%;
      padding-bottom: 22.5%;
      position: absolute;
      top: 51%;
      left: 39%;
      height: 0;
      background-image: url(./img/btn.png);
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
    .giftItem {
      list-style: none;
      width: 22.5%;
      padding-bottom: 22.5%;

      position: absolute;
      &:nth-of-type(1) {
        top: 38%;
        left: 16%;
        background-image: url(./img/1.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/1_light.png);
        }
      }
      &:nth-of-type(2) {
        background-image: url(./img/2.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        top: 38%;
        left: 39%;
        &.active {
          background-image: url(./img/2_light.png);
        }
      }
      &:nth-of-type(3) {
        top: 38%;
        left: 61%;
        background-image: url(./img/1.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/1_light.png);
        }
      }
      &:nth-of-type(4) {
        top: 51%;
        left: 61%;
        background-image: url(./img/3.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/3_light.png);
        }
      }
      &:nth-of-type(5) {
        top: 63.5%;
        left: 61%;
        background-image: url(./img/1.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/1_light.png);
        }
      }
      &:nth-of-type(6) {
        top: 63.5%;

        left: 39%;
        background-image: url(./img/4.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/4_light.png);
        }
      }
      &:nth-of-type(7) {
        top: 63.5%;
        left: 16%;
        background-image: url(./img/1.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/1_light.png);
        }
      }
      &:nth-of-type(8) {
        top: 51%;
        left: 16%;
        background-image: url(./img/5.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        &.active {
          background-image: url(./img/5_light.png);
        }
      }
    }
  }
}
</style>