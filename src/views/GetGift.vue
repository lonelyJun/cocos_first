<template>
  <div class="container" @click="()=>{dialogFlag=false}">
    <div id="core">
      <div class="overlay" v-if="dialogFlag || noGiftInfoFlag || sureGiftFlag"></div>
      <div class="dialog" v-if="dialogFlag">
        <div>
          <div>{{dialogText}}</div>
        </div>
      </div>
      <div class="dialog" v-if="noGiftInfoFlag">
        <div>
          <div>未能查到您的中奖信息</div>
        </div>
      </div>

      <div class="dialogSureGift dialog" v-if="sureGiftFlag">
        <div>
          <div class="confirm btn" @click.stop="handleConfirm"></div>
          <div class="cancle btn" @click.stop="sureGiftFlag=false"></div>
        </div>
      </div>
      <div id="bgArea">
        <div id="pricePic"></div>
        <div class="btn" @click.stop="handleGetGift">点击领取</div>
      </div>
    </div>
  </div>
</template>

<script>
import { canGift, getOpenId, receivePrice } from "../service/service";
export default {
  data() {
    return {
      noGiftInfoFlag: false,
      dialogFlag: false,
      sureGiftFlag: false,
      dialogText: "",
      openId: ""
    };
  },

  created() {
    let code = this.getQueryVariable("code");

    let openid = this.getCookie("openid");
    if (openid) {
      this.openId = openid;
      canGift(this.openId).then(res => {
        if (res.data.price != 0) {
          let bg = new Image();
          bg.src = require("./img/gift" + res.data.price + "_light.png");
          bg.onload = () => {
            document.getElementById("pricePic").style.backgroundImage =
              "url(" + bg.src + ")";
          };
        } else {
          this.noGiftInfoFlag = true;
        }
      });
    } else {
      if (code) {
        getOpenId(code).then(res => {
          if (res.data && res.data.openid) {
            this.openId = res.data.openid;
            this.setCookie("openid", res.data.openid);
            canGift(this.openId).then(res => {
              if (res.data.price != 0) {
                let bg = new Image();
                bg.src = require("./img/gift" + res.data.price + "_light.png");
                bg.onload = () => {
                  document.getElementById("pricePic").style.backgroundImage =
                    "url(" + bg.src + ")";
                };
              } else {
                this.noGiftInfoFlag = true;
              }
            });
          } else {
            this.dialogText = "请先关注公众号";
            this.dialogFlag = true;
          }
        });
      }
    }
  },

  mounted() {
    document.addEventListener("click", () => {
      this.dialogFlag = false;
      this.sureGiftFlag = false;
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

    //加载背景图
    let bg = new Image();
    bg.src = require("./img/getGiftBg.png");
    bg.onload = () => {
      document.getElementById("bgArea").style.backgroundImage =
        "url(" + bg.src + ")";
    };
  },

  components: {},

  computed: {},

  methods: {
    handleConfirm() {
      this.sureGiftFlag = false;
      if (this.openId) {
        receivePrice(this.openId).then(res => {
          if (res.data && res.data.message == "success") {
            this.dialogText = "恭喜您已领取奖品";
            this.dialogFlag = true;
          } else if (res.data && res.data.message == "already received") {
            this.dialogText = "您已经领取过了，请不要反复领取";
            this.dialogFlag = true;
          } else {
            this.dialogText = "领取失败，请联系工作人员";
            this.dialogFlag = true;
          }
        });
      } else {
        this.dialogText = "请先关注公众号";
        this.dialogFlag = true;
      }
    },
    handleGetGift() {
      this.sureGiftFlag = true;
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
    display: flex;
    justify-content: center;
    align-items: center;
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
      &.dialogSureGift {
        background-image: url(./img/dialogSureGiftBg.png);
      }
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
          &.btn {
            width: 12.5%;
            padding-bottom: 10%;
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-position: center center;
            bottom: 25%;
            top: auto;
            cursor: pointer;
            height: 0;
            &.confirm {
              background-image: url(./img/confirm.png);
              left: 15%;
            }
            &.cancle {
              background-image: url(./img/cancle.png);
              right: 15%;
              left: auto;
            }
          }
        }
      }
    }
    #bgArea {
      width: 100%;
      height: 0;
      padding-bottom: 125%;
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position: center center;
      #pricePic {
        margin: 0 auto;
        margin-top: 24%;
        width: 50%;
        padding-bottom: 50%;
        height: 0;
        background-repeat: no-repeat;
        background-size: 100% auto;
      }
      .btn {
        display: inline-block;
        margin-top: 3%;
        padding: 10px 15%;
        background-color: #fff;
        border-radius: 20px;
        font-size: 20px;
        font-weight: 600;
        box-shadow: 10px 10px 10px #000;
        cursor: pointer;
      }
    }
  }
}
</style>