<template>
    <div class="layout app-container">
        <div class="layout-header">
            <div class="layout-header-system-name">
               乐课力财务中台
            </div>

            <div class="layout-header-actions">
                <div class="user">
                    15997138967 您好!
                    <n-icon size="large" style="margin-left: 10px;" :component="HappyOutline" />
                </div>
                
                <n-icon size="large" class="logout" :component="PowerSharp" @click="handleLogout" />
            </div>
        </div>

        <div class="layout-menus">
            <n-menu 
                class="menu"
                v-model:value="currentMenuName"
                :options="menuOption"
                :default-expanded-keys="['Finance']"
                @update:value="handleUpdateMenu"
            />
        </div>

        <div class="layout-content">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { NIcon, useDialog, NMenu } from 'naive-ui';
import { 
    HappyOutline, PowerSharp, ServerOutline, StatsChartOutline,
    DocumentTextOutline, RecordingOutline, AlbumsOutline,
} from "@vicons/ionicons5";
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, h } from "vue";

const dialog = useDialog();
const router = useRouter();
const route = useRoute();

const currentMenuName = computed(() => {
    return route.name
});

const menuOption = ref([
    {
        label: "数据中心",
        key: "DataCenter",
        icon: renderIcon(ServerOutline),
    },
    {
        label: "财务",
        key: "Finance",
        icon: renderIcon(StatsChartOutline),
        children: [
            {
                label: "财务对账",
                key: "CheckAccounts",
                icon: renderIcon(RecordingOutline),
            },
            {
                label: "分析结果",
                key: "Result",
                icon: renderIcon(StatsChartOutline),
            },
            {
                label: "匹配记录",
                key: "MatchRecords",
                icon: renderIcon(DocumentTextOutline),
            },
            {
                label: "凭证记录",
                key: "ProofRecords",
                icon: renderIcon(AlbumsOutline),
            }
        ]
    }
]);

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

function handleUpdateMenu(name) {
    router.push({ name });
}

function handleLogout() {
    dialog.warning({
        title: "退出确认",
        content: "你确定要退出登录吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: () => {
            router.replace({ name: "Login" });
        },
    });
}
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: #f2f3f4;
    padding-top: 60px;
    padding-left: 250px;
    box-sizing: border-box;
    .layout-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--root-padding-default);
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        background-color: #fff;
        box-shadow: var(--root-shadow);
        .layout-header-system-name {
            font-size: var(--root-font-size-super);
            letter-spacing: 2px;
        }
        .layout-header-actions {
            display: flex;
            align-items: center;
            .user {
                display: flex;
                align-items: center;
                color: #666;
            }
            .logout {
                color: red;
                margin-left: var(--root-padding-default);
                padding: 3px;
                cursor: pointer;
                transition: all .2s linear;
                    border-radius: var(--root-radius);
                &:hover {
                    background-color: rgba(0,0,0,.1);
                    
                }
                &:active {
                    background-color: rgba(0,0,0,.2);
                }
            }
        }
    }
    .layout-menus {
        position: fixed;
        top: 60px;
        left: 0;
        display: inline-flex;
        width: 250px;
        height: calc(100% - 60px);
        box-shadow: var(--root-shadow);
        background-color: #fff;
        .menu {
            width: 100%;
        }
    }
    .layout-content {
        display: flex;
        width: 100%;
        padding: var(--root-padding-default);
        padding-bottom: 0;
        box-sizing: border-box;
        background-color: #f2f3f4;
    }
}
</style>