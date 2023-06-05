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
                <div v-if="data.isPureQandA" class="QandA"  v-for="qandA in data.qandAs">
                    <p class="question">Q： {{ qandA.question }}</p>
                    <p class="answer">A： {{ qandA.answer }}</p>
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

        masterGetPage(props.pageId)
            .then(response => {
                console.log(response.data);
                data.value = response.data;
            })
            .catch(error => {

            })

        const handleBack = () => {
            router.go(-1)
        }

        return {
            data,
            handleBack
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
</style>