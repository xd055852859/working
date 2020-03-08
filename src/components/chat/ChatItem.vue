<template>
  <div @click="handleClick">
    <a-row
      :class="`contact-item ${room.name === currentRoom.name ? 'active' : ''}`"
    >
      <a-col :span="4">
        <div class="contact-img">
          <img :src="room.avatar" alt />
        </div>
      </a-col>
      <a-col :span="16">
        <div class="contact-name">{{ room.name }}</div>
        <div class="contact-msg">
          {{ room.lastMessage ? room.lastMessage.msg : "" }}
        </div>
      </a-col>
      <a-col :span="4">
        <!-- $moment(Date.parse(room.ls)).format("HH:mm") -->
        <div class="contact-time">{{ time }}</div>
        <a-badge v-if="room.unread !== 0" :count="room.unread" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "ContactItem",
  props: {
    room: Object
  },
  computed: {
    ...mapState({
      currentRoom: state => state.auth.currentRoom || {}
    }),
    // 显示时间
    time: function() {
      const date = Date.parse(this.room.ls);
      const nowDate = new Date();
      const diff = this.$moment(nowDate).diff(this.$moment(date), "days");
      if (diff > 1) {
        return this.$moment(date).format("MM-DD");
      } else {
        return this.$moment(date).format("HH:mm");
      }
    }
  },
  methods: {
    ...mapActions("auth", ["selectRoom"]),
    handleClick() {
      this.selectRoom(this.room);
    }
  }
};
</script>

<style scoped>
.contact-item {
  height: 77px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.contact-item.active {
  background-color: #e3edfd;
}
.contact-item:hover {
  cursor: pointer;
}
.contact-item > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contact-item .contact-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
}
.contact-item .contact-img img {
  width: 100%;
}
.contact-item .contact-name {
  font-size: 14px;
  color: #23384b;
}
.contact-item .contact-msg {
  font-size: 13px;
  color: #8091a0;
}
.contact-item .contact-time {
  font-size: 12px;
  color: #8091a0;
}
</style>
