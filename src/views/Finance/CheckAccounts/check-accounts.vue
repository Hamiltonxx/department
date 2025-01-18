<template>
    <div class="page-container">
        <!-- 条件 -->
        <div class="page-search">
            <div class="page-title">查询条件</div>

            <div class="page-search-content">
                <n-form
                    :model="searchParams"
                    inline
                    label-placement="left"
                    :show-feedback="false"
                    style="flex-wrap: wrap;gap: 16px"
                >
                    <n-form-item label="时间选择">
                        <n-date-picker
                            v-model:value="searchParams.date"
                            type="daterange"
                            clearable
                            class="page-search-content__item"
                        />
                    </n-form-item>
                    <n-form-item label="来源">
                        <n-select 
                            v-model:value="searchParams.source" 
                            :options="sourceOptions" 
                            class="page-search-content__item"
                        />
                    </n-form-item>
                    <n-form-item label="门店名称">
                        <n-input
                            v-model:value="searchParams.shop"
                            placeholder="请输入门店名称"
                            clearable
                            class="page-search-content__item"
                        />
                    </n-form-item>
                    <br />
                    <n-form-item label="公司主体">
                        <n-input
                            v-model:value="searchParams.signcompany"
                            placeholder="请输入公司主体"
                            clearable
                            class="page-search-content__item"
                        />
                    </n-form-item>
                    <n-form-item label="支付方式">
                        <n-input
                            v-model:value="searchParams.channel"
                            placeholder="请输入支付方式"
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

        <!--内容-->
        <div class="page-content" style="margin-top: 16px;">
            <div class="page-title">
                数据列表
                <n-button
                    class="uploader-btn"
                    type="primary"
                    @click="handleShowUploader"
                >
                    <template #icon>
                        <n-icon>
                            <cloud-upload/>
                        </n-icon>
                    </template>
                    上传文件
                </n-button>
            </div>

            <n-data-table
                :columns="columns"
                :data="table.data"
                :max-height="max_height"
                :scroll-x="max_width"
                :loading="table.loading"
            />

            <div class="page-footer">
                <n-pagination
                    v-model:page="table.current"
                    :page-count="table.total"
                    @update:page="handleChangePage"
                />
            </div>
        </div>

        <!--上传弹框-->
        <custom-upload-file
            v-model:value="showUploader"
            @success="handleUploadSuccess"
        />
    </div>
</template>

<script setup>
import {ref, onBeforeMount, onMounted} from "vue";
import {NSpace, NInput, NForm, NFormItem, NDatePicker, NSelect, NIcon, NButton, NDataTable, NPagination} from "naive-ui";
import {CloudUpload, RefreshOutline, SearchOutline} from "@vicons/ionicons5";
import CustomUploadFile from "@/components/upload-file";
import {getData as getDataApi} from "@/api/check-accounts";
import { formatDate } from "@/lib/date-transformer";

onBeforeMount(() => {
    init()
});

onMounted(() => {
   getMaxHeight();
});

const searchParams = ref(null);
const sourceOptions = ref([
    { label: "全部", value: "全部", },
    { label: "全房通", value: "全房通" },
    { label: "贝壳", value: "贝壳" },
]);

// 显示上传组件
const showUploader = ref(false);

function handleShowUploader() {
    showUploader.value = true;
}

// 初始化
function init() {
    initSearchParams();
    getData();
}


function handleReset() {
    table.value.current = 1;
    initSearchParams();

    handleSearch();
}

function handleSearch() {
    getData();
}


const columns = [
    {
        title: "序号",
        key: "no",
        width: 60,
        fixed: 'left',
    },
    {
        title: "流水号",
        key: "serialno",
        width: 200,
    },
    {
        title: "来源",
        key: "source",
        width: 70,
    },
    {
        title: "公司主体",
        key: "signcompany",
        width: 200,
    },
    {
        title: "门店名称",
        key: "shop",
        width: 100,
    },
    {
        title: "楼栋",
        key: "building",
        width: 80,
    },
    {
        title: "门牌号",
        key: "doorno",
        width: 100,
    },
    {
        title: "类别",
        key: "category",
        width: 100,
    },
    {
        title: "标记",
        key: "tag",
        width: 60,
    },
    {
        title: "实际金额",
        key: "actual_amount",
        width: 100,
    },
    {
        title: "支付方式",
        key: "channel",
        width: 100,
    },
    {
        title: "承租人",
        key: "renter",
        width: 100,
    },
    {
        title: "交易时间",
        key: "paytime",
        render: item => {
            return formatDate(item.paytime, 'datetime');
        },
        width: 200,
    }
];

// 表格相关
const table = ref({
    current: 1,
    size: 100,
    loading: false,
    data: [],
    total: 0,
});

// 获取数据
async function getData() {
    const {current, size} = table.value;
    const { date, shop, source, signcompany, channel } = searchParams.value;

    let params = {
        shop, signcompany, channel,
        source: source === "全部" ? null : source, 
    };

    if (date) {
        params.startdate = formatDate(new Date(date[0])) + ' 00:00:00';
        params.enddate = formatDate(new Date(date[1])) + ' 23:59:59';
    }

    table.value.loading = true;
    const res = await getDataApi({current, size}, params);
    table.value.loading = false;

    res.data.forEach((item, index) => {
        item.no = index + 1;
    });

    table.value.data = res.data;
    table.value.total = Math.ceil(res.total / table.value.size);
}

function handleChangePage(page) {
    table.value.current = page;

    getData();
}

// 上传成功
function handleUploadSuccess() {
    table.value.current = 1;

    getData();
}

const max_height = ref(0);
const max_width = ref(0);
function getMaxHeight() {
    let { clientHeight: window_height, clientWidth: window_width } = document.documentElement;

    window_height = window_height - 60 - 32 - 344;
    window_width = window_width - 314;

    max_width.value = window_width;
    max_height.value = window_height;
}

// 初始化查询条件
function initSearchParams() {
    searchParams.value = {
        date: null,
        shop: null,
        source: "全部",
        signcompany: null,
        channel: null,
    };
}

</script>

<style lang="scss" scoped>
.page-search-content__item {
    flex-shrink: 0;
    width: 150px;
}
.page-search-content {
    align-items: flex-start !important;
}
.page-content {
    margin-top: 0;
    .page-title {
        position: relative;

        .uploader-btn {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
}
</style>