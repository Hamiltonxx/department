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
                    <n-form-item label="选择时间">
                        <n-date-picker
                            type="daterange"
                            clearable
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            separator="至"
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

            <n-table :single-line="false" style="margin-top: var(--root-padding-default)">
                <thead>
                    <tr>
                        <th>项目名称</th>
                        <th>全房通</th>
                        <th>贝壳</th>
                        <th>POS机</th>
                        <th>银行转账</th>
                        <th>现金=现金-优惠</th>
                        <th>操作</th>
                        <th>凭证状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in table"
                        :key="index"
                    >
                        <td>{{ item.project }}</td>
                        <td><custom-upload-file :obj="item.q" /></td>
                        <td><custom-upload-file :obj="item.b" /></td>
                        <td><custom-upload-file :obj="item.p" /></td>
                        <td><custom-upload-file :obj="item.y" /></td>
                        <td><custom-upload-file :obj="item.x" /></td>
                        <td>分析</td>
                        <td>{{ item.state }}</td>
                    </tr>
                </tbody>
            </n-table>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";

import {NForm, NFormItem, NDatePicker, NSpace, NIcon, NButton, NTable} from "naive-ui";
import {RefreshOutline, SearchOutline} from "@vicons/ionicons5";
import CustomUploadFile from "@/components/upload-file";

const searchParams = ref(null);
const table = ref([]);

init();

function handleReset() {
    initSearchParams();
    handleSearch();
}

function handleSearch() {

}

function init() {
    initSearchParams();
    getData();
}

function getData() {
    table.value = [
        { project: "龙曹路", q: null, b: null, p: null, y: null, x: null, state: "未生成" },
        { project: "林甜路", q: null, b: null, p: null, y: null, x: null, state: "未生成" },
        { project: "四平路", q: null, b: null, p: null, y: null, x: null, state: "未生成" },
        { project: "桂林路", q: null, b: null, p: null, y: null, x: null, state: "未生成" },
        { project: "南京路", q: null, b: null, p: null, y: null, x: null, state: "未生成" },
        { project: "杭州路", q: null, b: null, p: null, y: null, x: null, state: "未生成" },
    ];
}

function initSearchParams() {
    searchParams.value = {
        date: null,
    };
}
</script>