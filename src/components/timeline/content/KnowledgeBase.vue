<template>
  <div class="knowledge-base">
    <CardWindow />
    <CardPoint />
    <Editor class="knowledge-editor" />
  </div>
</template>

<script>
import CardWindow from "./CardWindow";
import CardPoint from "./CardPoint";
import Editor from "../../common/Editor";
export default {
  name: "KnowledgeBase",
  components: { CardWindow, CardPoint, Editor }
};
</script>

<style scoped>
.knowledge-base {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
}
.knowledge-editor {
  width: calc(100% - 860px);
  height: calc(100% - 75px);
  position: fixed;
  top: 75px;
  right: 0px;
  z-index: 5;
}

</style>