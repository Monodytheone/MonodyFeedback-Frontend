<template>
    <div v-title data-title="问题详情 - Monody Feedback"></div>
    <div class="background">
        <div class="whiteBackground">
            <div id="displayRange">
                <div id="topWhiteBox" />
                <div class="subTitle">
                    <p><van-icon name="question-o" color="#dcbc60" size="20" /><b>当前状态：{{ statusString }}</b></p>
                </div>

                <div class="subTitle">
                    <p><van-icon name="chat-o" color="#dcbc60" size="20" /><b>问题详情：</b></p>
                </div>
                <ParagraphBox v-for="(paragraph) in submissionDetails.Paragraphs" :time="paragraph.CreationTime"
                    :textContent="paragraph.TextContent" :pictureUrls="paragraph.PictureUrls"
                    :sentBySubmitter="paragraph.Sender === 'Submitter' ? true : false" :showForSubmitter="true" />

                <div style="margin-top: 40px;" />

                <!-- 补充： -->
                <div v-if="submissionDetails.Status == 2">
                    <div class="subTitle">
                        <p>
                            <van-icon name="question-o" color="#dcbc60" size="20" />
                            <b>完善问题</b>
                            <span id="subText-supplement">客服请您对您的问题进行补充说明</span>
                        </p>
                    </div>
                    <SupplementBox :submissionId="submissionId" :submitterId="submitterId" />
                </div>

                <!-- 评价 -->
                <div v-if="submissionDetails.Status == 3">
                    <div class="subTitle">
                        <p>
                            <van-icon name="points" color="#dcbc60" size="20" />
                            <b>请评价</b>
                            <span id="subText-evaluate">问题已结束，请对客服进行评价</span>
                        </p>
                    </div>
                    <EvaluateBox :submissionId="submissionId" />
                </div>

                <!-- 已关闭的问题展示评价结果 -->
                <div v-if="submissionDetails.Status == 4">
                    <div class="subTitle">
                        <p>
                            <van-icon name="certificate" color="#dcbc60" size="20" />
                            <b>用户评价：</b>
                        </p>
                    </div>
                    <Evaluation :submissionId="submissionId" />
                </div>

                <div style="height: 500px"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { SubmissionDetials, ParagraphDetials } from '@/types/SubmissionDetails';
import { ref } from 'vue';
import { defineComponent } from 'vue';
import getSubmission from '@/api/submitAPIs/getSubmission';
import showModalAndJump from '@/common/showModalAndJump';
import { reactive } from 'vue';
import DateTime from 'xdatetime';
import SubmissionStatus from '@/types/SubmissionStatus';
import ParagraphBox from '@/components/ParagraphBox.vue';
import SupplementBox from './components/SupplementBox.vue';
import EvaluateBox from './components/EvaluateBox.vue';
import Evaluation from './components/Evaluation.vue';
export default defineComponent({
    components: {
        ParagraphBox,
        SupplementBox,
        EvaluateBox,
        Evaluation,
    },
    props: {
        submissionId: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const submissionDetails = reactive(new SubmissionDetials(0, []))
        const statusString = ref('')
        const submitterId = localStorage.getItem('submitterId')!

        getSubmission(props.submissionId)
            .then(response => {
                submissionDetails.Status = response.data.status
                statusString.value = computeStatusString(response.data.status)
                response.data.paragraphs.forEach((element: any) => {
                    submissionDetails.Paragraphs.push(new ParagraphDetials(element.sequence, new DateTime(element.creationTime), element.sender, element.textContent, element.pictureUrls));
                });
            })
            .catch(error => {
                const errorCode = error.response.status as number
                if (errorCode === 401) {
                    showModalAndJump(false, '/login', '登录失效，请重新登陆', '登录页面', '去登录')
                }
                else if (errorCode === 403) {
                    showModalAndJump(false, '/progress', '警告：你不得访问不属于你的问题', '问题列表', '我错了')
                    // 应该把这个账号记入日志
                }
                else if (errorCode === 404) {
                    showModalAndJump(false, '/progress', '问题不存在', '问题进度列表', '确定')
                }
                else {
                    showModalAndJump(false, '/process', `${error.response.status}：${error.response.data}`, '问题列表', '确定')
                }
            });


        const computeStatusString = (status: SubmissionStatus) => {
            switch (status) {
                case SubmissionStatus.toBeAssigned:
                case SubmissionStatus.toBeProcessed:
                    return '待处理'  // 不给提交者展示‘待分配’状态

                case SubmissionStatus.closed:
                    return '已关闭'

                case SubmissionStatus.toBeEvaluated:
                    return '待评价'

                case SubmissionStatus.toBeSupplemented:
                    return '待补充'
            }
        }


        return {
            statusString, submitterId,
            submissionDetails,
        }
    }
})
</script>
<style scoped>
.background {
    background-color: #fbfaf9;
}

.whiteBackground {
    width: 600px;
    margin: auto;
    background-color: white;
}


#displayRange {
    width: 500px;
    margin: auto;
    color: #666666;
}

#topWhiteBox {
    height: 7vh;
}

.subTitle {
    border-top: 1px #cccccc solid;
}

.subTitle p {
    text-align: left;
    font-size: 15px;
    margin: 13px 0 13px 0;
}

.subTitle b {
    margin-left: 5px;
}

#subText-supplement {
    margin-left: 60px;
    color: brown;
    font-size: 10px;
}

#subText-evaluate {
    margin-left: 60px;
    color: #5cabee;
    font-size: 10px;
}
</style>