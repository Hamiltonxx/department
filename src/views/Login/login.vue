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
                        label="密码"
                        prop="code"
                    >
                        <n-input 
                            type="password"
                            show-password-on="mousedown"
                            placeholder="请输入密码"
                            v-model:value="formModel.pwd"
                        >
                            <template #prefix>
                                <n-icon :component="LockClosedOutline" />
                            </template>
                        </n-input>  
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
import { CallOutline, LockClosedOutline } from "@vicons/ionicons5";
import { useRouter } from "vue-router";
import { login } from "@/api/login";

const message = useMessage();
const router = useRouter();

// 登录表单
const formModel = ref({
    phone: null,
    pwd: null,
});

// 登录加载状态
const loading = ref(false);

async function handleSubmit() {
    const { phone, pwd } = formModel.value;

    if (!phone || !pwd) return message.error("请填写账号和密码后登录");

    loading.value = true;
    const res = await login({ phone, password: pwd });
    loading.value = false;

    if (!Object.keys(res).length) return message.error("登录失败，请检查账号和密码");

    message.success("登录成功");

    // 登录成功后跳转到首页
    switch (res.role) {
        case "datacenter":
            router.push("/data-center");
            break;
        case "finance":
            router.push("/finance/check-accounts");
            break;
        default:
            router.push("/data-center");
    }

    // 保存登录信息
    sessionStorage.setItem("userInfo", JSON.stringify(res));
}
</script>

<style scoped lang="scss">
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: url(../../assets/images/login.jpg) no-repeat;
    background-size: cover;
    background-position: center center;
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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