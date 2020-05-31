import Vue from 'vue'

let fix = process.env.NODE_ENV === "production" ? "http://tongan-gov.jihoukeji.vip:3000/" : "/"


export const canGift = (openid) => {
  return Vue.axios.get(fix + 'api/get_game_record?openid=' + openid);
}

export const whichGift = (openid) => {
  return Vue.axios.get(fix + 'api/lotto?openid=' + openid);
}

export const getOpenId = (code) => {
  return Vue.axios.get(fix + 'api/auth_cb?code=' + code);
}