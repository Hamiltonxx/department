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
                    <n-form-item label="时间选择">
                        <n-date-picker
                            v-model:value="searchParams.date"
                            type="daterange"
                            clearable
                            class="page-search-content__item"
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
                :default-value="shopList[0].value"
                @update:value="handleSelectTab"
            >
                <n-tab
                    v-for="(item, index) in shopList"
                    :key="index"
                    :name="item.value"
                >
                    {{ item.label }}
                </n-tab>
            </n-tabs>

            <n-data-table 
                :columns="columns"
                :data="table.data"
                :row-key="rowKey"
                :max-height="max_height"
                :row-class-name="rowClassName"
                :loading="table.loading"
            />

        </div>
    </div>
</template>

<script setup>
import {ref, onBeforeMount, onMounted} from "vue";
import {NForm, NFormItem, NDatePicker, NButton, NSpace, NIcon, NTabs, NTab, NDataTable, c} from "naive-ui";
import {RefreshOutline, SearchOutline} from "@vicons/ionicons5";
import { getShop } from "@/api/result";
import { getShopDataDetail } from "@/api/data-center";

let shopList = ref([{ label: "全部", value: "全部" }]);
const searchParams = ref(null);
const monthOptions = ref([]);
const activeTab = ref("全部");

onBeforeMount(() => {
    init();
});

onMounted(() => {
    getMaxHeight();
});

const columns = [
    { title: "序号", key: "no", width: 100, },
    { title: "收支总类", key: "category_group", },
    { title: "流水明细", key: "category", },   
    { title: "收入", key: "income", },   
    { title: "支出", key: "expense", },   
    { title: "总计", key: "total", },   
];

function init() {
    initSearchParams();
    initShopData();
    initSearchOptions();
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
    activeTab.value = value;
    getData();
}

function rowKey(row) {
    return row.no;
}

function rowClassName(row) {
    return row.no ? "" : "row-children";
}

/**
 * 初始化门店数据
 */
 const table = ref({
    loading: false,
    data: [],
});
async function getData() {
    const params = {
        ...getParams(),
        shop: activeTab.value === "全部" ? null : activeTab.value,
    };

    table.value.loading = true;
    const res = await getShopDataDetail(params);
    table.value.loading = false;

    let result = {};

    res.forEach(item => result[item.category_group] = { children: [], total: 0, income: 0, expense: 0 });

    res.forEach(item => {
        Object.keys(result).forEach(key => {
            if (key === item.category_group) {
                result[key].children.push(item);
                result[key].total += item.total;
                result[key].income += item.income;
                result[key].expense += item.expense;
            }
        });
    });

    let r = [];

    Object.keys(result).forEach((key, index) => {
        r.push({
            no: index + 1,
            category_group: key,
            category: "",
            income: result[key].income.toFixed(2),
            expense: result[key].expense.toFixed(2),
            total: result[key].total.toFixed(2),
            children: result[key].children,
        });
    });

    table.value.data = r;
}

function getYear(year) {
    if (year) return new Date(year).getFullYear();

    return new Date().getFullYear();
}

function getMonth(month) {
    if (month) return new Date(month).getMonth() + 1;

    return new Date().getMonth() + 1;
}

function initSearchParams() {
    const month = new Date().getMonth() + 1;
    let starttime = new Date(new Date().getFullYear(), month - 1, 1), 
    endtime;

    if ([1,3,5,7,8,10,12].includes(month)) {
        endtime = new Date(new Date().getFullYear(), month - 1, 31);
    } else if (month === 2) {
        endtime = new Date(new Date().getFullYear(), month - 1, 28);
    } else {
        endtime = new Date(new Date().getFullYear(), month - 1, 30);
    }

    searchParams.value = {
        date: [new Date(starttime), new Date(endtime)],
    };
}

function initSearchOptions() {
    let months = [];
    for (let i = 1; i < 13; i++) months.push(i);

    monthOptions.value = months.map(month => ({ label: month + "月", value: month }));
}

async function initShopData() {
    shopList.value = [{ label: "全部", value: "全部" }];

    const params = getParams();

    const res = await getShop(params);

    res.forEach(item => shopList.value.push({ label: item, value: item }));
}

function getParams() {
    return {
        startdate: formatDate(searchParams.value.date[0]) + ' 00:00:00',
        enddate: formatDate(searchParams.value.date[1]) + ' 23:59:59',
    };
}

// 格式化日期
function formatDate(dateNumber) {
    const date = new Date(dateNumber);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}

const max_height = ref(0);
function getMaxHeight() {
    let window_height = document.documentElement.clientHeight;
    window_height = window_height - 60 - 32 - 334;
    max_height.value = window_height;
}
</script>

<style lang="scss" scoped>
:deep(.row-children .n-data-table-td) {
    background-color: #F8FBFC !important;
}
</style>