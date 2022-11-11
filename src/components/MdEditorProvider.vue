<template>
    <mavon-editor ref="loadingBarTargetRef"
                  language="zh-CN"
                  class="markdown"
                  v-model="md"
                  :subfield="mdProp.subfield"
                  :defaultOpen="mdProp.defaultOpen"
                  :toolbarsFlag="mdProp.toolbarsFlag"
                  :editable="mdProp.editable"
                  :scrollStyle="mdProp.scrollStyle"
                  :navigation="mdProp.navigation"/>

</template>

<script lang="ts" setup>
const mdProp = {
    subfield: false, // 单双栏模式
    defaultOpen: "preview", //edit： 默认展示编辑区域 ， preview： 默认展示预览区域
    editable: true,
    toolbarsFlag: true,
    scrollStyle: true,
    navigation: true,
};

defineProps({
    md: {
        type: String,
    }
})
</script>

<style lang="scss" scoped>
.markdown {
    width: 100%;
    min-width: 700px;
    height: 100%;
}
</style>
