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
                        重置
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
                        查询
                    </n-button>
                </n-space>
            </div>
        </div> 

        <div class="page-content">
            <div class="page-title">数据列表</div>

            <n-tabs
                type="line"
                :default-value="activeTab"
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

            <div class="row">总计：<span>{{ count.total }}</span> 元</div>
            <div class="row">收入：<span>{{ count.income }}</span> 元</div>
            <div class="row">支出：<span>{{ count.expense }}</span> 元</div>
        
            <n-data-table
                :columns="columns"
                :data="table.data"
                :max-height="max_height"
                :loading="table.loading"
            />
        </div>
    </div>
</template>

<script setup>
import { NDataTable, NTabs, NTab, NForm, NFormItem, NDatePicker, NSpace, NButton, NIcon } from 'naive-ui';
import { ref, onBeforeMount, onMounted } from 'vue';
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5';
import { getShop, getShopData, getShopDataDetail } from "@/api/result";

onBeforeMount(() => {
    initSearchParams();
    initShopData();
    initTableCount();
    initTableData();
});

onMounted(() => {
    getMaxHeight();
});

const columns = [
    { title: "序号", key: "no", width: 60, },
    { title: "项目", key: "category", },   
    { title: "收入", key: "income", },   
    { title: "支出", key: "expense", },   
    { title: "总计", key: "total", },   
];

/**
 * 重置
 */
function handleReset() {
    initSearchParams();
    initShopData();
    initTableCount();
    initTableData();
}

/**
 * 查询
 */
function handleSearch() {
    initShopData();
}

/**
 * 选择项目
 */
function handleSelectTab(tab) {
    activeTab.value = tab;
    initTableCount();
    initTableData();
}

/**
 * 初始化查询条件
 */
const searchParams = ref();
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

/**
 * 获取门店数量
 */
const shopList = ref([{ label: "全部", value: "全部" }]);
const activeTab = ref("全部");
async function initShopData() {
    shopList.value = [{ label: "全部", value: "全部" }];

    const params = getParams();

    const res = await getShop(params);

    res.forEach(item => shopList.value.push({ label: item, value: item }));
}

/**
 * 初始化门店数据
 */
const table = ref({
    loading: false,
    data: [],
});
async function initTableData() {
    const params = {
        ...getParams(),
        shop: activeTab.value === "全部" ? null : activeTab.value,
    };

    table.value.loading = true;
    const res = await getShopDataDetail(params);
    table.value.loading = false;

    res.forEach((item, index) => {
        item.no = index + 1;
    });

    table.value.data = res;
}

/**
 * 获取表格统计数据
 */
const count = ref({
    total: 0,
    income: 0,
    expense: 0,
});
async function initTableCount() {
    const params = {
        ...getParams(),
        shop: activeTab.value === "全部" ? null : activeTab.value,
    };

    const res = await getShopData(params);
    count.value = res;
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
    console.log(window_height);
    max_height.value = window_height;
}

</script>

<style scoped lang="scss">
.row {
    display: inline-block;
    line-height: 40px;
    margin-right: 40px;
    color: #999;
    span {
        color: #333;
    }
}
</style>