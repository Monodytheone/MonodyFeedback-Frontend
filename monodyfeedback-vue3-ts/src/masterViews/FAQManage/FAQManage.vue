<template>
    <div v-title data-title="FAQ管理 - Monody Feedback" />
    <div class="background">
        <div class="whiteBackground">
            <div class="displayRange">
                <h1 style="padding-top: 20px">FAQ管理</h1>

                <a-input v-model:value="createTabName" placeholder="新Tab的名称" />
                <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmCreateTab" @cancel="">
                    <template #title>
                        <p>{{ `创建名为 "${createTabName}" 的新标签？` }}</p>
                    </template>
                    <a-button>创建新Tab</a-button>
                </a-popconfirm>

                <van-tabs v-model:active="active" color="#51a7e0" title-active-color="#51a7e0" :ellipsis="false"
                    :key="tabKey" @click-tab="onClickTab">
                    <van-tab v-for="tab in info" :title="tab.tabName" :key="tabKey">

                        <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmMoveForward" @cancel="">
                            <template #title>
                                <p>{{ `确认左移？` }}</p>
                            </template>
                            <a-button v-if="active != 0"><van-icon name="arrow-left" /></a-button>
                        </a-popconfirm>
                        <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmMoveBack" @cancel="">
                            <template #title>
                                <p>{{ `确认右移？` }}</p>
                            </template>
                            <a-button v-if="active != info.length - 1" :loading="false"><van-icon name="arrow" /></a-button>
                        </a-popconfirm>

                        <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="comfirmDeleteTab" @cancel="">
                            <template #title>
                                <p>{{ `确认删除Tab?` }}</p>
                            </template>
                            <a-button id="delete-tab-button" danger>删除Tab</a-button>
                        </a-popconfirm>

                        <br>
                        <div style="height: 5px"></div>

                        <a-input v-model:value="newTabName" placeholder="修改TabName" />

                        <a-popconfirm ok-text="确认修改" cancel-text="取消" @confirm="confirmChangeTabName"
                            @cancel="cancelChangeTabName">
                            <template #title>
                                <p>{{ `确认将标签名称改为 " ${newTabName}" ？` }}</p>
                            </template>
                            <a-button :loading="changeTabNameButtonIsLoading">{{ changeTabNameButtonIsLoading ? '修改中' : '修改'
                            }}</a-button>
                        </a-popconfirm>


                        <p class="page-item" v-for="page in tab.pageInfos" @click="clickPage(page.pageId)">
                            <img class=" hot" v-if="page.isHot" src="@/assets/hot.png" alt="">
                            {{ page.title }}
                            <a-button size="small" style="float: right" type="link"
                                @click="$router.push(`/master/page?pageId=${page.pageId}`)">进入页面</a-button>
                            <div style="clear: both" />


                            <span class="buttons">
                                <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmPageMove(page.pageId, true)"
                                    @cancel="">
                                    <template #title>
                                        <p>确认前移？</p>
                                    </template>
                                    <a-button class="pageMoveForwardButton" size="small">前移</a-button>
                                </a-popconfirm>
                                <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmPageMove(page.pageId, false)"
                                    @cancel="">
                                    <template #title>
                                        <p>确认后移？</p>
                                    </template>
                                    <a-button size="small">后移</a-button>
                                </a-popconfirm>
                                <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmDeletePage(page.pageId)"
                                    @cancel="">
                                    <template #title>
                                        <p>确认删除页面？</p>
                                    </template>
                                    <a-button class="pageDeleteButton" size="small" danger>删除</a-button>
                                </a-popconfirm>
                            </span>
                            <div style="clear: both" />
                        </p>

                        <p class="text-bottom">没有更多Page了</p>

                        <a-input v-model:value="createPageName" placeholder="创建Page" />
                        <a-popconfirm ok-text="确认" cancel-text="取消" @confirm="confirmCreatePage" @cancel="">
                            <template #title>
                                <p>{{ `确认在${info[active].tabName} 标签下创建名为 "${createPageName}" 的Page？` }}</p>
                            </template>
                            <a-button :loading="false">{{ '创建' }}</a-button>
                        </a-popconfirm>

                        <a-radio-group v-model:value="isPureQandA" class="radio-group">
                            <a-radio :style="radioStyle" :value="true">纯Q&A</a-radio>
                            <a-radio :style="radioStyle" :value="false">
                                外部Html
                                <a-input v-if="isPureQandA === false" style="width: 100px; margin-left: 10px"
                                    placeholder="HtmlUrl" v-model:value="externalHtmlUrl" />
                            </a-radio>
                        </a-radio-group>
                        <a-radio-group v-model:value="isHot" class="radio-group">
                            <a-radio :style="radioStyle" :value="true">热门</a-radio>
                            <a-radio :style="radioStyle" :value="false">非热门</a-radio>
                        </a-radio-group>
                        <div style="clear: both" />

                    </van-tab>
                </van-tabs>
                <div style="height: 500px"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import masterGetFAQInfoForHomePage from '@/api/faqManageAPIs/masterGetFAQInfoForHomePage';
import changeTabName from '@/api/faqManageAPIs/changeTabName';
import { message } from 'ant-design-vue';
import router from '@/router';
import showErrorModal from '@/common/showErrorModal';
import sortTabs from '@/api/faqManageAPIs/sortTabs';
import createTab from '@/api/faqManageAPIs/createTab';
import deleteTab from '@/api/faqManageAPIs/deleteTab';
import createPage from '@/api/faqManageAPIs/createPage';
import sortPagesInTab from '@/api/faqManageAPIs/sortPagesInTab';
import deletePage from '@/api/faqManageAPIs/deletePage';
export default defineComponent({
    setup() {
        const active = ref(0)
        const tabKey = ref(0)
        const info = ref<any>()
        const changeTabNameButtonIsLoading = ref(false)

        const newTabName = ref('')
        const createTabName = ref('')

        const createPageName = ref('')
        const isPureQandA = ref<Boolean>()
        const isHot = ref<Boolean>()
        const externalHtmlUrl = ref('')
        const radioStyle = reactive({
            display: 'flex',
            height: '30px',
            lineHeight: '30px',
        });

        const refreshData = (newActive: number) => {
            masterGetFAQInfoForHomePage()
                .then(response => {
                    info.value = response.data
                    active.value = newActive
                })
                .catch(error => {
                    console.error(`获取常见问题信息失败，" + ${error.response.status}: ${error.response.data}`)
                })
        }

        refreshData(0);

        const clickPage = (id: string) => {
            // router.push(`/FAQPage?pageId=${id}`)
        }

        const onClickTab = () => {
            newTabName.value = ''
            createPageName.value = ''
            isHot.value = undefined
            isPureQandA.value = undefined
        }

        const confirmChangeTabName = (e: MouseEvent) => {
            message.success('已确认');
            handleChangeTabName(info.value[active.value].tabId, newTabName.value)
        };

        const cancelChangeTabName = (e: MouseEvent) => {
            message.error('已取消');
        };

        const handleChangeTabName = (tabId: string, newName: string) => {
            changeTabNameButtonIsLoading.value = true
            changeTabName(tabId, newName)
                .then(response => {
                    refreshData(active.value);
                })
                .catch(error => {
                    showErrorModal(`修改失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {
                    changeTabNameButtonIsLoading.value = false
                    newTabName.value = ''
                })
        }

        /** 确认前移 */
        const confirmMoveForward = () => {
            let ids: string[] = []
            info.value.forEach((tab: any) => {
                ids.push(tab.tabId)
            })
            console.log(ids)

            let temp = ids[active.value]
            ids[active.value] = ids[active.value - 1]
            ids[active.value - 1] = temp
            console.log(ids)

            sortTabs(ids)
                .then(response => {
                    message.success("左移成功")
                    refreshData(active.value - 1);
                })
                .catch(error => {
                    showErrorModal(`左移失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {

                })
        }

        /** 确认后移 */
        const confirmMoveBack = () => {
            let ids: string[] = []
            info.value.forEach((tab: any) => {
                ids.push(tab.tabId)
            })
            console.log(ids)

            let temp = ids[active.value]
            ids[active.value] = ids[active.value + 1]
            ids[active.value + 1] = temp
            console.log(ids)

            sortTabs(ids)
                .then(response => {
                    message.success("右移成功")
                    refreshData(active.value + 1);
                })
                .catch(error => {
                    showErrorModal(`右移失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {

                })
        }

        const confirmCreateTab = () => {
            createTab(createTabName.value)
                .then(response => {
                    message.success("创建新Tab成功");
                    refreshData(info.value.length);
                })
                .catch(error => {
                    showErrorModal(`右移失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {
                    createTabName.value = ''
                })
        }

        const comfirmDeleteTab = () => {
            deleteTab(info.value[active.value].tabId)
                .then(response => {
                    message.success("删除Tab成功");
                    refreshData(0);
                })
                .catch(error => {
                    showErrorModal(`删除Tab失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {

                })
        }

        const confirmCreatePage = () => {
            if (createPageName.value.length < 1 || createPageName.value.length > 50) {
                showErrorModal('页面标题的长度应在 1-50 个字符之间')
                return
            }
            if (isHot.value === undefined || isPureQandA.value === undefined) {
                showErrorModal('创建Page必须选择 IsHot 和 IsPureQ&A');
                return
            }
            if (isPureQandA.value === false && externalHtmlUrl.value.length === 0) {
                showErrorModal('创建内容为外部html的页面时，必须指定Html的Url');
            }

            createPage(info.value[active.value].tabId, createPageName.value, isPureQandA.value, isHot.value, externalHtmlUrl.value)
                .then(response => {
                    message.success("创建页面成功");
                    refreshData(active.value);
                })
                .catch(error => {
                    showErrorModal(`创建Page失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {
                    createPageName.value = '';
                    isPureQandA.value = undefined;
                    isHot.value = undefined;
                })
        }

        const confirmPageMove = (pageId: string, moveForword: boolean) => {
            let pageIds: string[] = []
            info.value[active.value].pageInfos.forEach((page: any) => {
                pageIds.push(page.pageId)
            })
            console.log(pageIds)

            let index = pageIds.indexOf(pageId)
            if (moveForword === true) {
                if (index === 0) {
                    showErrorModal("该页面已经在第一位了，不可前移");
                    return;
                }
                let temp = pageIds[index]
                pageIds[index] = pageIds[index - 1]
                pageIds[index - 1] = temp
            }
            else {
                if (index === info.value[active.value].pageInfos.length - 1) {
                    showErrorModal("该页面已经在最后一位了，不可后移");
                    return;
                }
                let temp = pageIds[index]
                pageIds[index] = pageIds[index + 1]
                pageIds[index + 1] = temp
            }
            console.log(pageIds)
            sortPagesInTab(info.value[active.value].tabId, pageIds)
                .then(response => {
                    message.success(moveForword === true ? "页面前移成功" : "页面后移成功");
                    refreshData(active.value);
                })
                .catch(error => {
                    showErrorModal(`移动Page失败, ${error.response.status}: ${error.response.data}`);
                })
                .finally(() => {

                })
        }

        const confirmDeletePage = (pageId: string) => {
            deletePage(pageId)
                .then(response => {
                    message.success("删除页面成功");
                    refreshData(active.value)
                })
                .catch(error => {
                    showErrorModal(`删除Page失败, ${error.response.status}: ${error.response.data}`);
                })
        }

        return {
            active,
            tabKey,
            info,
            newTabName,
            createTabName,
            changeTabNameButtonIsLoading,
            isPureQandA,
            radioStyle,
            isHot,
            externalHtmlUrl,
            createPageName,
            clickPage,
            handleChangeTabName,
            onClickTab,
            confirmChangeTabName,
            cancelChangeTabName,
            confirmMoveForward,
            confirmMoveBack,
            confirmCreateTab,
            comfirmDeleteTab,
            confirmCreatePage,
            confirmPageMove,
            confirmDeletePage,
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

.ant-input {
    width: 200px;
    margin: 0 8px 8px 0;
}

#delete-tab-button {
    margin-left: 40px;
}

.radio-group {
    float: left;
    position: relative;
    left: 20px;
}

.pageMoveForwardButton {
    margin-left: 20px;
}

.pageDeleteButton {
    margin-left: 10px;
}

.buttons {
    margin-top: 10px;
    margin-right: 71px;
    float: right;
    position: relative;
}
</style>