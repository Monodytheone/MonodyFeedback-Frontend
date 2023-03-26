<!-- 重点关注 -->
<template>
    <div id="focusQuestions">
        <Title text="重点关注" />
        <div style="clear:both"></div>
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