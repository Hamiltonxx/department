<template>
    <div class="page-container">
        <div class="page-content" style="margin-top: 0">
            <div class="page-title">数据列表</div>

            <n-table :single-line="false">
                <thead>
                <tr>
                    <th>匹配时间</th>
                    <th>账单所属时间段</th>
                    <th>生成凭证</th>
                    <th>匹配结果</th>
                    <th>操作人</th>
                    <th>上传文件详情</th>
                </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in table.data"
                        :key="index"
                    >
                        <td>{{ item.time }}</td>
                        <td>{{ item.range }}</td>
                        <td>{{ item.p }}</td>
                        <td>{{ item.result }}</td>
                        <td>{{ item.username }}</td>
                        <td><span class="result" @click="handleDetail(item.id)">查看结果</span></td>
                    </tr>
                </tbody>
            </n-table>

            <n-pagination
                v-model:page="table.current"
                :page-count="table.total"
                class="page-content-pagination"
            />
        </div>
    </div>
</template>

<script setup>
import { NTable, NPagination } from "naive-ui";
import { ref } from "vue";

const table = ref({
    current: 1,
    total: 0,
    loading: false,
    data: [],
    size: 10,
});

init();

function handleDetail(id) {
    console.log(id);
}

function init() {
    getData();
}

function getData() {
    const { current, size } = table.value;

    table.value.loading = true;
    setTimeout(() => {
        table.value.loading = false;

        table.value.total = 52;
        table.value.data = [{
            time: "2024-12-13 17:22:01",
            range: "2024-12-13 17:22:01 ~ 2024-12-14 17:22:01",
            p: "完成",
            result: "成功",
            username: "力王",
            id: 2,
        }];
    }, 2000);
}
</script>

<style scoped lang="scss">
.result {
    color: var(--root-color);
    text-decoration: underline;
}
</style>