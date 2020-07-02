import Vue from "vue";

let fix =

  process.env.NODE_ENV === "production" ?
  "http://tongan-gov.jjymw.com/" :
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
  return Vue.axios.get(
    fix + "api/get_config?location=" + encodeURIComponent(window.location.href)
  );
};

export const shareCb = (openid) => {
  return Vue.axios.get(fix + "api/share_cb?openid=" + openid);
}

export const isOnline = () => {
  return Vue.axios.get(fix + "api/is_online");
}

export const receivePrice = (openid) => {
  return Vue.axios.get(fix + "api/receive_price?openid=" + openid)
}