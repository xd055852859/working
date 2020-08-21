<template>
  <div class="taskView-filter">
    <a-dropdown :trigger="['click']" :style="{width:'280px'}" v-if="groupType!=3">
      <div
        class="filter-item filter-title"
        @mouseenter="chooseFilterIndex=1"
        @mouseleave="chooseFilterIndex=null"
      >
        <div :style="{display:'flex',alignItems: 'center'}">
          <div class="filter-avatar" v-if="groupIndex!=0&&groupArr[groupIndex].logo">
            <img :src="groupArr[groupIndex].logo|defaultGroup" alt />
          </div>
          <div class="filter-name">{{groupArr[groupIndex].name}}</div>
        </div>
        <div>
          <a-icon type="down" :style="{marginRight:'5px'}" />
          <a-icon
            type="close-circle"
            v-if="groupIndex!=0&&chooseFilterIndex==1"
            @click.stop="changeFilter('groupKey',null,0)"
          />
        </div>
      </div>
      <a-menu slot="overlay">
        <a-menu-item
          :key="index"
          v-for="(item,index) in groupArr"
          @click="changeFilter('groupKey',item.key,index)"
          :style="{paddingTop:'0px',paddingBottom:'0px'}"
        >
          <div class="filter-item">
            <a-radio :checked="index==groupIndex" />
            <div class="filter-avatar" v-if="index!=0">
              <img :src="item.logo|defaultGroup" alt />
            </div>
            {{item.name}}
          </div>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown :trigger="['click']" :style="{width:'280px'}">
      <div
        class="filter-item filter-title"
        @mouseenter="chooseFilterIndex=2"
        @mouseleave="chooseFilterIndex=null"
      >
        <div :style="{display:'flex',alignItems: 'center'}">
          <div class="filter-avatar" v-if="executorIndex!=0&&executorArr[executorIndex].avatar">
            <img :src="executorArr[executorIndex].avatar" alt />
          </div>
          <div class="filter-name">执行人: {{executorArr[executorIndex].name}}</div>
        </div>
        <div :style="{display:'flex',alignItems:'center'}">
          <a-icon type="down" :style="{marginRight:'5px'}" />
          <div
            class="filter-avatar"
            v-if="executorFindIndex!=-1&&executorIndex==0"
            :style="{marginRight:'5px'}"
            @click="changeDefault('executor')"
          >
            <img :src="user.profile|defaultPerson" alt />
          </div>
          <a-icon
            type="close-circle"
            v-if="executorIndex!=0&&chooseFilterIndex==2"
            @click.stop="changeFilter('executorKey',null,0)"
          />
        </div>
      </div>
      <a-menu slot="overlay">
        <a-menu-item
          :key="index"
          v-for="(item,index) in executorArr"
          @click="changeFilter('executorKey',item.key,index)"
        >
          <div class="filter-item">
            <a-radio :checked="index==executorIndex" />
            <div class="filter-avatar" v-if="item.avatar">
              <img :src="item.avatar" alt />
            </div>
            {{item.name}}
          </div>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown :trigger="['click']" :style="{width:'280px'}">
      <div
        class="filter-item filter-title"
        @mouseenter="chooseFilterIndex=3"
        @mouseleave="chooseFilterIndex=null"
      >
        <div :style="{display:'flex',alignItems: 'center'}">
          <div class="filter-avatar" v-if="creatorIndex!=0&&creatorArr[creatorIndex].avatar">
            <img :src="creatorArr[creatorIndex].avatar" alt />
          </div>
          <div class="filter-name">发起人: {{creatorArr[creatorIndex].name}}</div>
        </div>
        <div :style="{display:'flex',alignItems:'center'}">
          <a-icon type="down" :style="{marginRight:'5px'}" />
          <div
            class="filter-avatar"
            v-if="creatorFindIndex!=-1&&creatorIndex==0"
            :style="{marginRight:'5px'}"
            @click="changeDefault('creator')"
          >
            <img :src="user.profile|defaultPerson" alt />
          </div>
          <a-icon
            type="close-circle"
            v-if="creatorIndex!=0&&chooseFilterIndex==3"
            @click.stop="changeFilter('creatorKey',null,0)"
          />
        </div>
      </div>
      <a-menu slot="overlay">
        <a-menu-item
          :key="index"
          v-for="(item,index) in creatorArr"
          @click="changeFilter('creatorKey',item.key,index)"
        >
          <div class="filter-item">
            <a-radio :checked="index==creatorIndex" />
            <div class="filter-avatar" v-if="item.avatar">
              <img :src="item.avatar" alt />
            </div>
            {{item.name}}
          </div>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown :trigger="['click']" v-model="visible" :style="{width:'300px'}">
      <div class="filter-item filter-title">
        <div>状态: {{stateStr}}</div>
        <div>
          <a-icon type="down" :style="{marginRight:'5px'}" />
        </div>
      </div>
      <a-menu slot="overlay">
        <a-menu-item :key="index" v-for="(item,index) in stateArr">
          <a-checkbox @change="onChange" :name="index+''" :checked="item.checked">{{item.name}}</a-checkbox>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "TaskViewFilter",
  data() {
    return {
      groupArr: [{ name: "全部", key: null }],
      groupIndex: 0,
      creatorArr: [{ name: "全部", key: null }],
      creatorIndex: 0,
      creatorFindIndex: 0,
      executorArr: [{ name: "全部", key: null }],
      executorIndex: 0,
      executorFindIndex: 0,
      stateArr: [
        { name: "过期", checked: true },
        { name: "今天", checked: true },
        { name: "已完成", checked: true },
        { name: "未计划", checked: false },
        { name: "未来", checked: false },
        { name: "一般卡片", checked: false },
        { name: "已归档", checked: false },
      ],
      stateStr: "",
      visible: false,
      filterObj: {},
      chooseFilterIndex: 0,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      cardArray: (state) => state.task.cardArray,
      allTaskArray: (state) => state.task.allTaskArray,
      groupType: (state) => state.group.groupType,
      groupKey: (state) => state.group.groupKey,
    }),
  },
  methods: {
    onChange(e) {
      let index = parseInt(e.target.name);
      this.$set(this.stateArr[index], "checked", !this.stateArr[index].checked);
      this.stateStr = "";
      this.stateArr.forEach((item, index) => {
        if (item.checked) {
          if (index == 0) {
            this.stateStr = item.name + this.stateStr;
          } else {
            this.stateStr =
              this.stateStr == ""
                ? item.name
                : this.stateStr + " / " + item.name;
          }
        }
      });
      this.$set(this.filterObj, "type", this.stateStr);
      this.$emit("update:taskObj", this.filterObj);
    },
    changeFilter(type, key, index) {
      let arr = [];
      if (this.group == 3) {
        arr = this._.cloneDeep(this.cardArray);
      } else {
        arr = this._.cloneDeep(this._.flatten(this.allTaskArray));
      }
      switch (type) {
        case "groupKey":
          this.groupIndex = index;
          break;
        case "creatorKey":
          this.creatorIndex = index;
          break;
        case "executorKey":
          this.executorIndex = index;
          break;
      }
      if (type == "groupKey") {
        this.creatorArr = [{ name: "全部", key: null }];
        this.executorArr = [{ name: "全部", key: null }];
        if (key) {
          arr.forEach((item, index) => {
            if (item.groupKey == key) {
              let creatorIndex = this._.findIndex(this.creatorArr, {
                key: item.creatorKey,
              });
              if (creatorIndex == -1 && item.creatorKey) {
                this.creatorArr.push({
                  key: item.creatorKey,
                  name: item.creatorName,
                  avatar: item.creatorAvatar,
                });
              }
              this.creatorFindIndex = this._.findIndex(this.creatorArr, {
                key: this.user._key,
              });
              if (this.creatorFindIndex != -1) {
                let creatorFindItem = this._.cloneDeep(
                  this.creatorArr[this.creatorFindIndex]
                );
                this.creatorArr.splice(this.creatorFindIndex, 1);
                this.creatorArr.splice(1, 0, creatorFindItem);
              }
              let executorIndex = this._.findIndex(this.executorArr, {
                key: item.executorKey,
              });
              if (executorIndex == -1 && item.executorKey) {
                this.executorArr.push({
                  key: item.executorKey,
                  name: item.executorName,
                  avatar: item.executorAvatar,
                });
              }
              this.executorFindIndex = this._.findIndex(this.executorArr, {
                key: this.user._key,
              });
              if (this.executorFindIndex != -1) {
                let executorFindItem = this._.cloneDeep(
                  this.executorArr[this.executorFindIndex]
                );
                this.executorArr.splice(this.executorFindIndex, 1);
                this.executorArr.splice(1, 0, executorFindItem);
              }
            }
          });
        } else {
          this.getData(arr);
        }
      }
      this.$set(this.filterObj, type, key);
      this.$emit("update:taskObj", this.filterObj);
    },
    changeDefault(type) {
      this.changeFilter(type + "Key", this.user._key, 1);
      this[type + "Index"] = 1;
    },
    clearFilter() {
      this.filterObj = {};
      this.groupArr = [{ name: "全部", key: null }];
      this.groupIndex = 0;
      this.creatorArr = [{ name: "全部", key: null }];
      this.creatorIndex = 0;
      this.executorArr = [{ name: "全部", key: null }];
      this.executorIndex = 0;
    },
    getData(cardArray) {
      this.groupArr = [{ name: "全部", key: null }];
      this.creatorArr = [{ name: "全部", key: null }];
      this.executorArr = [{ name: "全部", key: null }];
      cardArray.forEach((item, index) => {
        let groupIndex = this._.findIndex(this.groupArr, {
          key: item.groupKey,
        });
        if (groupIndex == -1 && item.groupKey) {
          this.groupArr.push({
            key: item.groupKey,
            name: item.groupName,
            logo: item.groupLogo,
          });
        }
        let creatorIndex = this._.findIndex(this.creatorArr, {
          key: item.creatorKey,
        });
        if (creatorIndex == -1 && item.creatorKey) {
          this.creatorArr.push({
            key: item.creatorKey,
            name: item.creatorName,
            avatar: item.creatorAvatar,
          });
        }
        this.creatorFindIndex = this._.findIndex(this.creatorArr, {
          key: this.user._key,
        });
        if (this.creatorFindIndex != -1) {
          let creatorFindItem = this._.cloneDeep(
            this.creatorArr[this.creatorFindIndex]
          );
          this.creatorArr.splice(this.creatorFindIndex, 1);
          this.creatorArr.splice(1, 0, creatorFindItem);
        }
        let executorIndex = this._.findIndex(this.executorArr, {
          key: item.executorKey,
        });
        if (executorIndex == -1 && item.executorKey) {
          this.executorArr.push({
            key: item.executorKey,
            name: item.executorName,
            avatar: item.executorAvatar,
          });
        }
        this.executorFindIndex = this._.findIndex(this.executorArr, {
          key: this.user._key,
        });
        if (this.executorFindIndex != -1) {
          let executorFindItem = this._.cloneDeep(
            this.executorArr[this.executorFindIndex]
          );
          this.executorArr.splice(this.executorFindIndex, 1);
          this.executorArr.splice(1, 0, executorFindItem);
        }
      });
      this.stateStr = "";
      this.stateArr.forEach((item, index) => {
        if (item.checked) {
          if (index == 0) {
            this.stateStr = item.name + this.stateStr;
          } else {
            this.stateStr =
              this.stateStr == ""
                ? item.name
                : this.stateStr + " / " + item.name;
          }
        }
      });
      this.$set(this.filterObj, "type", this.stateStr);
      this.$emit("update:taskObj", this.filterObj);
    },
  },
  watch: {
    cardArray: {
      handler(newValue) {
        if (newValue.length > 0 && this.groupType == 3) {
          this.getData(this._.cloneDeep(newValue));
        }
      },
      immediate: true,
      deep: true,
    },
    allTaskArray: {
      handler(newValue) {
        if (newValue.length > 0 && this.groupType != 3) {
          this.getData(this._.cloneDeep(this._.flatten(newValue)));
        }
      },
      immediate: true,
      deep: true,
    },
    groupKey(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.clearFilter();
      }
    },
    groupType(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.clearFilter();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.taskView-filter {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 5px 0.5%;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
}
.filter-item {
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
}
.filter-title {
  padding: 0px 10px;
  justify-content: space-between;
  box-sizing: border-box;
}
.filter-avatar {
  width: 27px;
  height: 27px;
  overflow: hidden;
  margin-right: 5px;
  border-radius: 50%;
}
.filter-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.filter-name {
  margin-right: 10px;
}
</style>