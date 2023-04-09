<!-- 提交反馈页面 -- 本页面的输入校验是自己写的，没有用现成的组件改 -->
<template>
    <div v-title data-title="提交反馈 - Monody Feedback"></div>
    <div class="border-submitPage">
        <BackToHome />

        <div id="topBox" class="feedbackBox">
            <label for="problemInput">问题描述</label>
            <textarea id="problemInput" type="text" placeholder="请详细描述问题的细节（字数不少于10字）..." v-model="problemDescription"
                autofocus="true" maxlength="1000"></textarea>
            <p class="warnText" v-if="problemDescWarnIsShow">Warning: 字数不得少于10字（最多1000字）</p>
            <div class="clearfix"></div>
        </div>

        <div class="feedbackBox">
            <label for="email">邮箱地址</label>
            <input id="email" type="text" placeholder="请输入邮箱（选填）" v-model="email" />
            <p class="warnText" v-if="emailWarnIsShow">Warning: 邮箱填写错误</p>
            <div class="clearfix"></div>
        </div>

        <div class="feedbackBox">
            <label for="tel">手机号码</label>
            <input id="tel" type="text" placeholder="请输入手机号码（选填）" v-model="telNumber" />
            <p class="warnText" v-if="telWarnIsShow">Warning: 手机号格式不正确</p>
            <div class="clearfix"></div>
        </div>

        <div class="feedbackBox">
            <label>图片上传<span id="imgUploadTip">（最多上传10张图片，10MB以下）</span></label>
            <Pics ref="pics" :continueSubmit="continueSubmit" />
            <div class="clearfix"></div>
        </div>

        <hr>
        <div style="height: 500px;"></div>

        <a-button id="submitButton" type="primary" @click="submit">提交</a-button>
    </div>

    <!-- 遮罩层: -->
    <Overlay :isShow="overlayIsShow" :message="'提交中...'" />
</template>


<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount } from 'vue';
import Pics from './components/Pics.vue';
import BackToHome from './components/BackToHome.vue';
import showErrorModal from '../../common/showErrorModal';
import showModalAndJump from '@/common/showModalAndJump';
import { postSubmit } from '@/api/submitAPIs/postSubmit';
import PictureInfo from '@/types/PictureInfo';
import Overlay from '@/components/Overlay.vue';
import checkLoginStatusAndJumpToLoginPageIf401 from '@/common/checkLoginStatusAndJumpToLoginPageIf401';

export default defineComponent({
    name: 'SubmitPage',
    components: {
        Pics,
        BackToHome,
        Overlay,
    },
    setup() {
        checkLoginStatusAndJumpToLoginPageIf401();

        const problemDescription = ref('')
        const email = ref('')
        const telNumber = ref('')
        const pics = ref<InstanceType<typeof Pics>>(); // 这么写有提示
        const overlayIsShow = ref(false)  // 遮罩层是否显示

        function test_showDescription() {
            console.log(problemDescription.value, email.value, telNumber.value)
        }

        // 校验问题描述输入框的字数是否小于10，是则警告，必须在框内输入过内容之后才能触发
        const problemDescWarnIsShow = ref(false)
        watch(problemDescription, () => {
            if (problemDescription.value.length <= 10) {
                document.getElementById('problemInput')?.classList.add('warningInput');
                problemDescWarnIsShow.value = true;
            }
            else {
                document.getElementById('problemInput')?.classList.remove('warningInput');
                problemDescWarnIsShow.value = false;
            }
        })

        // 校验邮箱格式
        const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const emailWarnIsShow = ref(false)
        watch(email, () => {
            if (email.value.length != 0 && emailRegex.test(email.value) === false) {
                document.getElementById('email')?.classList.add('warningInput');
                emailWarnIsShow.value = true
            }
            else {
                document.getElementById('email')?.classList.remove('warningInput');
                emailWarnIsShow.value = false;
            }
        })

        // 校验手机号格式
        const telRegex = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        const telWarnIsShow = ref(false)
        watch(telNumber, () => {
            if (telNumber.value.length != 0 && telRegex.test(telNumber.value) == false) {
                document.getElementById('tel')?.classList.add('warningInput');
                telWarnIsShow.value = true
            }
            else {
                document.getElementById('tel')?.classList.remove('warningInput');
                telWarnIsShow.value = false
            }
        })

        const submit = () => {
            if (problemDescription.value.length > 10 && !emailWarnIsShow.value && !telWarnIsShow.value) {
                overlayIsShow.value = true  // 显示遮罩层
                pics.value?.handleUpload()  // 先调用照片墙子级组件的方法，上传图片
            }
            else {
                showErrorModal('请确保问题描述不少于10个字，并确保邮箱和手机号格式正确')
            }
        }

        /** 用于上传图片成功之后，向后端提交Submission */
        const continueSubmit = (pictureInfos: PictureInfo[]) => {
            postSubmit(telNumber.value, email.value, problemDescription.value, pictureInfos)
                .then(response => {
                    overlayIsShow.value = false
                    showModalAndJump(true, '/progress', '提交成功', '服务进度页面', '确定')
                })
                .catch(error => {
                    overlayIsShow.value = false
                    if (error.response.status == 403) {
                        showErrorModal('您的账号不可以提交反馈哦~')
                    }
                    else {
                        showErrorModal(`${error.response.status}： ${error.response.data}`)  // 后端会根据环境的不同来进行错误响应信息的详略
                    }
                })
        }

        return {
            problemDescription, email, telNumber,
            problemDescWarnIsShow, emailWarnIsShow, telWarnIsShow,
            pics, overlayIsShow,
            test_showDescription, submit, continueSubmit,
        }
    }
})
</script>
<style>
/* 显示范围 */
.border-submitPage {
    width: 350px;
    margin: auto;
    margin-top: 50px;
}


.feedbackBox {
    margin: 20px 0;
}

/* 所有反馈块中的标题靠左加粗 */
label {
    float: left;
    font-weight: bold;
}

/* 所有输入框宽度占border的100% */
textarea {
    width: 100%;
    height: 100px;
    margin: 5px 0;
    border-radius: 5px;
}

input {
    width: 100%;
    padding: 0.3em 0.5em;
    margin: 5px 0;
    border: 1px grey solid;
    border-radius: 5px;
}

#imgUploadTip {
    font-weight: lighter;
    color: darkgray;
}

.clearfix {
    clear: both;
}

#uploader {
    float: left;
    margin: 20px 0;
}

#submitButton {
    position: fixed;
    /* padding: 0.3vh 80px; */
    bottom: 20px;
    right: 48%;
    background-color: #393b40;
    color: #f4d8a8;
    border: none;
    border-radius: 0.5vh;
}

/* 输入数据不合格式时黄色边框警告 */
.warningInput {
    border: 1px #dcbc60 solid;
}

.warnText {
    float: left;
    font-size: 12px;
    color: #dcbc60;
}
</style>