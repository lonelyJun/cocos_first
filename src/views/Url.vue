<!--  -->
<template>
  <div></div>
</template>

<script>
export default {
  created() {
    const oauth2_url =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6d4c967a36137d82" +
      "&redirect_uri=" +
      encodeURI("http://localhost:8080/#/home") +
      "&response_type=code&scope=snsapi_userinfo&state=oauth_approved#wechat_redirect";
    window.location.href = oauth2_url;
  },

  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='scss' scoped>
</style>