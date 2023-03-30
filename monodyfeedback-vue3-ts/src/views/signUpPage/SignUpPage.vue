<template>
    <div v-title data-title="注册 - Monody Feedback"></div>
    <div id="displayRange">
        <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout"
            @finish="handleFinish" @validate="handleValidate" @finishFailed="handleFinishFailed">
            <a-form-item id="userName" has-feedback label="用户名" name="username">
                <a-input v-model:value="formState.userName" type="text" autocomplete="off" placeholder="3-18个字符" />
            </a-form-item>

            <!-- type="password" 会自动禁止输入奇奇怪怪的字符的 -->
            <a-form-item has-feedback label="密码" name="pass">
                <a-input v-model:value="formState.pass" type="password" autocomplete="off"
                    placeholder="8-18个字符，必须含有小写字母和数字" />
            </a-form-item>

            <a-form-item has-feedback label="确认密码" name="checkPass">
                <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" placeholder="确认密码" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" html-type="submit" @click="handleSignUp">注册</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
            </a-form-item>
        </a-form>
    </div>

    <!-- 遮罩层: -->
    <Overlay :isShow="overlayIsShow" :message="'注册中...'"/>
</template>
<script lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { defineComponent, reactive, ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import checkUserNameUsability from '@/api/identityAPIs/checkUserNameUsability';
import signUp from '@/api/identityAPIs/signUp';
import showSignUpSuccessModalAndJumpToLoginPage from './showSignUpSuccessModalAndJumpToLoginPage.ts';
import showErrorModal from '../../common/showErrorModal';
import Overlay from '@/components/Overlay.vue';


interface FormState {
    userName: string;
    pass: string;
    checkPass: string;
}
export default defineComponent({
    components: {
        Overlay,
    },
    setup() {
        const formRef = ref<FormInstance>();
        const formState = reactive<FormState>({
            userName: '',
            pass: '',
            checkPass: '',
        });
        const overlayIsShow = ref(false)

        const handleSignUp = () => {
            overlayIsShow.value = true
            signUp(formState.userName, formState.pass)
                .then(response => {
                    overlayIsShow.value = false
                    showSignUpSuccessModalAndJumpToLoginPage()
                })
                .catch(error => {
                    overlayIsShow.value = false
                    showErrorModal(`${error.response.status}:  ${error.response.data}`)  // 后端会根据环境的不同来进行错误响应信息的详略
                })
        }

        /** 用户名校验器 */
        let validateUserName = async (_rule: Rule, value: string) => {
            if (formState.userName.length === 0) {
                return Promise.reject('请输入用户名')
            }
            else if (formState.userName.length < 3) {
                return Promise.reject('用户名长度至少为3')
            }
            else if (formState.userName.length > 18) {
                return Promise.reject('用户名长度不得大于18')
            }
            await checkUserNameUsability(formState.userName)  // 必须"等"收到响应
                .then(response => {
                    if ((response.data as boolean) === true) {
                        return Promise.resolve();
                    }
                    else {
                        return Promise.reject('用户名不可用')
                    }
                })
        }

        let validatePass = async (_rule: Rule, value: string) => {
            if (value === '') {
                return Promise.reject('密码不能为空');
            }
            else if (value.length < 8 || value.length > 18) {
                return Promise.reject('密码须为8-18个字符')
            }
            else if (/[a-z]/.test(value) === false) {
                return Promise.reject('密码必须含有小写字母')
            }
            else if (/[1-9]/.test(value) === false) {
                return Promise.reject('密码必须含有数字')
            }
            else if (/^[\x21-\x7e]+$/.test(value) === false) {// type="password" 会自动禁止输入奇奇怪怪的字符的，其实不需要校验这个，放到最后吧
                return Promise.reject('密码只能由字母、数字、英文符号组成')
            }
            else {
                if (formState.checkPass !== '') {
                    formRef.value?.validateFields('checkPass');
                }
                return Promise.resolve();
            }
        };
        let validatePass2 = async (_rule: Rule, value: string) => {
            if (value === '') {
                return Promise.reject('请确认密码');
            } else if (value !== formState.pass) {
                return Promise.reject("两次密码不相同");
            } else {
                return Promise.resolve();
            }
        };

        const rules: Record<string, Rule[]> = {
            pass: [{ required: true, validator: validatePass, trigger: 'change' }],
            checkPass: [{ validator: validatePass2, trigger: 'change' }],
            username: [{ required: true, validator: validateUserName, trigger: 'change' }],
        };
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        const handleFinish = (values: FormState) => {
            console.log(values, formState);
        };
        const handleFinishFailed = (errors: any) => {
            console.log(errors);
        };
        const resetForm = () => {
            formRef.value?.resetFields();
            formState.userName = ''
        };
        const handleValidate = (...args: any[]) => {
            console.log(args);
        };
        return {
            formState,
            formRef,
            rules,
            layout,
            overlayIsShow,
            handleFinishFailed,
            handleFinish,
            resetForm,
            handleValidate,
            handleSignUp,
        };
    },
});
</script>
<style scoped>
#displayRange {
    width: 500px;
    margin: auto;
    margin-top: 100px;
}
</style>
  