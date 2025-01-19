<template>
    <n-data-table
        :columns="columns"
        :data="table.data"
        :loading="table.loading"
    />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getData } from '@/api/pay-way';

onBeforeMount(() => {
    initTableData();
});

const columns = ref([
    {
        title: '项目',
        key: 'pay_way',
    },
    {
        title: '收支原因',
        key: 'pay_way_name',
    },
    {
        title: '收入',
        key: 'pay_way_desc',
    },
    {
        title: '支出',
        key: 'status',
    },
    {
        title: '总计',
        key: 'action',
        fixed: 'right',
        width: 100,
    },
]);

const table = ref({
    data: [],
    loading: false,
});

function initTableData() {
    table.value.loading = true;
    getData().then((res) => {
        console.log(res);
        table.value.data = res.data;
        table.value.loading = false;
    });
}   
</script>