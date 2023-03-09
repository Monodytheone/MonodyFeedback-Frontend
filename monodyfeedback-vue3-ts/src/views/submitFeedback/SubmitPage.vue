<template>
    <div class="border-submitPage">
        <BackToHome/>
        
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
            <label>图片上传<span id="imgUploadTip">（最多上传20张图片，10MB以下）</span></label>
            <Pics id="uploader" />
            <div class="clearfix"></div>
        </div>

        <hr>
        <a-button id="submitButton" type="primary" @click="test_showDescription">测试--打印信息</a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import Pics from './components/Pics.vue';
import BackToHome from './components/BackToHome.vue';
export default defineComponent({
    name: 'SubmitPage',
    components: {
        Pics,
        BackToHome,
    },
    setup() {
        const problemDescription = ref('')
        const email = ref('')
        const telNumber = ref('')

        function test_showDescription() {
            console.log(problemDescription.value, email.value, telNumber.value)
        }

        const fileList = ref([
            { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
            // Uploader 根据文件后缀来判断是否为图片文件
            // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
            { url: 'https://cloud-image', isImage: true },
        ]);

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

        // 校验手机号格式：以'1'开头且为11位数字
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

        return {
            problemDescription, email, telNumber, fileList,
            problemDescWarnIsShow, emailWarnIsShow, telWarnIsShow,
            test_showDescription,
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
    /* height: 2em; */
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
    /* margin: 30px 0; */
    position: fixed;
    bottom: 20px;
    right: 45%;
}

/* 输入数据不合格式时黄色边框警告 */
.warningInput {
    /* border: 3px rgba(209, 209, 23, 0.952) solid; */
    border: 2px #d9df5b solid;
}

.warnText {
    float: left;
    font-size: 12px;
    /* color: #A67D3D; */
    color: #b4ba40;
}
</style>