<template>
    <div v-title data-title="问题详情 - 反馈处理:MonodyFeedback"></div>
    <div class="background">
        <div class="whiteBackground">
            <div id="displayRange">
                <a-affix :offset-top="0">
                    <div class="header">
                        <router-link id="backLink" :to="`/processor/problems?active=${backTabName}`">
                            <van-icon name="arrow-left" :size="17" />
                            返回{{ backTabStatusString }}列表
                        </router-link>
                        <div id="submitterInfo">
                            <h4>手机号：{{ tel == null ? '未填写' : tel }}</h4>
                            <h4>邮箱：{{ email == null ? '未填写' : email }}</h4>
                        </div>
                        <div style="clear: both" />
                    </div>
                </a-affix>

                <div class="subTitle">
                    <p>
                        <van-icon name="question-o" color="#dcbc60" size="20" />
                        <b>当前状态：{{ statusString }}</b>
                    </p>
                </div>

                <div class="subTitle">
                    <p>
                        <van-icon name="chat-o" color="#dcbc60" size="20" />
                        <b>问题详情：</b>
                    </p>
                </div>
                <ParagraphBox v-for="(paragraph) in submissionDetails.Paragraphs" :time="paragraph.CreationTime"
                    :textContent="paragraph.TextContent" :pictureUrls="paragraph.PictureUrls" :showForSubmitter="false"
                    :sender="parseSender(paragraph.Sender)" :submitterName="submitterName" />

                <div style="margin-top: 40px;" />

                <div v-if="submissionDetails.Status == 1">
                    <div class="subTitle">
                        <p>
                            <van-icon name="add-o" color="#dcbc60" size="20" />
                            <b>问题回复：</b>
                        </p>
                    </div>
                    <ProcessBox :submissionId="submissionId" :submitterId="submitterId" />
                </div>

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
import { defineComponent, ref, reactive, onBeforeMount, onMounted } from 'vue';
import showModalAndJump from '@/common/showModalAndJump';
import DateTime from 'xdatetime';
import SubmissionStatus from '@/types/SubmissionStatus';
import ParagraphBox from '@/components/ParagraphBox.vue';
import processorGetSubmission from '@/api/processAPIs/processorGetSubmission';
import ProcessBox from './components/ProcessBox.vue';
import Evaluation from './components/Evaluation.vue';
import ParagraphSender from '@/types/ParapraphSender';
export default defineComponent({
    components: {
        ParagraphBox,
        ProcessBox,
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
        const tel = ref('')
        const email = ref('')
        const submitterName = ref('')
        const processBoxIsShow = ref(false)
        const submitterId = ref('')
        const statusString = ref('')
        const backTabName = ref('')
        const backTabStatusString = ref('')


        processorGetSubmission(props.submissionId)
            .then(response => {
                tel.value = response.data.submitterTel
                email.value = response.data.submitterEmail
                submitterName.value = response.data.submitterName
                submitterId.value = response.data.submitterId
                submissionDetails.Status = response.data.status
                processBoxIsShow.value = submissionDetails.Status === SubmissionStatus.toBeProcessed
                response.data.paragraphs.forEach((element: any) => {
                    submissionDetails.Paragraphs.push(new ParagraphDetials(element.sequence, new DateTime(element.creationTime), element.sender, element.textContent, element.pictureUrls));
                });
                statusString.value = computeStatusString(response.data.status)
                changeBackTab(submissionDetails.Status)
            })
            .catch(error => {
                const errorCode = error.response.status as number
                if (errorCode === 401) {
                    showModalAndJump(false, '/login', '登录失效，请重新登陆', '登录页面', '去登录')
                }
                else if (errorCode === 403) {
                    showModalAndJump(false, '/progress', '警告：你不得访问不属于你的问题', '问题列表', '我错了')
                    // 应该把这个行为记入日志
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

        /** 将Sender字符串转为枚举，用于给ParagraphBox组件传Sender参数（设计得这么奇怪是因为之前忘了考虑发送者是System的情况，暂时不想大改故如此了） */
        const parseSender = (senderString: string): ParagraphSender => {
            switch (senderString) {
                case 'Submitter':
                    return ParagraphSender.Submitter
                case 'Processor':
                    return ParagraphSender.Processor
                case 'System':
                default:
                    return ParagraphSender.System
            }
        }

        const changeBackTab = (status: SubmissionStatus) => {
            switch (status) {
                case SubmissionStatus.toBeProcessed:
                    backTabName.value = 'a'
                    backTabStatusString.value = '待处理'
                    break;

                case SubmissionStatus.toBeSupplemented:
                    backTabName.value = 'b'
                    backTabStatusString.value = '待完善'
                    break;

                case SubmissionStatus.toBeEvaluated:
                    backTabName.value = 'c'
                    backTabStatusString.value = '待评价'
                    break;

                case SubmissionStatus.closed:
                    backTabName.value = 'd'
                    backTabStatusString.value = '已关闭'
                    break;

                default:
                    break;
            }
        }

        return {
            tel, email, submitterName, submitterId,
            statusString, processBoxIsShow,
            submissionDetails,
            backTabStatusString, backTabName,
            parseSender,
        }
    }
})
</script>
<style scoped>
.header {
    background-color: white;
}

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
    background-color: white;
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

#submitterInfo {
    float: left;
    margin-left: 20px;
    padding-top: 20px;
}

#submitterInfo h4 {
    text-align: left;
    color: #666666;
    line-height: 12px;
}

#backLink {
    float: left;
    width: 50%;
    text-align: left;
    margin-top: 20px;
    top: 10px;
    left: calc(50vw - 175px);
    color: rgb(189, 183, 183)
}

#backLink:hover {
    color: #1890ff;
}
</style>