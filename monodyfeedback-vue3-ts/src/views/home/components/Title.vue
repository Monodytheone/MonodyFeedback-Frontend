<!-- 用了float，完了以后记得清除浮动 -->
<template>
    <!-- 标题左侧的蓝色竖线 -->
    <div id="area">
        <div id="title-line"></div>
        <b id="titleText">{{ $attrs.text }}</b>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'Title',
})
</script>

<style scoped>
#area {
    padding: 10px 0;
    position: relative;
}

#title-line {
    background-color: cornflowerblue;
    width: 3px;
    height: 12px;
    border-radius: 1.5px;
    float: left;
    margin: 4px 0 0 10px;
}

#titleText {
    font-size: 13px;
    float: left;
    padding: 0 0 0 7px;
}
</style>