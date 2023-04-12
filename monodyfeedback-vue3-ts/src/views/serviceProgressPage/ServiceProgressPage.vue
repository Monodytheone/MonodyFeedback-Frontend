<template>
    <div v-title data-title="服务进度 - Monody Feedback"></div>
    <div id="border-home">
        <a-affix :offset-top="0">
            <router-link id="backLink" to="/"><van-icon name="arrow-left" :size="17" /> 返回主界面</router-link>
            <p id="header">共{{ submissionInfos.length }}个问题，{{ numOfToBeSupplemented }}个请完善，{{ numOfToBeEvaluated }}个待评价</p>
        </a-affix>
        <div id="list">
            <SubmissionItem v-for="(info) in submissionInfos" :info="info" :isShownForSubmitter="true" :key="keyNum" />
            <p id="list-bottomText">暂无更多纪录</p>
        </div>

        <a-affix :offset-bottom="0">
            <div id="bottom-div">
                <a-button id="button" type="primary" size="default" @click="jumpToSumitPage">联系客服</a-button>
            </div>
        </a-affix>
    </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, reactive, computed, onMounted, onBeforeUnmount, ref } from 'vue';
import checkLoginStatusAndJumpToLoginPageIf401 from '@/common/checkLoginStatusAndJumpToLoginPageIf401';
import SubmissionItem from '@/components/SubmissionItem.vue';
import SubmissionInfo from '@/types/SubmissionInfo';
import DateTime from 'xdatetime';
import SubmissionStatus from '@/types/SubmissionStatus';
import getSubmissionInfosOfSubmitter from '@/api/submitAPIs/getSubmissionInfosOfSubmitter';
import router from '@/router';
import { message } from 'ant-design-vue';
import * as signalR from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';
let connection: signalR.HubConnection | null;  // 到SignalR服务器的连接

interface reacInfos {
    infos: SubmissionInfo[]
}

export default defineComponent({
    components: {
        SubmissionItem,
    },
    setup() {
        checkLoginStatusAndJumpToLoginPageIf401()
        const keyNum = ref(0)
        const submissionInfos = reactive<SubmissionInfo[]>([]);
        const numOfToBeEvaluated = computed(() => {
            return submissionInfos.reduce((pre, info, index) => pre + (info.Status == SubmissionStatus.toBeEvaluated ? 1 : 0), 0)
        })
        const numOfToBeSupplemented = computed(() => {
            return submissionInfos.reduce((pre, info, index) => pre + (info.Status == SubmissionStatus.toBeSupplemented ? 1 : 0), 0)
        })

        onBeforeMount(() => {
            getSubmissionInfosOfSubmitter()
                .then(response => {
                    response.data.forEach((element: any) => {
                        submissionInfos.push(new SubmissionInfo(element.id, element.describe,
                            new DateTime(element.lastInteractionTime),  // 这里如果不new一个DateTime，则无法使用DateTime类中的方法
                            element.status))
                    });
                    console.log(submissionInfos)
                })
                .catch(error => {
                    console.error('获取Submissions失败', `${error.response.status}: ${error.response.data}`)
                })
        })

        onMounted(async function () {
            const token = localStorage.getItem("jwt")
            var options = {
                skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets,  // 禁用协商
                accessTokenFactory: () => token  // 使请求的时候url带上accessToken
            };
            connection = new signalR.HubConnectionBuilder()
                .withUrl(process.env.VUE_APP_SUBMITER_SIGNALR_URL, options as IHttpConnectionOptions)
                .withAutomaticReconnect()  // 自动重连
                .build();
            await connection.start()

            connection.on("SubmissionToBeSupplemented", receivedMessage => {
                message.info('你有新的待完善问题')
                let receivedSubmissionInfo = new SubmissionInfo(receivedMessage.id, receivedMessage.describe,
                    new DateTime(receivedMessage.lastInteractionTime), receivedMessage.status);
                spliceAndUnshiftOnSubmissionInfos(receivedSubmissionInfo);
            });

            connection.on("SubmissionToBeEvaluated", receivedMessage => {
                message.info("你有新的待评价问题")
                let receivedSubmissionInfo = new SubmissionInfo(receivedMessage.id, receivedMessage.describe,
                    new DateTime(receivedMessage.lastInteractionTime), receivedMessage.status);
                spliceAndUnshiftOnSubmissionInfos(receivedSubmissionInfo);
            })
        })

        /** 移除旧条目，插入新条目 */
        const spliceAndUnshiftOnSubmissionInfos = (receivedSubmissionInfo: SubmissionInfo) => {
            // 找出此项SubmissionInfo在数组中的索引
            let index = -1
            for (let i = 0; i < submissionInfos.length; i++) {
                if (submissionInfos[i].Id.toLowerCase() == receivedSubmissionInfo.Id) {
                    index = i
                    break
                }
            }

            // 若元素存在于数组中，移除之
            if (index !== -1) {
                submissionInfos.splice(index, 1)
            }

            submissionInfos.unshift(receivedSubmissionInfo)// 在数组首部插入新的SubmissionInfo
            keyNum.value++  // 更新key，强制子组件刷新
        }

        onBeforeUnmount(() => {
            connection?.stop()  // 退出界面时断开SignalR连接
        })

        const jumpToSumitPage = () => {
            router.push('/submit')
        }

        return {
            submissionInfos,
            numOfToBeEvaluated,
            numOfToBeSupplemented,
            jumpToSumitPage,
            keyNum,
        }
    }
})
</script>
<style scoped>
#border-home {
    width: 350px;
    margin: auto;
}

#backLink {
    position: fixed;
    top: 10px;
    left: calc(50vw - 175px);
    color: rgb(189, 183, 183)
}

#backLink:hover {
    color: #1890ff;
}

#header {
    height: 10vh;
    padding: 6vh 0 10px;
    margin-bottom: 0;
    border-bottom: 1px #cccccc solid;
    color: rgb(220, 181, 81);
    background-color: white;
    font-size: 2vh;
}

#bottom-div {
    height: 7vh;
    border-top: 1px #cccccc solid;
    background-color: white;
}

#list {
    height: calc(82vh - 2px);
    overflow: scroll;
    overflow-x: hidden;
}

#button {
    margin-top: 1.5vh;
    padding: 0.3vh 80px;
    border: none;
    border-radius: 0.5vh;
    font-size: 2vh;
    background-color: #393b40;
    color: #f4d8a8;
}

#list-bottomText {
    padding: 20px 0 50px;
    color: gray;
}
</style>