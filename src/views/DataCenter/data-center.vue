<template>
    <div class="page-container">
        <div class="page-search">
            <div class="page-title">查询条件</div>

            <div class="page-search-content">
                <n-form
                    :model="searchParams"
                    inline
                    label-placement="left"
                    :show-feedback="false"
                >
                    <n-form-item label="年">
                        <n-date-picker
                            v-model:value="searchParams.year"
                            type="year"
                            clearable
                            placeholder="请选择年份"
                        />
                    </n-form-item>

                    <n-form-item label="月">
                        <n-date-picker
                            v-model:value="searchParams.month"
                            type="month"
                            clearable
                            format="y年 M月"
                            year-format="y年"
                            month-format="M月"
                            placeholder="请选择月份"
                        />
                    </n-form-item>

                    <n-form-item label="周">
                        <n-date-picker
                            v-model:value="searchParams.week"
                            type="week"
                            clearable
                            placeholder="请选择周"
                        />
                    </n-form-item>
                </n-form>

                <n-space class="page-search__button">
                    <n-button
                        @click="handleReset"
                    >
                        <template #icon>
                            <n-icon>
                                <RefreshOutline/>
                            </n-icon>
                        </template>
                        清空
                    </n-button>

                    <n-button
                        type="primary"
                        @click="handleSearch"
                    >
                        <template #icon>
                            <n-icon>
                                <SearchOutline/>
                            </n-icon>
                        </template>
                        搜索
                    </n-button>
                </n-space>
            </div>
        </div>

        <div class="page-content">
            <div class="page-title">数据列表</div>

            <n-tabs
                type="line"
                :default-value="tabs[0].value"
                @update:value="handleSelectTab"
            >
                <n-tab
                    v-for="(item, index) in tabs"
                    :key="index"
                    :name="item.value"
                >
                    {{ item.label }}
                </n-tab>
            </n-tabs>

            <n-table :single-line="false" style="margin-top: var(--root-padding-default)">
                <thead>
                    <tr>
                        <th>项目</th>
                        <th>上月同期</th>
                        <th>月</th>
                        <th>年</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in table"
                        :key="index"
                    >
                        <td style="width: 25%">{{ item.project }}</td>
                        <td style="width: 25%">{{ item.prev }}</td>
                        <td style="width: 25%">{{ item.month }}</td>
                        <td style="width: 25%">{{ item.year }}</td>
                    </tr>
                </tbody>
            </n-table>

        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import {NForm, NFormItem, NDatePicker, NButton, NSpace, NIcon, NTabs, NTab, NTable} from "naive-ui";
import {RefreshOutline, SearchOutline} from "@vicons/ionicons5";

const searchParams = ref(null);
const tabs = ref([]);
const table = ref([]);

init();

function init() {
    initSearchParams();
    initTabList();
    getData();
}

function handleReset() {
    initSearchParams();

    handleSearch();
}

function handleSearch() {
    getData();
}

function handleSelectTab(value) {
    console.log(value);
}

function getData() {
    table.value = [
        { project: "定金", prev: 12, month: 2, year: 2024 },
        { project: "押金", prev: 7, month: 2, year: 2024 },
        { project: "房租收入", prev: 3, month: 2, year: 2024 },
        { project: "能源费", prev: 2, month: 2, year: 2024 },
        { project: "维保费", prev: 8, month: 2, year: 2024 },
        { project: "违约金", prev: 5, month: 2, year: 2024 },
    ];
}

function initSearchParams() {
    searchParams.value = {
        year: null,
        month: null,
        week: null,
    };
}

function initTabList() {
    tabs.value = [
        {
            label: "全部",
            value: 0,
        },
        {
            label: "漕河泾项目",
            value: 1,
        },
        {
            label: "田林路项目",
            value: 2,
        }
    ];
}
</script>

