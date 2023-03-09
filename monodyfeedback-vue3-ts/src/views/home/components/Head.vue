<template>
    <div class="head">

        <!-- 头像 -->
        <!-- Ant的任何显示图像的组件都只能读取在线图像，无法显示本地图像，以后头像在线读取了就可以用下面这行了 -->
        <!-- <a-avatar src="https://img0.baidu.com/it/u=2635634373,4014077767&fm=253&fmt=auto&app=120&f=JPEG?w=1067&h=800" /> -->
        <img id="imgAvatar" src="@/assets/avatar.png">
        <div id="userInfo">
            <div id="userName">昵称</div><br>
            <p id="userId">ID: 12345678</p>
        </div>
        <div style="clear:both"></div>
    </div>
    <div style="height: 60px"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'Head',
})
</script>

<style scoped>
#imgAvatar {
    /* width: 80px; */
    border-radius: 30px;
    float: left;
    width: 30px;
    margin: 15px;
}

.head {
    height: 60px;
    background-color: white;
}

#userName {
    font-weight: bold;
    font-size: 10px;
}

#userId {
    font-size: 7px;
    color: gray;
}

#userId,
#userName {
    float: left;
}

#userInfo {
    padding: 10px;
    float: right;
    width: 290px;
}

.head {
    position: fixed;
}
</style>