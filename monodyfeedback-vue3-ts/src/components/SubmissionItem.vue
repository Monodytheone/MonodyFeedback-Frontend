<template>
    <div id="item-area" @click="jumpToDetailsPage">
        <div id="item-left">
            <p>{{ info.Describe }}</p>
            <p id="time">{{ info.LastInteractionTime.toString('yyyy-MM-dd hh:mm:ss') }}</p>
        </div>
        <div id="item-right">
            <p ref="itemRightRef">{{ statusString }}<van-icon name="arrow" size="17px" /></p>
        </div>
        <div style="clear:both"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import SubmissionStatus from '@/types/SubmissionStatus';
import SubmissionInfo from '@/types/SubmissionInfo';
import router from '@/router';

export default defineComponent({
    props: {
        info: {
            type: SubmissionInfo,
            required: true,
        },
        isShownForSubmitter: {
            type: Boolean,
            required: true,
        }
    },
    setup(props) {
        const itemRightRef = ref()
        const statusString = ref('')

        onMounted(() => {
            switch (props.info.Status) {
                case SubmissionStatus.toBeAssigned:
                case SubmissionStatus.toBeProcessed:
                    statusString.value = '待处理'  // 不给提交者展示‘待分配’状态；处理者的Submission不可能有‘待分配’状态
                    itemRightRef.value.style.color = 'gray'
                    break;

                case SubmissionStatus.closed:
                    statusString.value = '已关闭'
                    itemRightRef.value.style.color = 'gray'
                    break;
 
                case SubmissionStatus.toBeEvaluated:
                    statusString.value = '待评价'
                    itemRightRef.value.style.color = '#5cabee'
                    break;

                case SubmissionStatus.toBeSupplemented:
                    statusString.value = '待补充'
                    itemRightRef.value.style.color = 'brown'
                    break;
            }
        })

        const jumpToDetailsPage = () => {
            if (props.isShownForSubmitter) {
                router.push(`/progress/submission?subid=${props.info.Id}`)
            }
            else {
                router.push(`/processor/problems/submission?subid=${props.info.Id}`)
            }
        }
        return {
            itemRightRef,
            statusString,
            jumpToDetailsPage,
        }
    }
})
</script>
<style scoped>
#item-area {
    background-color: #fbfaf9;
    height: 50px;
    margin: 15px 0;
    border: 1px #cccccc solid;
    border-radius: 3px;
    /* 鼠标移入变小手： */
    cursor: pointer;
}

#item-left {
    padding-top: 8px;
    float: left;
    width: 70%;
}

#item-left p {
    margin: 0 0 0 20px;
    text-align: left;
    font-size: 13px;
    line-height: 1.3em;
}

#time {
    color: rgb(181, 180, 180);
}

#item-right {
    float: right;
    padding: 12px 10px 0 0;
    color: rgb(69, 150, 183);
    color: rgb(25, 180, 241)
}
</style>