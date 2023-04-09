<template>
    <div class="displayRange">
        <div style="margin: 15px 0" />
        <a-textarea v-model:value="textContent" :maxlength="1000" :showCount="true" placeholder="输入回复内容 . . ."
            :auto-size="{ minRows: 2, maxRows: 7 }" />

        <Pics ref="pics" :submitterId="submitterId" :continueSubmit="continueSubmitReply" />

        <div class="radioGroup">
            后续处理：
            <a-radio-group v-model:value="value1" size="small">
                <a-radio-button value="a">请用户补充完善</a-radio-button>
                <a-radio-button value="b">结束问题，请用户评价</a-radio-button>
            </a-radio-group>
        </div>

        <a-button id="button" type="primary" size="default" @click="startSubmitReply">提交回复</a-button>
        <Overlay :isShow="overlayIsShow" message="回复中..." />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Pics from './Pics.vue';
import Overlay from '@/components/Overlay.vue';
import showErrorModal from '@/common/showErrorModal';
import PictureInfo from '@/types/PictureInfo';
import postProcess from '@/api/processAPIs/process';
import SubmissionStatus from '@/types/SubmissionStatus';
import showModalAndJump from '@/common/showModalAndJump';
export default defineComponent({
    props: {
        submissionId: { type: String, required: true },
        submitterId: { type: String, required: true },
    },
    components: {
        Pics,
        Overlay,
    },
    setup(props) {
        const textContent = ref<string>('');
        const value1 = ref('')
        const overlayIsShow = ref(false)
        const pics = ref<InstanceType<typeof Pics>>()

        const startSubmitReply = () => {
            if (value1.value === '') {
                showErrorModal('请选择后续处理')
                return
            }
            if (textContent.value.length < 5) {
                showErrorModal('请输入至少五个字符')
                return
            }
            overlayIsShow.value = true
            pics.value?.handleUpload()  // 先调用照片墙子级组件的方法，上传图片
        }

        const continueSubmitReply = (pictureInfos: PictureInfo[]) => {
            postProcess(props.submissionId, value1.value === 'a' ? SubmissionStatus.toBeSupplemented : SubmissionStatus.toBeEvaluated,
                textContent.value, pictureInfos)
                .then(response => {
                    overlayIsShow.value = false
                    showModalAndJump(true, '/processor/problems', '处理成功', '待处理列表', '确认')
                })
                .catch(error => {
                    overlayIsShow.value = false
                    showErrorModal(`${error.response.status}： ${error.response.data}`)
                })
        }

        return {
            textContent,
            value1,
            overlayIsShow,
            pics,
            startSubmitReply, continueSubmitReply
        };
    },
});
</script>
<style scoped>
.displayRange {
    margin: 0 50px;
}

#divider-top {
    margin-top: 50px;
    border-color: #cccccc;
    border-top: 1px;
    border-bottom: none;
}

.radioGroup {
    margin: 40px 0 20px;
    color: black;
    font-size: 20px;
}

#button {
    border: none;
    border-radius: 0.5vh;
    background-color: #393b40;
    color: #f4d8a8;
    font-size: 2vh;
    padding: 0.3vh 80px;
}
</style>