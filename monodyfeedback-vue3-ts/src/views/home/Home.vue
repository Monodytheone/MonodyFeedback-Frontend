<template>
    <div class="border-home">

        <Head />
        <ServiceProgress />
        <ServicesWrap />
        <FocusQuestions />
    </div>
    <div style="height: 1000px;"></div><!-- 添加1000像素的空内容 -->
</template>
<script lang="ts">
import router from '@/router';
import { defineComponent } from 'vue';
import Head from './components/Head.vue';
import ServiceProgress from './components/ServiceProcess.vue';
import ServicesWrap from './components/ServicesWrap.vue';
import FocusQuestions from './components/FocusQuestions.vue';
export default defineComponent({
    name: 'Home',
    components: {
        Head, ServiceProgress, ServicesWrap, FocusQuestions,
    },
})
</script>
<style scoped>
.border-home {
    width: 350px;
    height: 1000px;
    margin: auto;
    background-color: rgb(233, 236, 239);
}
</style>