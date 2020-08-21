<template>
  <div
    id="editor"
    :style="editorType=='cardInfo'?{border: '1px solid #e9e9e9',marginLeft: '10px'}:null"
  >
    <froala
      :tag="'textarea'"
      :config="config"
      v-model="model"
      v-if="cardDetailType!= 1&&editorType=='cardInfo'||editorType=='fileData'&&groupType==3&&(groupRole>0&&groupRole<4)||editorType=='clockEdit'||editorType=='clockCloseEdit'||editorType=='noteEdit'"
    ></froala>
    <froalaView
      v-model="model"
      v-if="cardDetailType== 1&&editorType=='cardInfo'||editorType=='fileData'&&groupType==3&&(groupRole==0||groupRole>3)||editorType=='clockShow'"
    ></froalaView>
  </div>
</template>

<script>
// Require Froala Editor js file.
// require("froala-editor/js/froala_editor.pkgd.min.js");

// Require Froala Editor css files.
// require("froala-editor/css/froala_editor.pkgd.min.css");
// require("froala-editor/css/froala_style.min.css");
import Vue from "vue";
import VueFroala from "vue-froala-wysiwyg";
import FroalaEditorView from "vue-froala-wysiwyg";
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
import VueComponent from "../../main";
import Editor from "./Editor";
// import Vue from "vue";
import uploadFile from "../../common/js/upload";
import { mapState, mapActions } from "vuex";
import * as qiniu from "qiniu-js";
// Vue.use(VueFroala);
// Vue.use(FroalaEditorView);
let selectedFile = null;
export default {
  name: "Editor",
  props: [
    "editorType",
    "fileData",
    "note",
    "noteClose",
    "clientHeight",
    "noteEdit",
  ],
  data() {
    let that = this;
    return {
      config: {
        toolbarInline: false,
        charCounterCount: false,
        toolbarStickyOffset: 50,
        // toolbarVisibleWithoutSelection: true,
        documentReady: true,
        events: {
          initialized: function () {
            // eslint-disable-next-line
            console.log(that);
            console.log(that.clientHeight);
            that.$set(that.config, "height", 200);
          },
          "image.inserted": async function ($img) {
            let blob = await fetch($img[0].src).then((r) => r.blob());
            uploadFile.qiniuUpload(
              localStorage.getItem("uptoken"),
              $img[0],
              blob,
              false
            );
          },
          "video.beforeUpload": function (videos) {
            // Return false if you want to stop the video upload.
            selectedFile = videos[0];
          },
          "video.inserted": function ($video) {
            uploadFile.qiniuUpload(
              localStorage.getItem("uptoken"),
              $video[0],
              selectedFile,
              true
            );
          },
        },
        language: "zh_cn",
        // pluginsEnabled: [
        //   "charCounter",
        //   "codeBeautifier",
        //   "codeView",
        //   "colors",
        //   "draggable",
        //   "embedly",
        //   "emoticons",
        //   "entities",
        //   "fontFamily",
        //   "fontSize",
        //   "image",
        //   "imageManager",
        //   "inlineStyle",
        //   "lineBreaker",
        //   "link",
        //   "lists",
        //   "paragraphFormat",
        //   "quickInsert",
        //   "quote",
        //   "save",
        //   "table",
        //   "url",
        //   "video",
        //   "wordPaste",
        //   "fullscreen",
        // ],
        toolbarButtons: {
          moreText: {
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikeThrough",
              "subscript",
              "superscript",
              // "fontFamily",
              "fontSize",
              // "textColor",
              // "backgroundColor",
              // "inlineClass",
              // "inlineStyle",
              // "clearFormatting",
            ],
          },
          moreParagraph: {
            buttons: [
              "paragraphFormat",
              // "paragraphStyle",
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
              // "quote",
            ],
          },
          moreRich: {
            buttons: [
              "fullscreen",
              "insertImage",
              "insertVideo",
              "insertLink",
              "insertTable",
              "emoticons",
              "fontAwesome",
              "specialCharacters",
              "embedly",
              "insertFile",
              "insertHR",
            ],
          },
          moreMisc: {
            buttons: ["undo", "redo", "alert"],
          },
        },
        height: 0,
      },
      model: "",
      lastModel: "",
    };
  },
  computed: {
    ...mapState({
      cardContent: (state) => state.card.cardContent,
      uptoken: (state) => state.auth.uptoken,
      cardDetailType: (state) => state.card.cardDetailType,
      cardDetail: (state) => state.card.cardDetail,
      groupType: (state) => state.group.groupType,
      groupRole: (state) => state.group.groupRole,
    }),
  },
  created() {
    this.$set(
      this.config,
      "documentReady",
      this.editorType == "fileData" ? true : false
    );
    // this.$set(
    //   this.config,
    //   "toolbarInline",
    //   this.editorType == "fileData" ? true : false
    // );
  },
  mounted() {
    if (
      this.cardDetail &&
      this.cardDetail.content &&
      this.editorType == "cardInfo"
    ) {
      this.model = this.cardDetail.content;
    } else if (this.editorType == "fileData") {
      this.model = this.fileData;
      this.$nextTick(() => {
        this.formatFile(this.model);
        this.$emit("update:fileData", this.model);
      });
    } else if (
      this.editorType == "clockEdit" ||
      this.editorType == "clockShow"
    ) {
      console.log("Xxxxxxxxxxxxxxx", this.note);
      this.model = this.note;
    } else if (this.editorType == "clockCloseEdit") {
      this.model = this.noteClose;
    } else if (this.editorType == "noteEdit") {
      this.model = this.noteEdit;
    }
    this.$set(this.config, "height", this.clientHeight);
    // this.config.documentReady = editorType == "fileData" ? true : false;
  },
  methods: {
    ...mapActions("card", ["editCard", "setCardContent"]),
    formatHtml(wrapper) {
      let arr = [];
      for (let i = 0, len = wrapper.childNodes.length; i < len; i++) {
        let node = wrapper.childNodes[i];
        let nodeName = wrapper.childNodes[i].nodeName;
        if (
          nodeName == "H1" ||
          nodeName == "H2" ||
          nodeName == "H3" ||
          nodeName == "H4"
        ) {
          arr.push({
            nodename: nodeName,
            nodeText: node.innerText,
            nodeTop: node.offsetTop,
          });
        }
      }
      return arr;
    },
    formatFile(model) {
      let wrapper = document.querySelectorAll(".fr-wrapper .fr-view")[0];
      let doc = document.querySelectorAll("span[data-shimo-docs]")[0];
      let wrapperArr = [];
      let docArr = [];
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.innerHTML = model;
      }
      if (wrapper) {
        wrapperArr = this.formatHtml(wrapper);
      }
      if (doc) {
        docArr = this.formatHtml(doc);
      }
      console.log(wrapperArr.concat(docArr));
      this.$emit("update:fileArr", wrapperArr.concat(docArr));
    },
  },
  watch: {
    model(newVal, oldVal) {
      if (newVal != oldVal) {
        if (this.editorType == "cardInfo") {
          this.setCardContent(newVal);
        } else if (this.editorType == "fileData") {
          // let arr = [];
          // // newVal = newVal.replace(
          // //   /https:\/\/images-cdn.shimo.im\//g,
          // //   "https://uploader.shimo.im/f/"
          // // );
          // // newVal = newVal.replace(/__thumbnail/g, ".png!thumbnail");
          // let strArr = newVal.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi);
          // strArr.forEach((item) => {
          //   let imgStr = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);
          //   let str = imgStr[1].replace(
          //     "https://uploader.shimo.im/f/",
          //     "https://images-cdn.shimo.im/"
          //   );
          //   str = str.replace(".png!thumbnail", "__thumbnail");
          //   // let file = uploadFile.getBase64FromImageURL(str,uploadFile.dataURLtoFile);
          //   // console.log(file);
          //   let image = new Image();
          //   image.src = str;
          //   image.setAttribute("crossOrigin", "anonymous");
          //   // image.onload = function () {
          //   //   let file = uploadFile.dataURLtoFile(
          //   //     uploadFile.getImageBase64(image),
          //   //     "fileData" + new Date().getTime()
          //   //   );
          //   //   // uploadFile.uploadImg(file, that.uptoken, mimeType, function (url) {
          //   //   //   that.avatar = url;
          //   //   // });
          //   // };
          //   image.onerror = function (img) {
          //     // console.log("onerror", str);
          //     // image.src = imgStr[1];
          //     // let file = uploadFile.dataURLtoFile(
          //     //   uploadFile.getImageBase64(image),
          //     //   "fileData" + new Date().getTime()
          //     // );
          //     // uploadFile.uploadImg(file, that.uptoken, mimeType, function (url) {
          //     //   that.avatar = url;
          //     // });
          //   };
          // });
          // // console.log(arr);

          this.$nextTick(() => {
            this.formatFile(newVal);
            this.$emit("update:fileData", newVal);
          });
        } else if (this.editorType == "clockEdit") {
          this.$emit("update:note", newVal);
        } else if (this.editorType == "clockCloseEdit") {
          this.$emit("update:noteClose", newVal);
        } else if (this.editorType == "noteEdit") {
          this.$emit("update:noteEdit", newVal);
        }
      }
    },
    fileData: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.model = newVal;
          // this.$nextTick(() => {
          //   this.formatFile(newVal);
          //   this.$emit("update:fileData", newVal);
          // });
        }
      },
      immediate: true,
    },
    note: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.model = newVal;
        }
      },
      immediate: true,
    },
    noteClose: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.model = newVal;
        }
      },
      immediate: true,
    },
    noteEdit: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.model = newVal;
        }
      },
      immediate: true,
    },
    cardDetail: {
      handler(newVal) {
        if (newVal && this.editorType == "cardInfo") {
          this.model = newVal.content;
        }
      },
      immediate: true,
      deep: true,
    },
    clientHeight: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.$set(this.config, "height", newVal);
        }
      },
      immediate: true,
    },
  },
};
</script>
<style>
#editor {
  width: calc(100% - 20px);
  position: relative;
  box-sizing: border-box;
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