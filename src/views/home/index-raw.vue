<template>
    <n-layout has-sider class="layout">
        <n-layout-sider class="menu" width="400" bordered content-style="padding: 24px;" :native-scrollbar="false">
            <n-layout-header>
                <n-space vertical>
                    <n-select v-model:value="repoSelectValue" :options="repoList"/>
                </n-space>
            </n-layout-header>
            <n-layout-content content-style="padding: 24px;">
                <n-tree
                    block-line
                    :data="treeData"
                    expand-on-click
                    selectable
                    key-field="sha"
                    label-field="name"
                    :node-props="treeNodeProps"
                />
            </n-layout-content>
        </n-layout-sider>

        <n-layout class="content-layout">
            <!--            <n-layout-header bordered></n-layout-header>-->
            <n-layout-content class="content">
                <MdEditorProvider :md="md"/>
            </n-layout-content>
            <!--            <n-layout-footer bordered></n-layout-footer>-->
        </n-layout>
    </n-layout>
</template>

<script lang="ts" setup>

import {computed, defineComponent, ref} from "vue";
import {TreeOption} from 'naive-ui'
import * as axios from "@/utils/axios";
import {fileHandlerMap} from "./fileProcess.js"
import MdEditorProvider from '@/components/MdEditorProvider.vue'

import {useLoadingBar} from 'naive-ui'

const loadingBar = useLoadingBar()

const repoName = ref("hellolinks/notebooks");
let treeData = [];
const repoDefaultBranch = ref("master");
const md = ref("");
const selectTreeInfo = ref({});
const speedUrl = ref("https://cdn.staticaly.com/gh/");
const repoList = [
    {

        label: "FORKOPEN/Introduction-to-Golang",
        value: "/FORKOPEN/Introduction-to-Golang.json",
    },
    {
        label: "hellolinks/notebooks",
        value: "/hellolinks/notebooks.json"
    }
]

const repoSelectValue = ref('/FORKOPEN/Introduction-to-Golang.json')


// TODO 添加收藏等功能
// const showDropdownRef = ref(false);
// const optionsRef = ref<DropdownOption[]>([]);
// const xRef = ref(0);
// const yRef = ref(0);

const treeNodeProps = ({option}: { option: TreeOption | any }) => {
    return {
        onClick() {
            selectTreeInfo.value = option
            const treeInfo = option
            if (treeInfo.type === 'dir') {
                return
            }

            loadingBar.start()

            const index = treeInfo.html_url.lastIndexOf(".");
            let ext = treeInfo.html_url.substring(index + 1);
            // https://github.com/hellolinks/notebooks/blob/master/Language/MyFirst.md
            treeInfo.html_url = treeInfo.html_url.replace(
                `https://github.com/${repoName.value}/blob/${repoDefaultBranch.value}`,
                speedUrl.value + repoName.value + "@" + repoDefaultBranch.value
            );

            if (
                treeInfo.html_url.substring(treeInfo.html_url.length - 10) ===
                "Dockerfile"
            ) {
                ext = "go";
            }

            fileHandlerMap.get(ext)?.(
                treeInfo.html_url,
                res => {
                    md.value = res;
                    loadingBar.finish();
                },
                ext
            );
        },
        // onContextmenu(e: MouseEvent): void {
        //     optionsRef.value = [option]
        //     showDropdownRef.value = true
        //     xRef.value = e.clientX
        //     yRef.value = e.clientY
        //     console.log(e.clientX, e.clientY)
        //     e.preventDefault()
        // }
    }
}


const recursiveFilter = (tree, keys) => {
    let data = tree.filter((item) => item.sha == keys);
    if (data.length != 0) {
        selectTreeInfo.value = data[0];
    } else {
        tree.map((item) => {
            if (item.children) {
                //递归循环
                recursiveFilter(item.children, keys);
            }
        });
    }
    return data;
}


const getRemoteData = async (url): Promise<any> => {
    return await axios.get(url);
}

const getRepoContent = async () => {
    const cacheTreeData = localStorage.getItem(repoName.value);
    if (cacheTreeData) {
        treeData = JSON.parse(cacheTreeData)
        // console.log("treeData", treeData)
    } else {
        await getRepoInfo();
        const result = await axios.get(`https://api.github.com/repos/${repoName.value}/contents`);
        await recursion(result);
        treeData = result;
        localStorage.setItem(repoName.value, JSON.stringify(result));
        localStorage.setItem(
            "repoName",
            repoName.value + ";" + repoDefaultBranch.value
        );
    }
}

const recursion = async (dataList) => {
    for (const data of dataList) {
        if (data.size === 0) {
            data.children = await getRemoteData(data.url);
            await recursion(data.children);
        }
    }
}


const getRepoInfo = async () => {
    // FORKOPEN/Introduction-to-Golang.json
    const result = await axios.get(`https://api.github.com/repos/${repoName.value}`);
    repoDefaultBranch.value = result.default_branch;
}

await getRepoContent();


</script>

<style lang="scss" scoped>
.layout {
    width: inherit;
    height: inherit;

    .content-layout {
        width: inherit;
        height: inherit;

        .content {
            width: 100%;
            height: 100%;
        }

    }
}

.n-layout-header {
    padding: 24px;
}

.n-layout-footer {
    padding: 24px;
}
</style>
