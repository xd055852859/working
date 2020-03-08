<template>
  <div id="editor" @mouseleave="saveContent">
    <froala :tag="'textarea'" :config="config" v-model="model" v-if="cardDetailType!= 1"></froala>
    <froalaView v-model="model" v-if="cardDetailType== 1"></froalaView>
  </div>
</template>

<script>
// Require Froala Editor js file.
require("froala-editor/js/froala_editor.pkgd.min.js");

// Require Froala Editor css files.
require("froala-editor/css/froala_editor.pkgd.min.css");
require("froala-editor/css/froala_style.min.css");
import VueFroala from "vue-froala-wysiwyg";
// import FroalaEditorView from "vue-froala-wysiwyg";
import "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/js/languages/zh_cn";
import "froala-editor/js/plugins/align.min";
import "froala-editor/js/plugins/char_counter.min";
import "froala-editor/js/plugins/code_beautifier.min";
import "froala-editor/js/plugins/code_view.min";
import "froala-editor/js/plugins/colors.min";
import "froala-editor/js/plugins/draggable.min";
import "froala-editor/js/third_party/embedly.min";
import "froala-editor/js/plugins/font_family.min";
import "froala-editor/js/plugins/font_size.min";
import "froala-editor/js/plugins/fullscreen.min";
import "froala-editor/js/plugins/image.min";
import "froala-editor/js/plugins/image_manager.min";
import "froala-editor/js/plugins/inline_style.min";
import "froala-editor/js/plugins/line_breaker.min";
import "froala-editor/js/plugins/link.min";
import "froala-editor/js/plugins/lists.min";
import "froala-editor/js/plugins/paragraph_format.min";
import "froala-editor/js/plugins/paragraph_style.min";
import "froala-editor/js/plugins/quick_insert.min";
import "froala-editor/js/plugins/quote.min";
import "froala-editor/js/plugins/save.min";
import "froala-editor/js/plugins/table.min";
import "froala-editor/js/plugins/url.min";
import "froala-editor/js/plugins/video.min";
import "froala-editor/js/plugins/word_paste.min";

import Vue from "vue";
import uploadFile from "../../common/js/upload";
import { mapState, mapActions } from "vuex";
import * as qiniu from "qiniu-js";
Vue.use(VueFroala);
// Vue.use(FroalaEditorView);
export default {
  name: "Editor",
  data() {
    return {
      config: {
        toolbarInline: true,
        events: {
          "froalaEditor.initialized": function() {
            // eslint-disable-next-line
            console.log("initialized");
            console.log(this);
          },
          "image.inserted": async function($img) {
            let blob = await fetch($img[0].src).then(r => r.blob());
            uploadFile.qiniuUpload(
              localStorage.getItem("uptoken"),
              $img[0],
              blob,
              false
            );
          },
          "video.inserted": async function($video) {
            let blob = await fetch($video[0].src).then(r => r.blob());
            uploadFile.qiniuUpload(
              localStorage.getItem("uptoken"),
              $video[0],
              blob,
              true
            );
          }
        },
        pluginsEnabled: [
          "align",
          "charCounter",
          "codeBeautifier",
          "codeView",
          "colors",
          "draggable",
          "embedly",
          "emoticons",
          "entities",
          "fontFamily",
          "fontSize",
          "fullscreen",
          "image",
          "imageManager",
          "inlineStyle",
          "lineBreaker",
          "link",
          "lists",
          "paragraphFormat",
          "paragraphStyle",
          "quickInsert",
          "quote",
          "save",
          "table",
          "url",
          "video",
          "wordPaste"
        ],
        toolbarButtons: {
          moreText: {
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikeThrough",
              "subscript",
              "superscript",
              "fontFamily",
              "fontSize",
              "textColor",
              "backgroundColor",
              "inlineClass",
              "inlineStyle",
              "clearFormatting"
            ]
          },
          moreParagraph: {
            buttons: [
              "paragraphFormat",
              "paragraphStyle",
              "alignLeft",
              "alignCenter",
              "formatOLSimple",
              "alignRight",
              "alignJustify",
              "formatOL",
              "formatUL",
              "lineHeight",
              "outdent",
              "indent",
              "quote"
            ]
          },
          moreRich: {
            buttons: [
              "insertImage",
              "insertVideo",
              "insertLink",
              "insertTable",
              "emoticons",
              "fontAwesome",
              "specialCharacters",
              "embedly",
              "insertFile",
              "insertHR"
            ]
          },
          moreMisc: {
            buttons: ["undo", "redo", "alert"]
          }
        }
      },
      model: ""
    };
  },
  computed: mapState({
    cardContent: state => state.card.cardContent,
    uptoken: state => state.auth.uptoken,
    cardDetailType: state => state.card.cardDetailType,
    cardDetail: state => state.card.cardDetail
  }),
  mounted() {
    this.model = this.cardDetail.content;
  },
  methods: {
    ...mapActions("card", ["editCard"]),
    saveContent() {
      this.editCard({
        content: this.model,
        key: this.cardDetail._key
      });
    }
  },
  watch: {
    // model(newValue, oldValue) {
    //   if (newValue != oldValue && newValue) {
    //     newValue = newValue ? newValue : "";
    //     this.setCardContent(newValue);
    //   }
    // },
    cardDetail: {
      handler(newVal) {
        this.model = newVal.content;
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style>
#editor {
  width: calc(100% - 20px);
  position: relative;
  margin: 0px 10px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #e9e9e9;
  border-radius: 5px;
}
/* .fr-wrapper > div:first-child {
  position: absolute;
  top: -10000px;
  opacity: 0;
  left: 0;
  height: 0px;
}*/
#editor textarea {
  display: none !important;
}
/* .fr-box.fr-basic.fr-top .fr-wrapper{
  height:230px;
} */
.fr-wrapper > div[style*="z-index:9999"] {
  position: absolute;
  top: -10000px;
  opacity: 0;
}
.fr-placeholder {
  margin-top: 0 !important;
}
.fr-element {
  margin-top: -60px !important;
}
</style>