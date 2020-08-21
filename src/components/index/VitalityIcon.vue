<template>
  <div>
    <div v-if="!vitalityState" class="vitality-info">
      <div class="vitality-img" :style="{width:'20px',height:'17px'}" v-if="countArr[0]>0">
        <img :src="crownPng" />
      </div>
      <div class="vitality-title" v-if="countArr[0]>0">{{countArr[0]}}</div>
      <div class="vitality-img" :style="{width:'19px',height:'19px'}" v-if="countArr[1]>0">
        <img :src="sunPng" />
      </div>
      <div class="vitality-title" v-if="countArr[1]>0">{{countArr[1]}}</div>
      <div class="vitality-img" :style="{width:'16px',height:'16px'}" v-if="countArr[2]>0">
        <img :src="moonPng" />
      </div>
      <div class="vitality-title" v-if="countArr[2]>0">{{countArr[2]}}</div>
      <div class="vitality-img" :style="{width:'16px',height:'16px'}" v-if="countArr[3]>0">
        <img :src="starPng" />
      </div>
      <div class="vitality-title" v-if="countArr[3]>0">{{countArr[3]}}</div>
    </div>
    <div v-if="vitalityState" class="vitality-info">
      <div v-if="countArr[0]>0" :style="{display:'flex'}">
        <div v-for="(item,index) in countArr[0]" :key="'crown'+index">
          <div class="vitality-img" :style="{width:'20px',height:'17px'}" v-if="countArr[0]>0">
            <img :src="crownPng" />
          </div>
        </div>
      </div>
      <div v-if="countArr[1]>0" :style="{display:'flex'}">
        <div v-for="(item,index) in countArr[1]" :key="'sun'+index">
          <div class="vitality-img" :style="{width:'19px',height:'19px'}" v-if="countArr[1]>0">
            <img :src="sunPng" />
          </div>
        </div>
      </div>
      <div v-if="countArr[2]>0" :style="{display:'flex'}">
        <div v-for="(item,index) in countArr[2]" :key="'moon'+index">
          <div class="vitality-img" :style="{width:'16px',height:'16px'}" v-if="countArr[2]>0">
            <img :src="moonPng" />
          </div>
        </div>
      </div>
      <div v-if="countArr[3]>0" :style="{display:'flex'}">
        <div v-for="(item,index) in countArr[3]" :key="'star'+index">
          <div class="vitality-img" :style="{width:'16px',height:'16px'}">
            <img :src="starPng" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crownPng from "@/assets/crown.png";
import sunPng from "@/assets/sun.png";
import moonPng from "@/assets/moon.png";
import starPng from "@/assets/star.png";
export default {
  // 1星星=10
  // 1月亮=100
  // 1太阳=1000
  // 1皇冠=10000
  name: "VitalityIcon",
  props: ["vitalityNum", "vitalityState"],
  data() {
    return {
      crownPng: crownPng,
      sunPng: sunPng,
      moonPng: moonPng,
      starPng: starPng,
    };
  },
  computed: {
    countArr() {
      let crown = parseInt(this.vitalityNum / 10000);
      let sun = parseInt((this.vitalityNum - crown * 10000) / 1000);
      let moon = parseInt(
        (this.vitalityNum - crown * 10000 - sun * 1000) / 100
      );
      let star = parseInt(
        (this.vitalityNum - crown * 10000 - sun * 1000 - moon * 100) / 10
      );
      return [crown, sun, moon, star];
    },
  },
};
</script>

<style lang="scss" scoped>
.vitality-info {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.vitality-img img {
  width: 100%;
  height: 100%;
}
.vitality-title {
  color: #86b93f;
  font-size: 9px;
  margin: 5px 2.5px 0px 1.5px;
  display: flex;
  align-items: flex-end;
}
</style>