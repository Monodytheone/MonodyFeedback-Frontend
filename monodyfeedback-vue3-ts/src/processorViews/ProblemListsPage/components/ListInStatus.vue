<template>
    <SubmissionItem v-for="(info) in submissionInfos" :info="info" :isShownForSubmitter="false" />
</template>
<script lang="ts">
import { defineComponent, reactive, onBeforeMount } from 'vue';
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
        return {
            submissionInfos,
        }
    }
})
</script>