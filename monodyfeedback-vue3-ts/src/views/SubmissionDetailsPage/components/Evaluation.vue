<template>
    <h1 v-if="hasEvaluation === false">用户未评价</h1>

    <div v-if="hasEvaluation">
        <li>是否解决问题：
            <van-icon class="icon" name="success" color="rgb(94, 193, 94)" size="50" v-if="isSolved" />
            <van-icon class="icon" name="cross" color="red" size="50" v-if="isSolved === false" />
        </li>

        <div style="margin-top: 30px">
            <li>整体评分：</li>
            <a-rate class="rate" :value="grade" disabled style="font-size: 30px" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import getEvaluation from '@/api/submitAPIs/getEvaluation';
import showErrorModal from '@/common/showErrorModal';
export default defineComponent({
    props: {
        submissionId: { type: String, required: true },
    },
    setup(props) {
        const hasEvaluation = ref(false)
        const isSolved = ref<Boolean | null>(null)
        const grade = ref<Number | null>(null)

        getEvaluation(props.submissionId)
            .then(response => {
                hasEvaluation.value = response.data.isSolved != null
                isSolved.value = response.data.isSolved
                grade.value = response.data.grade
            })
            .catch(error => {
                // 本API的所有报错都意味着用户的非法操作，应该记录甚至封号
                showErrorModal("你不应该试图进行不该做行为")
            })

        return {
            hasEvaluation, isSolved, grade,
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

.icon {
    position: relative;
    top: 10px;
}

.rate {
    position: relative;
    top: -25px;
    left: -20px;
}
</style>
