<template>
    <div v-title data-title="FAQ页面管理 - Monody Feedback" />
    <div class="background">
        <div class="whiteBackground">
            <div class="displayRange">
                <h2 class="page-title">
                    <van-icon name="arrow-left" id="back-arrow" @click="handleBack" />
                    <a id="title-text">{{ data.title }}</a>
                </h2>

                <div v-if="data.isPureQandA">
                    <a-tag color="blue" id="tag">Q&A</a-tag>
                    <div style="clear: both" />
                </div>
                <div v-if="data.isPureQandA" class="QandA" v-for="(qandA, index) in data.qandAs">
                    <a-popover title="编辑Q&A" trigger="click" @visibleChange="handlePopoverVisibleChange">
                        <template #content>
                            <span style="color: #e67e22; font-weight: bolder;">Q: </span>
                            <a-textarea v-model:value="changedQuestion" placeholder="Autosize height based on content lines"
                                :auto-size="{ minRows: 2, maxRows: 5 }" />
                            <div style="margin: 15px 0" />
                            <span style="font-weight: bolder;">A: </span>
                            <a-textarea v-model:value="changedAnswer"
                                placeholder="Autosize height with minimum and maximum number of lines"
                                :auto-size="{ minRows: 2, maxRows: 5 }" />
                            <div class="buttons">
                                <a-button size="small" type="link" @click="handleChangeQandA">修改Q&A</a-button>
                                <a-button size="small" type="link" @click="handleDeleteQandA" danger>删除Q&A</a-button>
                                <span style="float:right; ">
                                    <a-button size="small" v-if="index !== 0"><van-icon name="arrow-up"
                                            @click="handleQandAMove(qandA.qandAId, true)" /></a-button>
                                    <a-button size="small" v-if="index !== data.qandAs.length - 1"
                                        @click="handleQandAMove(qandA.qandAId, false)"><van-icon
                                            name="arrow-down" /></a-button>
                                </span>
                                <div style="clear: both" />
                            </div>
                        </template>
                        <span style="cursor: pointer;" @click="handleClickQandA(index)">
                            <p class="question">Q： {{ qandA.question }}</p>
                            <p class="answer">A： {{ qandA.answer }}</p>
                        </span>
                    </a-popover>
                </div>
                <div style="clear: both" />
                <div v-if="data.isPureQandA">
                    <p style="color: #e67e22; font-weight: bolder; text-align: left; margin-bottom: 0;">Q: </p>
                    <a-textarea v-model:value="newQuestion" placeholder="Question"
                        :auto-size="{ minRows: 2, maxRows: 5 }" />
                    <div style="margin: 15px 0" />
                    <p style="font-weight: bolder; text-align: left; margin-bottom: 0;">A: </p>
                    <a-textarea v-model:value="newAnswer" placeholder="Answer" :auto-size="{ minRows: 2, maxRows: 5 }" />
                    <a-button type="primary" style="margin-top: 10px" @click="handleCreateQandA">新增Q&A</a-button>
                </div>
                <div v-if="data.isPureQandA == false">

                    <a-popover title="更换内容源" trigger="hover">
                        <template #content>
                            <a-input v-model:value="newHtmlUrl" style="width: 60%" placeholder="输入新的HtmlUrl" />
                            <a-button style="margin-left: 10px;" @click="handleUpdateHtmlUrl">更新</a-button>
                        </template>
                        <span style="cursor: pointer;">
                            <p style="text-align: left; word-wrap: break-word;"><b>外部Html： </b> {{ data.htmlUrl }}</p>
                        </span>
                    </a-popover>


                    <hr>
                    <iframe :src="data.htmlUrl" seamless />
                    <!-- <iframe v-if="data.isPureQandA == false" src="static/temp3.html" /> -->

                    <div style="height: 500px"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import masterGetPage from '@/api/faqManageAPIs/masterGetPage';
import router from '@/router';
import modifyQandA from '@/api/faqManageAPIs/modifyQandA';
import { message } from 'ant-design-vue';
import showErrorModal from '@/common/showErrorModal';
import sortQandAsInPage from '@/api/faqManageAPIs/sortQandAsInPage';
import deleteQandA from '@/api/faqManageAPIs/deleteQandA';
import createQandA from '@/api/faqManageAPIs/createQandA';
import changePageHtmlUrl from '@/api/faqManageAPIs/changePageHtmlUrl';
export default defineComponent({
    name: 'FAQPage',
    props: {
        pageId: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const data = ref<any>()
        const changedQuestion = ref('')
        const changedAnswer = ref('')
        const showingIndex = ref<number>()
        const newQuestion = ref('')
        const newAnswer = ref('')
        const newHtmlUrl = ref('')

        const refreshData = () => {
            masterGetPage(props.pageId)
                .then(response => {
                    console.log(response.data);
                    data.value = response.data;
                })
                .catch(error => {

                })
        }

        refreshData();

        const handleBack = () => {
            router.go(-1)
        }

        const handlePopoverVisibleChange = (visible: boolean) => {
            console.log(visible, showingIndex.value)
            if (visible === false) {
                showingIndex.value = undefined;
                changedAnswer.value = '';
                changedQuestion.value = '';
            }
            else {
                changedAnswer.value = data.value.qandAs[showingIndex.value as number].answer;
                changedQuestion.value = data.value.qandAs[showingIndex.value as number].question;
            }
        }

        const handleClickQandA = (index: number) => {
            showingIndex.value = index
        }

        const handleChangeQandA = () => {
            modifyQandA(data.value.qandAs[showingIndex.value as number].qandAId, changedQuestion.value, changedAnswer.value)
                .then(response => {
                    message.success("修改Q&A成功");
                    refreshData();
                })
                .catch(error => {
                    showErrorModal(`修改Q&A失败，${error.response.status}: ${error.response.data}`);
                })
        }

        const handleQandAMove = (qandAId: string, moveForword: Boolean) => {
            let qandAIds: string[] = [];
            data.value.qandAs.forEach((qandA: any) => {
                qandAIds.push(qandA.qandAId);
            })
            if (moveForword) {
                let temp = qandAIds[showingIndex.value as number];
                qandAIds[showingIndex.value as number] = qandAIds[showingIndex.value as number - 1];
                qandAIds[showingIndex.value as number - 1] = temp;
            }
            else {
                let temp = qandAIds[showingIndex.value as number];
                qandAIds[showingIndex.value as number] = qandAIds[showingIndex.value as number + 1];
                qandAIds[showingIndex.value as number + 1] = temp;
            }

            sortQandAsInPage(props.pageId, qandAIds)
                .then(response => {
                    message.success(moveForword ? "前移成功" : "后移成功");
                    refreshData();
                })
                .catch(error => {
                    showErrorModal(`移动Q&A失败，${error.response.status}: ${error.response.data}`);
                })
        }

        const handleDeleteQandA = () => {
            deleteQandA(props.pageId, data.value.qandAs[showingIndex.value as number].qandAId)
                .then(response => {
                    message.success("删除Q&A成功");
                    refreshData();
                })
                .catch(error => {
                    showErrorModal(`删除Q&A失败，${error.response.status}: ${error.response.data}`);
                })
        }

        const handleCreateQandA = () => {
            createQandA(props.pageId, newQuestion.value, newAnswer.value)
                .then(response => {
                    message.success("新增Q&A成功");
                    refreshData();
                    newQuestion.value = '';
                    newAnswer.value = '';
                })
                .catch(error => {
                    showErrorModal(`新增Q&A失败，${error.response.status}: ${error.response.data}`);
                })
        }

        const handleUpdateHtmlUrl = () => {
            if (newHtmlUrl.value.length === 0) {
                showErrorModal("请输入新的HtmlUrl后再点击更新");
                return;
            }
            changePageHtmlUrl(props.pageId, newHtmlUrl.value)
                .then(response => {
                    message.success("更新内容源成功");
                    refreshData();
                    newHtmlUrl.value = '';
                })
                .catch(error => {
                    showErrorModal(`更换内容源失败，${error.response.status}: ${error.response.data}`);
                })
        }

        return {
            data,
            changedQuestion,
            changedAnswer,
            showingIndex,
            newQuestion,
            newAnswer,
            newHtmlUrl,
            handleBack,
            handlePopoverVisibleChange,
            handleClickQandA,
            handleChangeQandA,
            handleQandAMove,
            handleDeleteQandA,
            handleCreateQandA,
            handleUpdateHtmlUrl
        }
    }
})
</script>

<style scoped>
.background {
    background-color: #fbfaf9;
}

.whiteBackground {
    width: 350px;
    margin: auto;
    background-color: white;
}

.displayRange {
    width: 320px;
    margin: auto;
}

.page-title {
    font-weight: bold;
    text-align: left;
    padding: 10px 0;
    color: #273142;
}

#title-text {
    color: #273142;
    margin-left: 20px;
}


.QandA {
    word-wrap: break-word;
    text-align: left;
    margin-bottom: 40px;
}

.question {
    color: #e67e22;
    font-weight: bolder;
    margin: 0;
}

#back-arrow {
    cursor: pointer
}

#back-arrow:hover {
    color: #1890ff;
}

#tag {
    float: left;
    margin-bottom: 10px;
}

iframe {
    border: none;
    width: 100%;
    height: 10000px;
}

.buttons {
    margin-top: 10px;
}
</style>