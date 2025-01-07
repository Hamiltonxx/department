<template>
    <div class="page-container">
        <!--内容-->
        <div class="page-content">
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
import {NIcon, NButton, NDataTable, NPagination} from "naive-ui";
import {CloudUpload} from "@vicons/ionicons5";
import CustomUploadFile from "@/components/upload-file";
import {getData as getDataApi} from "@/api/check-accounts";
import { formatDate } from "@/lib/date-transformer";

onBeforeMount(() => {
    init()
});

onMounted(() => {
   getMaxHeight();
});

// 显示上传组件
const showUploader = ref(false);

function handleShowUploader() {
    showUploader.value = true;
}

// 初始化
function init() {
    getData();
}

const columns = [
    {
        title: "序号",
        key: "no",
        width: 60,
    },
    {
        title: "来源",
        key: "source",
        width: 100,
    },
    {
        title: "流水号",
        key: "serialno",
        width: 200,
    },
    {
        title: "门店名称",
        key: "shop",
    },
    {
        title: "楼栋",
        key: "building"
    },
    {
        title: "门牌号",
        key: "doorno",
    },
    {
        title: "类别",
        key: "category",
    },
    {
        title: "标记",
        key: "tag",
    },
    {
        title: "实际金额",
        key: "actual_amount",
    },
    {
        title: "承租人",
        key: "renter",
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

    table.value.loading = true;
    const res = await getDataApi({current, size});
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
    let window_height = document.documentElement.clientHeight;
    let window_width = document.documentElement.clientWidth;

    window_height = window_height - 60 - 32 - 184;
    window_width = window_width - 250 - 32 - 32;

    max_height.value = window_height;
    max_width.value = window_width;
}
</script>

<style lang="scss" scoped>
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