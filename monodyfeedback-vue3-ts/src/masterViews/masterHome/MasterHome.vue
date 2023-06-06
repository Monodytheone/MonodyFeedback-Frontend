<template>
    <div v-title data-title="管理员主页 - Monody Feedback" />
    <div class="background">
        <div class="whiteBackground">
            <div class="displayRange">
                <h1 id="left-header">
                    MonodyFeedback
                    <!-- <a-button v-if="masterIsOnline == false" id="loginButton" @click="jumpToMasterLoginPage">登录</a-button> -->
                    <a-button id="logoutButton" @click="handleLogout">退出登录</a-button>
                </h1>
                <h1 id="right-header"> -- 管理员主页</h1>

                <div style="height: 10px; background-color: #e9ecef; width: 350px; position: relative; right: 15px" />

                <Title text="功能墙" style="position: relative; right: 8px" />
                <div style="clear:both" />
                <van-grid :border="false" column-num="3">
                    <van-grid-item icon="question" text="FAQ管理" to="master/FAQ" />
                    <van-grid-item icon="font" text="问卷管理" to="" />
                    <van-grid-item icon="comment" text="反馈处理管理" to="" />
                </van-grid>


                <div style="height: 500px"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Title from '@/views/home/components/Title.vue';
import getMasterInfo from '@/api/identityAPIs/getMasterInfo';
import showModalAndJump from '@/common/showModalAndJump';
import masterLogout from '@/api/identityAPIs/masterLogout';
export default defineComponent({
    name: 'MasterHome',
    components: {
        Title,
    },
    setup() {
        const masterIsOnline = ref(false)
        const masterName = ref('')

        getMasterInfo()
            .then(response => {
                masterName.value = response.data.userName
            })
            .catch(error => {
                const statusCode = error.response.status
                if (statusCode == 401) {
                    showModalAndJump(false, '/masterLogin', '登录失效，请重新登录', '管理员登录页面', '去登录')
                }
                else if(statusCode == 403) {
                    showModalAndJump(false, '/masterLogin', '登录失效，请重新登录', '管理员登录页面', '去登录')
                }
            });

        const handleLogout = () => {
            console.log('masterLogout')
            masterLogout();
            location.reload()  // 刷新页面
        }

        return {
            masterIsOnline,
            handleLogout,
        }
    }
})
</script>

<style scoped>
.background {
    background-color: #fbfaf9;
}

.whiteBackground {
    width: 350px;
    margin: auto;
    background-color: white;
}

.displayRange {
    width: 320px;
    margin: auto;
}

#left-header {
    text-align: left;
    /* margin: 20px 0 0 0; */
    margin: 0;
    padding-top: 20px;
}

#right-header {
    text-align: right;
}

#loginButton {
    position: relative;
    bottom: 20px;
    left: 10px;
}

#logoutButton {
    color: cadetblue;
    position: relative;
    bottom: 20px;
    left: 10px;
}

#logoutButton:hover {
    color: red;
    border-color: crimson;
}
</style>