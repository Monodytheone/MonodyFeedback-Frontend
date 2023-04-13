<template>
    <SubmissionItem v-for="(info) in submissionInfos" :info="info" :isShownForSubmitter="false" :key="key"/>
</template>
<script lang="ts">
import { defineComponent, reactive, onBeforeMount, ref } from 'vue';
import SubmissionItem from '@/components/SubmissionItem.vue';
import SubmissionInfo from '@/types/SubmissionInfo';
import getToBeProcessedSubmissionInfosOfProcessor from '@/api/processAPIs/getToBeProcessedSubmissionInfosOfProcessor';
import DateTime from 'xdatetime';
import showErrorModal from '@/common/showErrorModal';
import assignSubmissions from '@/api/processAPIs/assignSubmissions';
export default defineComponent({
    components: {
        SubmissionItem,
    },
    props: {
        getNumber: { type: Function, required: true, },
        enableAssignButton: { type: Function, required: true },
    },
    setup(props, { expose }) {
        const submissionInfos = reactive<SubmissionInfo[]>([]);
        const key = ref(0)

        onBeforeMount(() => {
            getToBeProcessedSubmissionInfosOfProcessor()
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

        const handleAssign = () => {
            assignSubmissions()
                .then(response => {
                    props.getNumber()
                    response.data.forEach((element: any) => {
                        submissionInfos.push(new SubmissionInfo(element.id, element.describe,
                            new DateTime(element.lastInteractionTime), element.status));
                    });
                })
                .catch(error => {
                    showErrorModal(`${error.response.status}: ${error.response.data}`)
                })
                .finally(() => {
                    props.enableAssignButton()
                });       
        };

        const pushNewItem = (newItem: SubmissionInfo) => {
            submissionInfos.push(newItem)
            key.value++
        }

        expose({ handleAssign, pushNewItem })

        return {
            submissionInfos, key
        }
    }
})
</script>