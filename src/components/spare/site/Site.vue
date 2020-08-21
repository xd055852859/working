<template>
  <div class="site">
    <Header/>
    <!-- <iframe src="https://baoku.qingtime.cn/sgkj" width="100%" height="100%"></iframe> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "../header/Header";
export default {
  name: "Site",
  components: {
    Header,
  },
  computed: mapState({
    user: state => state.auth.user
  })
};
</script>

<style scoped>
.site {
  overflow: hidden;
}
.site > iframe {
  border: unset;
}
</style>