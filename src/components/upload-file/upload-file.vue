<template>
    <n-modal v-model:show="show">
        <div class="upload-file">
            <!--头部-->
            <div class="upload-file-header">
                <div class="upload-file-title">上传文件</div>
                <n-button
                    size="tiny"
                    type="tertiary"
                    @click="handleClose"
                >
                    <template #icon><Close /></template>
                </n-button>
            </div>

            <!--内容区域-->
            <div class="upload-file-content">
                <n-form
                    :model="formModel"
                    label-width="100"
                >
                    <n-form-item label="类型" path="type">
                        <n-select v-model:value="formModel.type" :options="fileTypeOptions" />
                    </n-form-item>

                    <n-form-item label="文件">
                        <n-upload
                            ref="upload"
                            :default-upload="false"
                            multiple
                            @change="handleFileChanged"
                        >
                            <n-button type="primary">
                                <template #icon>
                                    <n-icon>
                                        <cloud-upload/>
                                    </n-icon>
                                </template>
                                点击上传
                            </n-button>
                        </n-upload>
                    </n-form-item>
                </n-form>
            </div>
            <!--底部按钮-->
            <div class="upload-file-footer">
                <n-space>
                    <n-button @click="handleCancel">
                        取消
                    </n-button>
                    <n-button
                        type="primary"
                        :disabled="submitDisabled"
                        :loading="loading"
                        @click="handleSubmit"
                    >
                        提交
                    </n-button>
                </n-space>
            </div>
        </div>
    </n-modal>
</template>

<script setup>
import {NModal, NForm, NFormItem, NSelect, NUpload, NSpace, NIcon} from "naive-ui";
import {computed, ref, onBeforeMount, shallowRef} from "vue";
import { NButton, useMessage } from "naive-ui";
import {CloudUpload, Close} from "@vicons/ionicons5";
import { FileType } from "@/enums/fileType";
import { uploadForBk, uploadForQFT } from "@/api/upload";

const message = useMessage();

onBeforeMount(() => {
    initModel();
});

const emits = defineEmits(["update:value"]);
const props = defineProps({
   value: {
       type: Boolean,
       default: false,
   }
});

// modal 开关
const show = computed({
   get() {
       return props.value;
   },
   set(val) {
       emits("update:value", val);

       if (!val) initModel();
   }
});

// 文件格式
const fileTypeOptions = computed(() => {
   let result = [];

   Object.entries(FileType.map).forEach(([value, key]) => {
       result.push({ label: key, value });
   });

   return result;
});

// 点击关闭弹框
function handleClose() {
    show.value = false;
}

// 初始化参数
const formModel = ref();
function initModel() {
    formModel.value = {
        type: null,
        files: []
    };

    loading.value = false;
    fileList.value = [];
    submitDisabled.value = true;
}

const upload = shallowRef();
const submitDisabled = ref(true);
// 已选择上传
function handleFileChanged({ fileList: files }) {
    submitDisabled.value = files.length === 0;

    fileList.value = files;
}

// 取消
function handleCancel() {
    show.value = false;
}

// 提交
const fileList = ref([]);
const loading = ref(false);
function handleSubmit() {
    if (!formModel.value.type) return message.error("请选择文件类型");

    loading.value = true;

    const promiseList = [];
    fileList.value.forEach(file => {
        promiseList.push(new Promise(async resolve => {
            const formdata = new FormData();
            formdata.append("file", file.file);

            const requestFn =
                Number(formModel.value.type) === FileType.enum.bk
                    ? uploadForBk
                    : uploadForQFT;

            let result = null;

            try {
                result = await requestFn(formdata);
            } catch(e) {
                message.error("文件上传错误，请确认文件类型");
                loading.value = false;
            }

            resolve(result);
       }));
    });

    Promise
        .all(promiseList)
        .then(res => {
            const r = res.filter(r => r !== "done");

            if (r.length) return ;

            loading.value = false;
            show.value = false;
            message.success("文件上传成功");
        })
        .catch(err => {
            console.log("文件上传错误");
            console.log(err);
            loading.value = false;
        });
}
</script>

<style scoped lang="scss">
.upload-file {
    width: 600px;
    height: 400px;
    background-color: #fff;
    border-radius: var(--root-radius);
    padding: var(--root-padding-default);
    .upload-file-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .upload-file-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: var(--root-font-size-medium);
            &:before {
                content: "";
                display: inline-block;
                width: 4px;
                margin-right: 5px;
                height: var(--root-font-size-medium);
                background-color: var(--root-color);
                border-radius: 2px;
            }
        }
    }
    .upload-file-content {
        height: 320px;
        overflow: auto;
        margin-top: var(--root-padding-default);
    }
    .upload-file-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 50px;
    }
}
</style>