<!-- 自助服务墙 -->
<template>
    <div id="servicesWrap">
        <Title text="自助服务" />
        <div style="clear:both"></div>
        <van-grid :border="false">
            <van-grid-item icon="column" text="问题反馈" to="/submit" />
            <van-grid-item icon="manager" text="更换头像" to="/setAvatar"/>
            <van-grid-item icon="setting" text="修改密码" />
            <van-grid-item icon="photo-o" text="文字" />
        </van-grid>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Title from './Title.vue';
export default defineComponent({
    name: 'ServicesWrap',
    components: {
        Title,
    },
})
</script>
<style scoped>
#servicesWrap {
    margin: 10px 0;
    padding: 0 0 5px 0;
    background-color: white;
}
</style>