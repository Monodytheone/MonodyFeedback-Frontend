<template>
    <SubmissionItem v-for="(info) in submissionInfos" :info="info" :isShownForSubmitter="false" :key="key" />
    <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="total" size="small" show-size-changer
        :pageSizeOptions="pageSizeOptions" @showSizeChange="onShowSizeChange" @change="onChange"
        :show-total="(totalNumber: number) => `共 ${totalNumber} 个`" />
</template>
<script lang="ts">
import { defineComponent, reactive, onBeforeMount, ref } from 'vue';
import SubmissionItem from '@/components/SubmissionItem.vue';
import SubmissionInfo from '@/types/SubmissionInfo';
import DateTime from 'xdatetime';
import getNumberOfSubmissionsInStatus from '@/api/processAPIs/getNumberOfSubmissionsInStatus';
import getPaginatedSubmissionInfosInStatus from '@/api/processAPIs/getPaginatedSubmissionInfosInStatus';
import showErrorModal from '@/common/showErrorModal';
import SubmissionStatus from '@/types/SubmissionStatus';
import { PropType } from 'vue';
export default defineComponent({
    props: {
        status: { type: Number as PropType<SubmissionStatus>, required: true },
    },
    components: {
        SubmissionItem,
    },
    setup(props, context) {
        const submissionInfos = reactive<SubmissionInfo[]>([]);
        const currentPage = ref(1)
        const pageSizeOptions = ref<string[]>(['3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20', '30'])
        const pageSize = ref(7)
        const total = ref(0)
        const key = ref(0)

        getNumberOfSubmissionsInStatus(props.status)
            .then(response => {
                total.value = response.data
            })
            .catch(error => {
                showErrorModal(`获取${props.status.toString()}状态的数量失败，${error.response.status}：${error.response.data}`)
            })

        onBeforeMount(() => {
            getPaginatedSubmissionInfosInStatus(props.status, currentPage.value, pageSize.value)
                .then(response => {
                    response.data.forEach((element: any) => {
                        submissionInfos.push(new SubmissionInfo(element.id, element.describe,
                            new DateTime(element.lastInteractionTime), element.status));
                    })
                })
                .catch(error => {
                    showErrorModal(`getPaginatedSubmissionInfosInStatus/${props.status}失败，${error.response.status}: ${error.response.data}`)
                })
        });

        const onShowSizeChange = (current: number, pageSizeNumber: number) => {
            pageSize.value = pageSizeNumber
            currentPage.value = 1
            getPaginatedSubmissionInfosInStatus(props.status, 1, pageSize.value)
                .then(response => {
                    submissionInfos.splice(0)  // 清空旧的列表数据
                    response.data.forEach((element: any) => {
                        submissionInfos.push(new SubmissionInfo(element.id, element.describe,
                            new DateTime(element.lastInteractionTime), element.status));
                    })
                })
                .catch(error => {
                    showErrorModal(`getPaginatedSubmissionInfosInStatus/${props.status}失败，${error.response.status}: ${error.response.data}`)
                })
        }

        const onChange = (page: number, pageSizeNumber: number) => {
            getPaginatedSubmissionInfosInStatus(props.status, currentPage.value, pageSize.value)
                .then(response => {
                    submissionInfos.splice(0)  // 清空旧的列表数据
                    response.data.forEach((element: any) => {
                        submissionInfos.push(new SubmissionInfo(element.id, element.describe,
                            new DateTime(element.lastInteractionTime), element.status));
                    })
                })
                .catch(error => {
                    showErrorModal(`getPaginatedSubmissionInfosInStatus/${props.status}失败，${error.response.status}: ${error.response.data}`)
                })
        }

        /** 在头部插入新的条目 */
        const unshiftNewItem = (newItem: SubmissionInfo) => {
            submissionInfos.unshift(newItem)// 在数组首部插入新的SubmissionInfo
            total.value++;
            key.value++
        }

        context.expose({ unshiftNewItem })

        return {
            submissionInfos, currentPage, pageSizeOptions, pageSize,
            total, key,
            onShowSizeChange, onChange,
        }
    }
})
</script>