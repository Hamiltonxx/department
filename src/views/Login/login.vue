<template>
    <div class="login app-container">
        <div class="mask"></div>

        <div class="login-area">
            <div class="login-form">
                <div class="title">欢迎 / welcome</div>
                <n-form
                    label-width="100"
                    :model="formModel"
                >
                    <n-form-item
                        label="手机号"
                        prop="phone"
                    >
                        <n-input
                            v-model:value="formModel.phone"
                            placeholder="请输入手机号"
                            size="large"
                            clearable
                        >
                            <template #prefix>
                                <n-icon :component="CallOutline" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-form-item
                        label="验证码"
                        prop="code"
                    >
                        <n-input
                            v-model:value="formModel.code"
                            placeholder="请输入验证码"
                            style="width: 195px; margin-right: 20px;"
                            size="large"
                            clearable
                        >
                            <template #prefix>
                                <n-icon :component="AppsOutline" />
                            </template>
                        </n-input>

                        <n-button
                            type="primary"
                            secondary
                            size="large"
                            :disabled="codeDisabled"
                            style="width: 195px;"
                            @click="handleGetCode"
                        >
                            {{ codeText }}
                        </n-button>
                    </n-form-item>
                </n-form>

                <n-button 
                    class="submit"
                    type="primary"
                    size="large"
                    :loading="loading"
                    @click="handleSubmit"
                >
                    登录
                </n-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { NForm, NFormItem, NInput, NButton, NIcon, useMessage } from "naive-ui";
import { CallOutline, AppsOutline } from "@vicons/ionicons5";
import { useRouter } from "vue-router";

const message = useMessage();
const router = useRouter();

// 登录表单
const formModel = ref({
    phone: null,
    code: null,
});
// 倒计时时间
const sum = ref(60);
// 获取验证码文本
const codeText = ref("获取验证码");
// 获取验证码按钮的禁用状态
const codeDisabled = ref(false);
// 登录加载状态
const loading = ref(false);


let timer = null;
function handleGetCode() {
    if (!checkPhoneNumber(formModel.value.phone)) {
        return message.error("请填写正确的手机号");
    }

    codeDisabled.value = true;

    timer = setInterval(() => {
        sum.value--;
        if (sum.value == 0) {
            codeText.value = "获取验证码";
            codeDisabled.value = false;
            return clearInterval(timer);
        }
        codeText.value = `${ sum.value }后重新发送`;
    }, 1000);

    sendGetCodeRequest();
}

function handleSubmit() {
    const { phone, code } = formModel.value;

    if (!phone || !code) return message.error("请填写手机号或验证码后登录");

    loading.value = true;

    setTimeout(() => {
        loading.value = false;

        router.push({ name: "DataCenter" });
    }, 2000);
}

function sendGetCodeRequest() {
    // ...
    message.success("验证码已发送");
}

function checkPhoneNumber(phone) {
    if (!phone) return false;

    if (isNaN(Number(phone))) return false;

    if (phone.charAt(0) != 1) return false;

    if (phone.length != 11) return false;

    return true;
}
</script>

<style scoped lang="scss">
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: url(../../assets/images/login.jpeg) no-repeat;
    background-size: cover;
    background-position: center center;
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
    }
    .login-area {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: flex-end;
        width: 700px;
        height: 400px;
        border-radius: var(--root-radius);
        box-shadow: 0 0 15px rgba(0,0,0,.5);
        overflow: hidden;
        .login-form {
            width: 70%;
            height: 100%;
            background-color: #fff;
            padding: calc(var(--root-padding-default) * 2);
            box-sizing: border-box;
        }
        .title {
            display: flex;
            justify-content: center;
            font-size: var(--root-font-size-super);
            letter-spacing: 3px;
            margin-bottom: var(--root-padding-default);
        }
        .submit {
            width: 100%;
            margin-top: var(--root-padding-default);
        }
    }
}
</style>