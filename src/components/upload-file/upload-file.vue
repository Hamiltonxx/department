<template>
    <div class="custom-upload-file">
        <span
            v-if="!props.obj"
            class="upload-button"
            @click="handleUpload"
        >
            上传
        </span>

        <span
            v-else
            class="file-name"
        >
            {{ props.obj }}
        </span>
    </div>
</template>

<script setup>

const props = defineProps(["obj"]);

function handleUpload() {
    console.log("click upload");
}
</script>

<style scoped lang="scss">
.custom-upload-file {
    .upload-button {
        color: var(--root-color);
        text-decoration: underline;
    }
    .file-name {

    }
}
</style>