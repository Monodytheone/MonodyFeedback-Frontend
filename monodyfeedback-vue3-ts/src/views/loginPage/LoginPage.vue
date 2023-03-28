<template>
    <div id="displayRange">
        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <p id="registerNow">没有账号？ <router-link to="/signUp">立即注册</router-link></p>


            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button type="primary" html-type="submit">登录</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, onBeforeMount, getCurrentInstance } from 'vue';
import { postLogin } from '@/api/identityAPIs/postLogin'
import showErrorModal from '../../common/showErrorModal';
import showSuccessModal from './showSuccessModal'

interface FormState {
    username: string;
    password: string;
}
export default defineComponent({
    setup() {
        const formState = reactive<FormState>({
            username: '',
            password: '',
        });

        const onFinish = (values: any) => {
            postLogin(formState.username, formState.password)
                .then((response) => {
                    localStorage.setItem("jwt", response.data);
                    showSuccessModal()  // 弹出登录成功跳转提示框
                })
                .catch(error => {
                    showErrorModal(error.response.data)  // 弹出失败提示框
                })
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        return {
            formState,
            onFinish,
            onFinishFailed,
        };
    },
});
</script>
<style scoped>
#displayRange {
    margin: auto;
    margin-top: 100px;
    margin-right: 40%;
    width: 350px;
}

#registerNow {
    position: relative;
    left: 50px;
}
</style>
  
  