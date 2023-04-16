<!-- 重点关注 -->
<template>
    <div id="focusQuestions">
        <Title text="常见问题" />
        <div style="clear:both"></div>
        <h1 style="color: #bbbbbb; padding: 40px 0 60px;">开发中...</h1>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Title from './Title.vue';
export default defineComponent({
    name: 'App',
    components: {
        Title,
    }
})
</script>
<style scoped>
#focusQuestions {
    margin: 10px 0;
    background-color: white;
}
</style>