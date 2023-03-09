<template>
    <div id="serviceProcess">
        <Title text="服务进度" />
        <router-link id="clickToJump" to="/progress">查看服务进度 <van-icon name="arrow" size="17px"/></router-link>
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
#serviceProcess {
    height: 40px;
    background-color: white;
    margin: 10px 0;
}

#clickToJump {
    position: relative;
    top: -10px;
    left: 80px;
    color: gray;
}

#clickToJump:hover {
    color: #b4ba40;
}
</style>