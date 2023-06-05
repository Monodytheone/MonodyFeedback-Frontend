<template>
    <div v-title data-title="管理员登录 - MonodyFeedback"></div>
    <div id="displayRange">
        <p id="title"><van-icon name="records" /> 管理员登录 <span id="subtitle">-- MonodyFeedback</span></p>
        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input v-model:value="formState.username" autofocus />
            </a-form-item>

            <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button id="button" type="primary" html-type="submit" :loading="uploading">{{ uploading ? '登录中' : '登录'
                }}</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { postLogin } from '@/api/identityAPIs/postLogin';
import getMasterInfo from '@/api/identityAPIs/getMasterInfo';
import showErrorModal from '../../common/showErrorModal';
import showModalAndJump from '@/common/showModalAndJump';

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
        const githubLink = process.env.VUE_APP_GITHUB_LINK
        const uploading = ref(false)
        const onFinish = (values: any) => {
            uploading.value = true
            postLogin(formState.username, formState.password)
                .then((response) => {
                    localStorage.setItem("masterJWT", response.data);
                    checkRole()
                })
                .catch(error => {
                    uploading.value = false
                    if (error.response.status == 423) {
                        showErrorModal('账号被锁定，请联系管理员')

                        return
                    }
                    showErrorModal(error.response.data)  // 弹出失败提示框
                })
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };

        /** 检查登录的是否是处理者账户 */
        const checkRole = () => {
            getMasterInfo()
                .then(response => {
                    showModalAndJump(true, '/master', '登录成功', '管理员主页', '确定')
                })
                .catch(error => {
                    uploading.value = false
                    localStorage.removeItem("masterJWT")
                    if (error.response.status == 403) {
                        showErrorModal('请使用管理员账号登录')
                    }
                    else if (error.response.status == 401) {
                        showErrorModal('登录失败')
                    }
                    else {
                        showErrorModal(`${error.response.status}：${error.response.data}`)
                    }
                })
        }
        return {
            githubLink,
            formState,
            uploading,
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

#title {
    font-size: 40px;
    margin-left: -135px;
    margin-bottom: 40px;
    width: 700px;
}

#subtitle {
    font-size: 20px;
}

a {
    margin-left: 80px;
}

#button {
    margin-top: 20px;
}
</style>
  
  