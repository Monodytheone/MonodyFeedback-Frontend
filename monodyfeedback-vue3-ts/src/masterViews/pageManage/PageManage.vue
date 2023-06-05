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
                                <span style="float:right; ">
                                    <a-button size="small" v-if="index !== 0"><van-icon name="arrow-up" /></a-button>
                                    <a-button size="small" v-if="index !== data.qandAs.length - 1"><van-icon
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

                <iframe v-if="data.isPureQandA == false" :src="data.htmlUrl" seamless />
                <!-- <iframe v-if="data.isPureQandA == false" src="static/temp3.html" /> -->

                <div style="height: 500px"></div>
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



        return {
            data,
            changedQuestion,
            changedAnswer,
            showingIndex,
            handleBack,
            handlePopoverVisibleChange,
            handleClickQandA,
            handleChangeQandA
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