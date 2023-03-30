<template>
    <div v-title data-title="处理者登录 - 反馈处理:MonodyFeedback"></div>
    <div id="displayRange">
        <p id="title"><van-icon name="records" /> 反馈处理 <span id="subtitle">-- MonodyFeedback</span></p>
        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a href="https://github.com/Monodytheone/MonodyFeedback-Backend" target="_blank">前往项目GitHub主页，获取试用处理者账号</a>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button id="button" type="primary" html-type="submit" :loading="uploading">{{ uploading ? '登录中' : '登录' }}</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, onBeforeMount, getCurrentInstance } from 'vue';
import { postLogin } from '@/api/identityAPIs/postLogin';
import getProcessorInfo from '@/api/identityAPIs/getProcessorInfo';
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
        const uploading = ref(false)
        const onFinish = (values: any) => {
            uploading.value = true
            postLogin(formState.username, formState.password)
                .then((response) => {
                    localStorage.setItem("processorJWT", response.data);
                    checkRole()
                })
                .catch(error => {
                    uploading.value = false
                    if(error.response.status == 423) {
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
            getProcessorInfo()
                .then(response => {
                    showModalAndJump(true, '', '登录成功', '处理者主页', '确定')                    
                })
                .catch(error => {
                    uploading.value = false
                    localStorage.removeItem("processorJWT")
                    if(error.response.status == 403) {
                        showErrorModal('请使用处理者账号登录')
                    }
                    else if(error.response.status == 401) {
                        showErrorModal('登录失败')
                    }
                    else {
                        showErrorModal(`${error.response.status}：${error.response.data}:::`)
                    }
                })
        }
        return {
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

#button{
    margin-top: 20px;
}

</style>
  
  