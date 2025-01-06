<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
        <n-dialog-provider>
            <n-modal-provider>
                <n-message-provider>
                    <app-layout v-if="useLayout">
                        <router-view />
                    </app-layout>

                    <router-view v-else />
                </n-message-provider>
            </n-modal-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<script setup>
import { NMessageProvider, NDialogProvider, NConfigProvider, NModalProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import AppLayout from "@/components/Layout";
import { computed } from "vue";
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();

const useLayout = computed(() => {
    return typeof route?.meta?.useLayout === 'boolean' ? route?.meta?.useLayout : true;
});

</script>