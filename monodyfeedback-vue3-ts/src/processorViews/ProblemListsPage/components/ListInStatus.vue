<template>
    <SubmissionItem v-for="(info) in submissionInfos" :info="info" :isShownForSubmitter="false" :key="key" />
</template>
<script lang="ts">
import { defineComponent, reactive, onBeforeMount, ref } from 'vue';
import SubmissionItem from '@/components/SubmissionItem.vue';
import SubmissionInfo from '@/types/SubmissionInfo';
import getSubmissionInfosInStatus from '@/api/processAPIs/getSubmissionInfosInStatus';
import DateTime from 'xdatetime';
import showErrorModal from '@/common/showErrorModal';
import SubmissionStatus from '@/types/SubmissionStatus';
export default defineComponent({
    components: {
        SubmissionItem,
    },
    setup(props, context) {
        const submissionInfos = reactive<SubmissionInfo[]>([]);
        const key = ref(0)

        onBeforeMount(() => {
            getSubmissionInfosInStatus(context.attrs.status as SubmissionStatus)
                .then(response => {
                    response.data.forEach((element: any) => {
                        submissionInfos.push(new SubmissionInfo(element.id, element.describe,
                            new DateTime(element.lastInteractionTime), element.status));
                    })
                })
                .catch(error => {
                    showErrorModal(`${error.response.status}: ${error.response.data}`)
                })
        })

        /** 删除旧条目 */
        const removeItemIfExisting = (submissionId: string) => {
            let index = -1
            for (let i = 0; i < submissionInfos.length; i++) {
                if (submissionInfos[i].Id.toLowerCase() == submissionId.toLowerCase()) {
                    index = i
                    break
                }
            }
            // 若元素存在于数组中，移除之
            if (index !== -1) {
                submissionInfos.splice(index, 1)
            }
            key.value++  // 更新key，强制子组件刷新
        }

        /** 在头部插入新的条目 */
        const unshiftNewItem = (newItem: SubmissionInfo) => {
            submissionInfos.unshift(newItem)// 在数组首部插入新的SubmissionInfo
            key.value++
        }


        context.expose({ removeItemIfExisting, unshiftNewItem })
        return {
            submissionInfos, key
        }
    }
})
</script>