<template>
  <div class="container" @click="()=>{canGiftFlag=false}">
    <div id="core">
      <div class="dialog" v-if="canGiftFlag">
        <div>
          <div>您已经抽过奖了哦</div>
        </div>
      </div>
      <img src="./img/no_gift.png" alt class="noGift" v-if="noGiftFlag" />
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
import { canGift, whichGift, getOpenId } from "../service/service";
import vx from "../utils/vxMixin";
export default {
  data() {
    return {
      giftList: [false, false, false, false, false, false, false, false],
      intervalEvent: null,
      count: 0,
      curIndex: 0,
      giftIndex: 0,
      noGiftFlag: false,
      gift1Flag: false,
      gift2Flag: false,
      gift3Flag: false,
      gift4Flag: false,
      canGiftFlag: false,
      openId: ""
    };
  },
  mixins: [vx],
  created() {
    //加载背景图
    let bg = new Image();
    bg.src = require("./img/bg.jpg");
    bg.onload = () => {
      document.getElementById("core").style.backgroundImage =
        "url(" + bg.src + ")";
    };

    let code = this.getQueryVariable("code");

    if (code) {
      getOpenId(code).then(res => {
        if (res.data && res.data.openid) {
          this.openId = res.data.openid;
        } else {
          console.log("open ID 有问题");
        }
      });
    }
    // console.log(vx);
    this.wxConfig();
  },

  mounted() {
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
      canGift(this.openId).then(res => {
        if (res.data == 0) {
          //没抽过
          this.intervalEvent = setInterval(this.gift, 100);
          whichGift(this.openId).then(res => {
            this.giftIndex = res.data ? res.data.price : 0;
          });
        } else {
          //抽过了
          this.canGiftFlag = true;
        }
      });
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
                (this.curIndex == this.giftIndex) == 0
                  ? 0
                  : this.giftIndex * 2 - 1
              ) {
                clearInterval(this.intervalEvent);
                setTimeout(() => {
                  if (this.giftIndex == 0) {
                    this.noGiftFlag = true;
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
      z-index: 5;
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