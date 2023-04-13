<template>
    <div v-title data-title="问题处理中心 - 反馈处理:MonodyFeedback"></div>
    <div id="displayRange">
        <div class="box-left" id="idBox">
            <p>{{ processorName }} 已登录</p>
            <a-button class="button" id="button-logout" type="dashed" @click="handlerLogout">退出登录</a-button>
        </div>

        <div class="box-left" id="claimSubmissioBox">
            <p>当前，数据库中还有 <span id="unassignedNumber"> {{ unassignedNumber }} </span> 个未领取的问题</p>
            <a-button class="button" id="button-claim" type="dashed" @click="assign"
                :disabled="claimButtonIsDisabled">领取问题</a-button>
        </div>

        <!-- 加上@click-tab更新路由是为了解决从问题详情页点返回键返回到历史记录中的上一个页面时，能够正确显示上一回显示的列表 -->
        <van-tabs v-model:active="active" @click-tab="onClickTab(active)">
            <van-tab title="待处理" name="a" :dot="dotIsShow.a" :key="keyA">
                <div class="list">
                    <ToBeProcessedList :getNumber="getNumber" ref="toBeProcessedListRef" v-if="processorName.length != 0"
                        :enableAssignButton="enableAssignButton" />
                </div>
            </van-tab>

            <van-tab title="待完善" name="b" :dot="dotIsShow.b" :key="keyB">
                <div class="list">
                    <ListInStatus :status="2" ref="toBeSupplementedListRef" />
                </div>
            </van-tab>

            <van-tab title="待评价" name="c" :dot="dotIsShow.c" :key="keyC">
                <div class="list">
                    <ListInStatus :status="3" ref="toBeEvaluatedListRef" />
                </div>
            </van-tab>

            <van-tab title="已关闭" name="d" :dot="dotIsShow.d" :key="keyD">
                <div class="list">
                    <PaginationListInStatus :status="4" ref="closedListRef" />
                </div>
            </van-tab>
        </van-tabs>

    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import ServicesWrap from '@/views/home/components/ServicesWrap.vue';
import getProcessorInfo from '@/api/identityAPIs/getProcessorInfo';
import showModalAndJump from '@/common/showModalAndJump';
import processorLogout from '@/api/identityAPIs/processorLogout';
import getUnassignedNumber from '@/api/processAPIs/getUnassignedNumber'
import showErrorModal from '@/common/showErrorModal';
import ToBeProcessedList from './components/ToBeProcessedList.vue';
import ListInStatus from './components/ListInStatus.vue';
import PaginationListInStatus from './components/PaginationListInStatus.vue';
import { IHttpConnectionOptions } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { message } from 'ant-design-vue';
import DateTime from 'xdatetime';
import SubmissionInfo from '@/types/SubmissionInfo';
import router from '@/router';
let connection: signalR.HubConnection | null;  // 到SignalR服务器的连接
let connectionToCommonHub: signalR.HubConnection | null;

export default defineComponent({
    components: {
        ServicesWrap,
        ToBeProcessedList,
        ListInStatus,
        PaginationListInStatus,
    },
    props: {
        activeName: { type: String, required: false }
    },
    setup(props) {
        const processorName = ref('')
        const claimButtonIsDisabled = ref(false)
        const active = ref('a');
        active.value = props.activeName !== undefined ? props.activeName : 'a'

        const toBeProcessedListRef = ref()
        const toBeSupplementedListRef = ref()
        const toBeEvaluatedListRef = ref()
        const closedListRef = ref()
        const dotIsShow = reactive({
            a: false,
            b: false,
            c: false,
            d: false,
        })
        const keyA = ref(0)
        const keyB = ref(0)
        const keyC = ref(0)
        const keyD = ref(0)


        getProcessorInfo()
            .then(response => {
                processorName.value = response.data.userName
                getNumber()
            })
            .catch(error => {
                const statusCode = error.response.status
                if (statusCode == 401) {
                    showModalAndJump(false, '/processor', '登录失效，请重新登录', '处理者登录页面', '去登录')
                }
            });

        onMounted(async () => {
            const token = localStorage.getItem('processorJWT')
            var options = {
                skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets,  // 禁用协商
                accessTokenFactory: () => token  // 使请求的时候url带上accessToken
            };

            connection = new signalR.HubConnectionBuilder()
                .withUrl(process.env.VUE_APP_PROCESSOR_SIGNALR_URL, options as IHttpConnectionOptions)
                .withAutomaticReconnect()  // 自动重连
                .build();
            await connection.start();
            connection.on('SubmissionToBeProcessed', receivedMessage => {
                showGlobalInfo('你有问题被补充了，请前往处理')
                let receivedSubmissionInfo = new SubmissionInfo(receivedMessage.id, receivedMessage.describe,
                    new DateTime(receivedMessage.lastInteractionTime), receivedMessage.status);
                toBeSupplementedListRef.value.removeItemIfExisting(receivedSubmissionInfo.Id);
                toBeProcessedListRef.value.pushNewItem(receivedSubmissionInfo);
                dotIsShow.a = true
                keyA.value++
            });
            connection.on('SubmissionCloseByEvaluate', receivedMessage => {
                showGlobalInfo('你有问题被评价了，已移入已关闭列表')
                let receivedSubmissionInfo = new SubmissionInfo(receivedMessage.id, receivedMessage.describe,
                    new DateTime(receivedMessage.lastInteractionTime), receivedMessage.status);
                toBeEvaluatedListRef.value.removeItemIfExisting(receivedSubmissionInfo.Id);
                closedListRef.value.unshiftNewItem(receivedSubmissionInfo);
                dotIsShow.d = true
                keyD.value++
            })

            // 到CommonHub的连接：
            connectionToCommonHub = new signalR.HubConnectionBuilder()
                .withUrl(process.env.VUE_APP_COMMONHUB_URL, options as IHttpConnectionOptions)
                .withAutomaticReconnect()
                .build();
            await connectionToCommonHub.start();
            connectionToCommonHub.on('SubmissionUnevaluatedForLongAutoClose', receivedMessage => {
                showGlobalInfo('你有待评价问题长时间未被用户评价，现已自动关闭并移入已关闭列表')
                let receivedSubmissionInfo = new SubmissionInfo(receivedMessage.id, receivedMessage.describe,
                    new DateTime(receivedMessage.lastInteractionTime), receivedMessage.status);
                toBeEvaluatedListRef.value.removeItemIfExisting(receivedSubmissionInfo.Id);
                closedListRef.value.unshiftNewItem(receivedSubmissionInfo);
                dotIsShow.d = true
                keyD.value++
            });
            connectionToCommonHub.on('SubmissionUnsupplementForLongAutoClose', receivedMessage => {
                showGlobalInfo('你有待完善问题长时间未被用户完善，现已自动关闭并移入已关闭列表');
                let receivedSubmissionInfo = new SubmissionInfo(receivedMessage.id, receivedMessage.describe,
                    new DateTime(receivedMessage.lastInteractionTime), receivedMessage.status);
                toBeSupplementedListRef.value.removeItemIfExisting(receivedSubmissionInfo.Id);
                closedListRef.value.unshiftNewItem(receivedSubmissionInfo);
                dotIsShow.d = true
                keyD.value++
            })
        });

        onBeforeUnmount(() => {
            connection?.stop()  // 退出界面时断开SignalR连接
            connectionToCommonHub?.stop()
        })

        const unassignedNumber = ref<Number>()
        const getNumber = () => getUnassignedNumber()
            .then(response => {
                unassignedNumber.value = response.data as Number
            })
            .catch(error => {
                showErrorModal(`${error.response.status}：${error.response.data}`)
            })
            .finally(() => {
                claimButtonIsDisabled.value = false
            })

        const handlerLogout = () => {
            processorLogout()
            location.reload()  // 刷新页面
        }

        const assign = () => {
            claimButtonIsDisabled.value = true
            toBeProcessedListRef.value.handleAssign()
        }

        const enableAssignButton = () => {
            claimButtonIsDisabled.value = false
        }

        const showGlobalInfo = (text: string) => {
            message.info({
                content: () => text,
                style: {
                    marginTop: '10vh',
                }
            });
        }

        const onClickTab = (tabName: string) => {
            router.push(`/processor/problems?active=${tabName}`)  // 更新QueryString中的activeTabName
            switch (tabName) {  // 关闭所点标签上的红点
                case 'a':
                    dotIsShow.a = false
                    break;
                case 'b':
                    dotIsShow.b = false
                    break;
                case 'c':
                    dotIsShow.c = false
                    break;
                case 'd':
                    dotIsShow.d = false
                    break;
                
                default:
                    break;
            }
        }

        return {
            active, processorName, unassignedNumber, claimButtonIsDisabled, dotIsShow,
            toBeSupplementedListRef, toBeProcessedListRef, toBeEvaluatedListRef, closedListRef,
            keyA, keyB, keyC, keyD,
            handlerLogout, assign, getNumber, enableAssignButton, onClickTab,
        };
    }
})
</script>
<style scoped>
#displayRange {
    width: 350px;
    margin: auto;
}

.list {
    height: 85vh;
    overflow: scroll;
    overflow-x: hidden;
}

.box-left {
    position: absolute;
    left: calc(50vw - 320px);
    color: #cccccc;
}

#idBox {
    top: 50px;
}

#claimSubmissioBox {
    top: 200px;
    width: 120px;
}

.button {
    color: #cccccc;

}

#button-logout:hover {
    color: red;
    border-color: red;
}

#button-claim:hover {
    color: #5f9ea0;
}

#unassignedNumber {
    color: #1989fa;
    font-weight: bolder;
    margin: 0 5px 0 5px;
}
</style>