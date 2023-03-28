<template>
    <h1>更改头像</h1>
</template>
<script lang="ts">
import checkLoginStatusAndJumpToLoginPageIf401 from '@/common/checkLoginStatusAndJumpToLoginPageIf401';
import { defineComponent, onBeforeMount } from 'vue';
export default defineComponent({
    setup() {
        onBeforeMount(() => {
            checkLoginStatusAndJumpToLoginPageIf401();
        })
    }
})
</script>