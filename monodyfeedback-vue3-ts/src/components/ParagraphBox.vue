<template>
    <a-collapse v-model:activeKey="activeKey" :expand-icon-position="isRight ? 'right' : 'left'" :style="collapseStyle">
        <a-collapse-panel key="1" :header="headerText">
            <p id="p-text" :style="fontColorStyle">{{ textContent }}</p>
            <a-image-preview-group>
                <a-image v-for="(picUrl) in pictureUrls" :width="75" :height="75" :src="picUrl" />
            </a-image-preview-group>
        </a-collapse-panel>
    </a-collapse>
    <div style="margin-top: 7px;" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import DateTime from 'xdatetime';
import ParagraphSender from '@/types/ParapraphSender';
import { PropType } from 'vue';
export default defineComponent({
    props: {
        time: { type: DateTime, required: true, },
        // sentBySubmitter: { type: Boolean, required: true, },
        sender: { type: Number as PropType<ParagraphSender>, required: true },
        showForSubmitter: { type: Boolean, required: true, },
        textContent: { type: String, required: true, },
        pictureUrls: { type: Array, required: true, },
        submitterName: { type: String, required: false },
    },
    setup(props) {
        const activeKey = ref(['1']);
        const isRight = (props.sender == ParagraphSender.Submitter) === props.showForSubmitter  // 是否处于右侧（自己发的内容处于右侧，对方发的内容处于左侧）
        let collapseStyle = isRight ? 'margin-left: 100px; text-align: left' : 'margin-right: 100px; text-align: left'
        const timeText = props.time.toString('yyyy-MM-dd hh:mm:ss')
        let fontColorStyle = isRight ? 'color: gray' : '';  // 若处于右侧，则字体颜色置灰

        let headerText  // 块标题
        if (isRight) {
            headerText = `${props.showForSubmitter ? '我，提交于：' : '我，回复于：'}${timeText}`
        }
        else {
            headerText = `${props.showForSubmitter ? '客服，回复于：' : `${props.submitterName}，提交于：`}${timeText}`
        }

        // 系统发的消息，居中且不置灰
        if (props.sender == ParagraphSender.System) {
            collapseStyle = 'margin-left: 60px; margin-right: 60px;'
            headerText = `系统，发送于：${timeText}`
            fontColorStyle = ''
        }

        return {
            activeKey,
            isRight,
            collapseStyle,
            headerText,
            fontColorStyle,
        }
    }
})
</script>

<style scoped>
#p-text {
    word-wrap: break-word;
}
</style>
