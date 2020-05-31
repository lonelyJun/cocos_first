<template>
  <div class="container">
    <div id="core">
      <img src="./img/no_gift.png" alt class="noGift" v-if="noGiftFlag" />
      <img src="./img/gift1.png" alt class="noGift" v-if="gift1Flag" />
      <img src="./img/gift2.png" alt class="noGift" v-if="gift2Flag" />
      <img src="./img/gift3.png" alt class="noGift" v-if="gift3Flag" />
      <img src="./img/gift4.png" alt class="noGift" v-if="gift4Flag" />
      <ul class="giftList">
        <li v-for="(gift,index) in giftList" :key="index" :class="{giftItem:true,active:gift}"></li>
        <li class="btn" @click="handleClick"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      giftList: [false, false, false, false, false, false, false, false],
      intervalEvent: null,
      count: 0,
      curIndex: 0,
      giftIndex: 4,
      noGiftFlag: false,
      gift1Flag: false,
      gift2Flag: false,
      gift3Flag: false,
      gift4Flag: false
    };
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
    handleClick() {
      this.intervalEvent = setInterval(this.gift, 100);
    },
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
              if (this.curIndex == this.giftIndex * 2 - 1) {
                clearInterval(this.intervalEvent);
                setTimeout(() => {
                  if (this.giftIndex == 0) {
                    this.noGiftFlag = true;
                  } else if (this.giftIndex == 1) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift1Flag = true;
                  } else if (this.giftIndex == 2) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift2Flag = true;
                  } else if (this.giftIndex == 3) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift3Flag = true;
                  } else if (this.giftIndex == 4) {
                    // this.intervalEvent = setInterval(this.gift, 500);
                    this.gift4Flag = true;
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
    background-image: url(./img/bg.png);
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