<template>
    <div v-title data-title="服务进度 - Monody Feedback"></div>
    <div id="border-home">
        <a-affix :offset-top="0">
            <router-link id="backLink" to="/"><van-icon name="arrow-left" :size="17" /> 返回主界面</router-link>
            <p id="header">共{{ submissionInfos.length }}个问题，{{ numOfToBeSupplemented }}个请完善，{{ numOfToBeEvaluated }}个待评价</p>
        </a-affix>
        <div id="list">
            <SubmissionItem v-for="(info) in submissionInfos" :info="info" :isShownForSubmitter="true"/>
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
import { defineComponent, onBeforeMount, reactive, computed } from 'vue';
import checkLoginStatusAndJumpToLoginPageIf401 from '@/common/checkLoginStatusAndJumpToLoginPageIf401';
import SubmissionItem from '@/components/SubmissionItem.vue';
import SubmissionInfo from '@/types/SubmissionInfo';
import DateTime from 'xdatetime';
import SubmissionStatus from '@/types/SubmissionStatus';
import getSubmissionInfosOfSubmitter from '@/api/submitAPIs/getSubmissionInfosOfSubmitter';
import router from '@/router';

export default defineComponent({
    components: {
        SubmissionItem,
    },
    setup() {
        checkLoginStatusAndJumpToLoginPageIf401()

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

        const jumpToSumitPage = () => {
            router.push('/submit')
        }

        return {
            submissionInfos,
            numOfToBeEvaluated,
            numOfToBeSupplemented,
            jumpToSumitPage,
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