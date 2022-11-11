<template>
    <n-loading-bar-provider>
        <n-message-provider>
            <div class="app-view">
                <suspense>
                    <router-view></router-view>
                </suspense>
            </div>
        </n-message-provider>
    </n-loading-bar-provider>
</template>

<style lang="scss" scoped>
.app-view {
    width: inherit;
    height: inherit;
}
</style>
