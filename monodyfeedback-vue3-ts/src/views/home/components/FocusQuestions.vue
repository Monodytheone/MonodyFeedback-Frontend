<!-- 重点关注 -->
<template>
    <div id="focusQuestions">
        <Title text="常见问题" />
        <div style="clear:both"></div>
        <van-tabs v-model:active="active" color="#51a7e0" title-active-color="#51a7e0" :ellipsis="false" :key="tabKey"
            @click-tab="onClickTab">
            <van-tab v-for=" tab  in  info " :title="tab.tabName" :key="tabKey">
                <p class="page-item" v-for=" page  in  tab.pageInfos " @click="clickPage(page.pageId)">
                    <img class="hot" v-if="page.isHot" src="@/assets/hot.png" alt="">
                    {{ page.title }}
                    <van-icon class="arrow" color="#aaaaaa" name="arrow" />
                </p>
                <p class="text-bottom">没有更多了</p>
            </van-tab>
        </van-tabs>
        <!-- <div style="padding-top: 50px"/> -->
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Title from './Title.vue';
import { reactive } from 'vue';
import getFAQInfoForHomePage from '@/api/faqAPIs/getFAQInfoForHomePage';
import router from '@/router';

export default defineComponent({
    name: 'FocusQuestions',
    components: {
        Title,
    },
    setup() {
        const active = ref(1)
        const tabKey = ref(0)

        const tabNames = reactive<string[]>([])
        const info = ref<any>()

        getFAQInfoForHomePage()
            .then(response => {
                response.data.forEach((tab: any) => {
                    tabNames.push(tab.tabName)
                })
                info.value = response.data

                let activeFormLocalStorage = localStorage.getItem("submitterHomeActive")
                if (activeFormLocalStorage != null) {
                    active.value = activeFormLocalStorage as unknown as number
                    console.log(active.value)
                    tabKey.value++
                }
            })
            .catch(error => {
                console.error(`获取常见问题信息失败，" + ${error.response.status}: ${error.response.data}`)
            })

        // let activeFormLocalStorage = localStorage.getItem("submitterHomeActive")
        // if (activeFormLocalStorage != null) {
        //     active.value = activeFormLocalStorage as unknown as number
        //     console.log(active.value)
        //     tabKey.value++
        // }

        const clickPage = (id: string) => {
            router.push(`/FAQPage?pageId=${id}`)
        }

        const onClickTab = () => {
            localStorage.setItem("submitterHomeActive", active.value.toString())
        }

        return {
            active,
            tabNames,
            tabKey,
            info,
            clickPage,
            onClickTab
        }
    }
})
</script>
<style scoped>
#focusQuestions {
    margin: 10px 0;
    background-color: white;
}

.page-item {
    text-align: left;
    margin: 0 5%;
    padding: 7px 0;
    width: 90%;
    border-bottom: 1px #dddddd solid;
    cursor: pointer;
}

.hot {
    width: 35px;
}

.arrow {
    /* text-align: right; */
    float: right;
    padding-right: 10px;
    padding-top: 4px;
}

.text-bottom {
    color: #969799;
    padding: 40px 0;
}
</style>