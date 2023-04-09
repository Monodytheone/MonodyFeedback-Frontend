<template>
    <!-- 已登录时的显示: -->
    <a-affix :offset-top="0">
        <div class="head" v-if="isOnline">
            <img id="imgAvatar" :src="avatarUrl">
            <div id="userInfo">
                <div id="userName">{{ userName }}</div><br>
                <p id="userId">ID: {{ id }}</p>
                <a-button id="logoutButton" type="dashed" :size="'small'" @click="logout">退出登录</a-button>
            </div>
            <div style="clear:both"></div>
        </div>

        <!-- 未登录时的显示: -->
        <div id="loginButtonDiv" v-if="isOnline === false">
            <a-button id="loginButton" @click="jumpToLoginPage">登录</a-button>
        </div>
    </a-affix>
    <div style="height: 60px"></div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, getCurrentInstance, ref } from 'vue';
import { getUserInfo } from '@/api/identityAPIs/getUserInfo';
import { getAvatarUrl } from '@/api/identityAPIs/getAvatarUrl';
import logoutAPI from '@/api/identityAPIs/logout'
import router from '@/router';
export default defineComponent({
    name: 'Head',
    setup() {
        let isOnline = ref(false)
        let userName = ref('')
        let id = ref('')
        let avatarUrl = ref('')

        onBeforeMount(() => {
            getUserInfo()
                .then((response) => {
                    isOnline.value = true
                    userName.value = response.data.userName
                    id.value = response.data.id
                    localStorage.setItem("submitterId", id.value)

                    // 确认已登录后向后端请求头像Url
                    getAvatarUrl().then((response) => { avatarUrl.value = response.data })
                })
        })
        function logout() {
            logoutAPI()
            // localStorage.removeItem('jwt')  // 别删这一项，要不logout请求带不上jwt了，反正是无效的jwt，留着就留着吧
            localStorage.removeItem('submitterId')
            location.reload()  // 刷新页面
        }
        function jumpToLoginPage() {
            router.push('/login')
        }
        return {
            isOnline, userName, id, avatarUrl,
            logout, jumpToLoginPage,
        }
    }
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

#loginButtonDiv {
    position: fixed;
    /* 虽然用了固钉，但这个依然不能去，不然已登录和未登录两种状态总有一种显示不正常 */
    width: 350px;
    height: 60px;
    background-color: white;
}

#userName {
    font-weight: bold;
    font-size: 10px;
}

#userId {
    font-size: 1px;
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

#logoutButton {
    position: relative;
    color: cadetblue;
    bottom: 47px;
    left: 75px;
    font-size: smaller;
}

#logoutButton:hover {
    color: red;
    border-color: crimson;
}

#loginButton {
    margin-top: 13px;
}
</style>