<template>
    <van-overlay :show="isShow">
        <div id="contentInOverlay">
            <van-loading size="50px"></van-loading>
            <p id="pInOverlay">{{ message }}</p>
        </div>
    </van-overlay>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        isShow: {
            type: Boolean,
            required: true,
        },
        message: {
            type: String,
            required: true,
        }
    }
})
</script>
<style scoped>
#pInOverlay {
    font-size: 35px;
    color: aqua;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

#contentInOverlay {
    margin-top: 30vh;
}
</style>