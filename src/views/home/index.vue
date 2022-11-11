<template>
    <n-layout has-sider class="layout">
        <n-layout-sider class="menu" width="400" bordered content-style="padding: 24px;" :native-scrollbar="false">
            <div style="width: 100%;text-align: center;font-size: 30px">特供版</div>
            <n-layout-header>
                <n-space vertical>
                    <n-select
                        v-model:value="repoSelectValue"
                        @update:value="repoSelectChange"
                        :options="repoList"/>
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
            <n-layout-content class="content">
                <MdEditorProvider :md="md"/>
            </n-layout-content>
        </n-layout>
    </n-layout>
</template>

<script lang="ts" setup>

import {ref, h} from "vue";
import {SelectOption, TreeOption, NIcon, NButton} from 'naive-ui'
import * as axios from "@/utils/axios";
import {fileHandlerMap} from "./fileProcess.js"
import MdEditorProvider from '@/components/MdEditorProvider.vue'
import {getIconForFile, getIconForFolder, getIconForOpenFolder} from 'vscode-icons-js';
import {useLoadingBar} from 'naive-ui'


const loadingBar = useLoadingBar()
const repoName = ref("FORKOPEN/Introduction-to-Golang");
let treeData = ref([]);
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

const treeNodeProps = ({option}: { option: TreeOption | any }) => {
    return {
        async onClick() {
            selectTreeInfo.value = option
            const treeInfo = option
            if (treeInfo.type === 'dir') {
                console.log(getIconForOpenFolder("test"))
                for (const tree of treeInfo.children) {
                    setTreeIcon(tree)
                }
                return
            }

            loadingBar.start()

            const index = treeInfo.html_url.lastIndexOf(".");
            let ext = treeInfo.html_url.substring(index + 1);
            // https://github.com/hellolinks/notebooks/blob/master/Language/MyFirst.md

            console.log("dynamic_url=", `https://github.com/${repoName.value}/blob/${repoDefaultBranch.value}`)
            console.log("raw_url=", treeInfo.html_url)

            treeInfo.html_url = treeInfo.html_url.replace(
                `https://github.com/${repoName.value}/blob/${repoDefaultBranch.value}`,
                speedUrl.value + repoName.value + "@" + repoDefaultBranch.value
            );

            console.log("finish_url=", treeInfo.html_url)

            if (
                treeInfo.html_url.substring(treeInfo.html_url.length - 10) ===
                "Dockerfile"
            ) {
                ext = "go";
            }
            const fileHandler = fileHandlerMap.get(ext)
            await fileHandler(
                treeInfo.html_url,
                res => {
                    md.value = res;
                    loadingBar.finish();
                },
                ext,
                treeInfo
            );
            console.log("wcoa")
            setTimeout(() => {
                loadingBar.finish()
            }, 1000)
        },
    }
}

const repoSelectChange = async (value: string, option: SelectOption) => {
    await getRepoContent();
}

const recursiveFilter = (tree, keys) => {
    let data = tree.filter((item) => item.keys == keys);
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
    const repoInfo = await axios.get(`/${repoSelectValue.value.split("/")[1]}/repoInfo.json`)
    repoDefaultBranch.value = repoInfo.default_branch
    repoName.value = repoInfo.full_name
    const cacheTreeData = await axios.get(repoSelectValue.value)
    for (const treeInfo of cacheTreeData) {
        setTreeIcon(treeInfo)
        // treeInfo.suffix = () =>
        //     h(
        //         NButton,
        //         {text: true, type: 'primary'},
        //         {default: () => 'Suffix'}
        //     )
    }
    console.log(cacheTreeData)
    treeData.value = cacheTreeData

    console.log("repoName", repoName.value)
}


const setTreeIcon = (treeInfo) => {
    if (treeInfo.type === 'dir') {
        treeInfo.prefix = () => h(NIcon, {color: ""}, {default: () => h('img', {src: 'icons/default_folder.svg'})})
        return
    }
    treeInfo.prefix = () => h(NIcon, {
        size: "20",
        color: ""
    }, {default: () => h('img', {src: `icons/${getIconForFile(treeInfo.html_url)}`})})
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
