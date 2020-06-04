import Vue from "vue";

let fix =
  process.env.NODE_ENV === "production" ?
  "http://tongan-gov.jihoukeji.vip/" :
  "/";

export const canGift = (openid) => {
  return Vue.axios.get(fix + "api/get_game_record?openid=" + openid);
};

export const whichGift = (openid) => {
  return Vue.axios.get(fix + "api/lotto?openid=" + openid);
};

export const getOpenId = (code) => {
  return Vue.axios.get(fix + "api/auth_cb?code=" + code);
};

export const getWxConfig = () => {
  return Vue.axios.get(fix + "api/get_config?location=" + encodeURIComponent(window.location.href));
};

export const shareCb = (openid) => {
  return Vue.axios.get(fix + "api/share_cb?openid=" + openid);
}