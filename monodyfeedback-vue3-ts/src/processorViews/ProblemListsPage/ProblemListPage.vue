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

        <van-tabs v-model:active="active">
            <van-tab title="待处理" name="a" :dot="true">
                <div class="list">
                    <ToBeProcessedList :getNumber="getNumber" ref="toBeProcessedListRef" v-if="processorName.length != 0"
                        :enableAssignButton="enableAssignButton" />
                </div>
            </van-tab>

            <van-tab title="待完善" name="b">
                <div class="list">
                    <ListInStatus :status="2" />
                </div>
            </van-tab>

            <van-tab title="待评价" name="c">
                <div class="list">
                    <ListInStatus :status="3" />
                </div>
            </van-tab>

            <van-tab title="已关闭" name="d">
                <div class="list">
                    <PaginationListInStatus :status="4" />
                </div>
            </van-tab>
        </van-tabs>

    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import ServicesWrap from '@/views/home/components/ServicesWrap.vue';
import getProcessorInfo from '@/api/identityAPIs/getProcessorInfo';
import showModalAndJump from '@/common/showModalAndJump';
import processorLogout from '@/api/identityAPIs/processorLogout';
import getUnassignedNumber from '@/api/processAPIs/getUnassignedNumber'
import showErrorModal from '@/common/showErrorModal';
import ToBeProcessedList from './components/ToBeProcessedList.vue';
import ListInStatus from './components/ListInStatus.vue';
import PaginationListInStatus from './components/PaginationListInStatus.vue';

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

        const toBeProcessedListRef = ref()
        const assign = () => {
            claimButtonIsDisabled.value = true
            toBeProcessedListRef.value.handleAssign()
        }

        const enableAssignButton = () => {
            claimButtonIsDisabled.value = false
        }

        return {
            active, processorName, unassignedNumber, toBeProcessedListRef, claimButtonIsDisabled,
            handlerLogout, assign, getNumber, enableAssignButton
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