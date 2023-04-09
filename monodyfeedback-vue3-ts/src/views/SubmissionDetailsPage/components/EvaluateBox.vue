<template>
    <div>
        <li>客服的回答是否解决了您的问题？</li>
        <div style="margin-top: 10px" />
        <a-radio-group v-model:value="isSolved">
            <a-radio-button :value="true" style="margin-right: 10px;">已解决</a-radio-button>
            <a-radio-button :value="false">未解决</a-radio-button>
        </a-radio-group>
    </div>

    <div style="margin-top: 30px">
        <li>请您为本次服务整体评分</li>
        <a-rate v-model:value="grade" style="font-size: 30px" />
    </div>

    <div style="margin-top: 40px" />
    <a-button id="button" type="primary" size="default" @click="submitEvaluation">提交评价</a-button>

    <Overlay :isShow="overlayIsShow" message="评价中..."/>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import evaluate from '@/api/submitAPIs/evaluate';
import showErrorModal from '@/common/showErrorModal';
import Overlay from '@/components/Overlay.vue';
import showModalAndJump from '@/common/showModalAndJump';
export default defineComponent({
    components: {
        Overlay,
    },
    props: {
        submissionId: { type: String, required: true },
    },
    setup(props) {
        const isSolved = ref<Boolean | undefined>(undefined)
        const grade = ref<number>(0);
        const overlayIsShow = ref(false)

        const submitEvaluation = () => {
            if(isSolved.value === undefined) {
                showErrorModal("请选择是否以解决")
                return
            }
            if(grade.value === 0) {
                showErrorModal("请评分")
                return
            }

            overlayIsShow.value = true
            evaluate(props.submissionId, isSolved.value as boolean, grade.value)
                .then(response => {
                    showModalAndJump(true, '/progress', '评价成功', '问题列表', '确定')
                })
                .catch(error => {
                    showErrorModal(`${error.response.status}： ${error.response.data}`)
                })
                .finally(() => {
                    overlayIsShow.value = false
                })
        }
        return {
            isSolved,
            grade,
            overlayIsShow,
            submitEvaluation,
        }
    }
})
</script>

<style scoped>
li {
    text-align: left;
    margin-left: 20px;
    color: #999999;
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
