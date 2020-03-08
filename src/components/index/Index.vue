<template>
  <div class="index" tabindex="0" ref="index" id="index">
    <Header />
    <div :style="{position:'relative'}" v-if="headerIndex!=0">
      <!-- <Contact
        :class="{contactWapper:true,contactOut:headerIndex!=1&&headerIndex!=6?true:false,contactIn:headerIndex==1||headerIndex==6?true:false}"
      />-->
      <Contact class="contactWapper" v-if="headerIndex==1" />
      <Contact class="contactWapper" v-if="headerIndex==2" />
      <Message class="contactWapper" v-if="headerIndex==3" />
      <Search class="contactWapper" v-if="headerIndex==4" />
    </div>
    <TimeLine class="view" v-if="fullState===0" />
    <!-- <Site class="view" v-if="fullState===1" /> -->
    <!-- <UserHome class="view" v-if="fullState===2" /> -->
    <div class="bootpage-modal" v-if="bootPageState">
      <BootPage />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "../header/Header";
import TimeLine from "../timeline/Timeline";
import Contact from "../contact/Contact";
import Message from "../message/Message";
import Search from "../search/Search";
import Site from "../site/Site";
import UserHome from "../user/UserHome";
import BootPage from "./BootPage";
export default {
  name: "Index",
  data() {
    return {};
  },
  components: {
    Header,
    TimeLine,
    Site,
    UserHome,
    Contact,
    Message,
    Search,
    BootPage
  },
  computed: mapState({
    headerIndex: state => state.common.headerIndex,
    showState: state => state.common.showState,
    fullState: state => state.common.fullState,
    bootPageState: state => state.common.bootPageState,
    deviceState: state => state.common.deviceState
  }),
  beforeMount() {
    if (this.deviceState == "phone") {
      this.$router.push("/phoneTask");
    }
  },
  mounted() {
    if (localStorage.getItem("isFirstCreate")) {
      this.changeBootPageState(true);
    }
    this.$refs.index.focus();
    let that = this;
    document.addEventListener("keyup", function(e) {
      if (e && e.keyCode == 13 && e.target.id == "index") {
        //同时按下Alt+s
        //要做的事情
        that.createNewCard();
      }
      e.stopImmediatePropagation;
    });
    // document.addEventListener = function(e) {
    //   if (e && e.keyCode == 13) {
    //     //同时按下Alt+s
    //     //要做的事情
    //     that.createNewCard();
    //   }
    // };
  },
  methods: {
    ...mapActions("common", ["changeShowState", "changeBootPageState"]),
    ...mapActions("card", [
      "changeCardShowState",
      "changeCardDetailType",
      "setCardType",
      "setCardContent",
      "setCardKey",
      "setCardDetail"
    ]),
    createNewCard() {
      this.changeCardShowState(true);
      this.changeCardDetailType(0);
      this.setCardType(2);
      this.setCardContent("");
      this.setCardKey(0);
      this.setCardDetail({});
    }
  }
};
</script>

<style scoped>
.index {
  width: 100%;
  display: flex;
  position: relative;
}
.view {
  flex: 1;
  overflow: auto;
}
.contactWapper {
  width: 300px;
  height: 100%;
  border-right: 1px solid #d5d5d5;
  background-color: #fff;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 4;
}
.bootpage-modal {
  position: absolute;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>