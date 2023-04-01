<!-- 在登录状态下修改密码 -->
<template>
    <div id="displayRange">
        <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout"
            @finish="handleFinish" @validate="handleValidate" @finishFailed="handleFinishFailed">

            <a-form-item has-feedback label="旧密码" name="oldPass">
                <a-input v-model:value="formState.oldPassword" type="password" autocomplete="off" placeholder="请输入旧密码" />
            </a-form-item>

            <!-- type="password" 会自动禁止输入奇奇怪怪的字符的 -->
            <a-form-item has-feedback label="设置新密码" name="pass">
                <a-input v-model:value="formState.pass" type="password" autocomplete="off"
                    placeholder="8-18个字符，必须含有小写字母和数字" />
            </a-form-item>

            <a-form-item has-feedback label="确认新密码" name="checkPass">
                <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" placeholder="确认新密码" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" html-type="submit" :loading="uploading" @click="reset">{{ uploading ? '修改中' :
                    '修改密码' }}</a-button>
                <a-button style="margin-left: 10px" :disabled="uploading" @click="resetForm">重置</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { defineComponent, reactive, ref, onBeforeMount } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import showErrorModal from '../../common/showErrorModal';
import changePasswordWithJWT from '@/api/identityAPIs/changePasswordWithJWT';
import Overlay from '@/components/Overlay.vue';
import showModalAndJump from '@/common/showModalAndJump';
import checkLoginStatusAndJumpToLoginPageIf401 from '@/common/checkLoginStatusAndJumpToLoginPageIf401';


interface FormState {
    oldPassword: string;
    pass: string;
    checkPass: string;
}
export default defineComponent({
    components: {
        Overlay,
    },
    setup() {
        onBeforeMount(() => {
            checkLoginStatusAndJumpToLoginPageIf401()
        })

        const formRef = ref<FormInstance>();
        const formState = reactive<FormState>({
            oldPassword: '',
            pass: '',
            checkPass: '',
        });
        const uploading = ref(false)

        const reset = () => {
            if (formState.oldPassword.length === 0) {
                showErrorModal('旧密码不得为空')
                return
            }
            uploading.value = true
            changePasswordWithJWT(formState.oldPassword, formState.pass)
                .then(response => {
                    uploading.value = false
                    showModalAndJump(true, '/login', '登录成功', '登录界面', '去登录')
                })
                .catch(error => {
                    uploading.value = false
                    showErrorModal(`${error.response.status}：${error.response.data}`)
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
            checkPass: [{ required: true, validator: validatePass2, trigger: 'change' }],
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
            formState.oldPassword = '';
        };
        const handleValidate = (...args: any[]) => {
            console.log(args);
        };
        return {
            formState,
            formRef,
            rules,
            layout,
            uploading,
            handleFinishFailed,
            handleFinish,
            resetForm,
            handleValidate,
            reset,
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
  