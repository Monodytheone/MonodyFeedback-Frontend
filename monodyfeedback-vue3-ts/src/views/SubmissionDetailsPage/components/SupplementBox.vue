<!-- 完善问题 -->
<template>
    <div class="displayRange">
        <div style="margin: 15px 0" />
        <a-textarea v-model:value="textContent" :maxlength="1000" :showCount="true" placeholder="输入补充内容 . . ."
            :auto-size="{ minRows: 2, maxRows: 7 }" />

        <Pics ref="pics" :submitterId="submitterId" :continueSubmit="continueSubmitSupplement" />

        <a-button id="button" type="primary" size="default" @click="startSubmitSupplement">提交</a-button>
        <Overlay :isShow="overlayIsShow" message="回复中..." />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Overlay from '@/components/Overlay.vue';
import showErrorModal from '@/common/showErrorModal';
import PictureInfo from '@/types/PictureInfo';
import supplement from '@/api/submitAPIs/supplement';
import showModalAndJump from '@/common/showModalAndJump';
import Pics from './Pics.vue';
export default defineComponent({
    props: {
        submissionId: { type: String, required: true },
        submitterId: { type: String, required: true },
    },
    components: {
        Overlay,
        Pics,
    },
    setup(props) {
        const textContent = ref<string>('');
        const overlayIsShow = ref(false)
        const pics = ref<InstanceType<typeof Pics>>()

        const startSubmitSupplement = () => {
            if (textContent.value.length < 5) {
                showErrorModal('请输入至少五个字符')
                return
            }
            overlayIsShow.value = true
            pics.value?.handleUpload()  // 先调用照片墙子级组件的方法，上传图片
        }

        const continueSubmitSupplement = (pictureInfos: PictureInfo[]) => {
            supplement(props.submissionId, textContent.value, pictureInfos)
                .then(response => {
                    showModalAndJump(true, '/progress', '提交成功', '服务进度页面', '确定')
                })
                .catch(error => {
                    showErrorModal(`${error.response.status}： ${error.response.data}`)
                })
                .finally(() => {
                    overlayIsShow.value = false
                });
        }

        return {
            textContent,
            overlayIsShow,
            pics,
            startSubmitSupplement, continueSubmitSupplement
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