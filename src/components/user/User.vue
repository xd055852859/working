<template>
  <router-view></router-view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "User",
  computed: mapState({
    user: state => state.auth.user
  })
};
</script>

<style scoped>
</style>