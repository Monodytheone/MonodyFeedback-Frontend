<!-- Vant照片墙 -->
<template>
    <div v-title data-title="更换头像 - Monody Feedback"></div>
    <div class="clearfix">
        <router-link to="/">返回主界面</router-link><br><br>
        <a-upload accept=".png,.jpg,.jpeg,.webp" list-type="picture-card" :before-upload="beforeUpload"
            v-model:file-list="fileList" @preview="handlePreview" @remove="handleRemove">
            <div v-if="fileList.length < 1">
                <plus-outlined />
                <div class="ant-upload-text">选择图片</div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        <a-button type="primary" :disabled="fileList.length === 0" :loading="uploading" style="margin-top: 16px"
            @click="handleUpload">{{ uploading ? '上传中' : '上传' }}</a-button>
    </div>
</template>

<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, onBeforeMount } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import showErrorModal from '@/common/showErrorModal';
import showModalAndJump from '@/common/showModalAndJump';
import cosIdentityInstance from '@/api/instances/cosIdentityInstance';
import checkLoginStatusAndJumpToLoginPageIf401 from '@/common/checkLoginStatusAndJumpToLoginPageIf401';
import changeAvatarObjectKey from '@/api/identityAPIs/changeAvatarObjectKey';

function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    percent?: number;
    url?: string;
    preview?: string;
    originFileObj?: any;
}

interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
}

export default defineComponent({
    components: {
        PlusOutlined,
    },
    props: {
        continueSubmit: {
            type: Function,
            required: true,
        }
    },
    setup() {
        checkLoginStatusAndJumpToLoginPageIf401()


        const previewVisible = ref<boolean>(false);
        const previewImage = ref<string | undefined>('');

        const fileList = ref<FileItem[]>([]);

        const uploading = ref(false)

        const handleCancel = () => {
            previewVisible.value = false;
        };
        const handlePreview = async (file: FileItem) => {
            if (!file.url && !file.preview) {
                file.preview = (await getBase64(file.originFileObj)) as string;
            }
            previewImage.value = file.url || file.preview;
            previewVisible.value = true;
        };
        const handleChange = ({ fileList: newFileList }: FileInfo) => {
            fileList.value = newFileList;
        };

        // beforeUpload返回false，来禁止默认上传行为。同时更新fileList
        const beforeUpload: UploadProps['beforeUpload'] = file => {
            fileList.value = [...fileList.value, file];
            console.log(fileList)


            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isLt2M) {
                message.error('你不能上传大于5MB的图片');
            }
            return false;
        };

        const handleRemove: UploadProps['onRemove'] = (file: any) => {
            const index = fileList.value.indexOf(file);
            const newFileList = fileList.value.slice();
            newFileList.splice(index, 1);
            fileList.value = newFileList;
            console.log(fileList)
        };

        const handleUpload = () => {
            uploading.value = true
            const checkFileType = (fileName: string) => {
                if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')) {
                    return true
                }
                else return false
            }

            const file = fileList.value[0];
            if (checkFileType(file.name as string) === false) {
                showErrorModal('仅允许上传png, jpg, webp格式的图片')
            }
            if (file.originFileObj.size / 1024 / 1024 > 5) {
                showErrorModal('仅允许上传小于5MB的图片')
            }
            const fullObjectKey = `${process.env.VUE_APP_COS_AVATAR_FOLDER}/${localStorage.getItem('submitterId')}.png`

            cosIdentityInstance.putObject({
                Bucket: process.env.VUE_APP_COS_AVATAR_BUCKET,
                Region: process.env.VUE_APP_COS_AVATAR_REGION,
                Key: fullObjectKey,
                Body: file.originFileObj,
                onProgress() {

                }
            }, function (err, data) {
                uploading.value = false
                console.log(err || data);
                if (data.statusCode as number >= 400) {
                    showErrorModal('上传失败')
                }
                else {   // 上传成功后，向后端发请求更新该用户头像的对象键
                    changeAvatarObjectKey(fullObjectKey)
                        .then(response => {
                            showModalAndJump(true, '/', '设置头像成功', '主界面', '确定')
                        })
                        .catch(error => {
                            showErrorModal(`${error.response.status}： ${error.response.data}`)
                        })
                }
            })
        };

        return {
            uploading,
            previewVisible,
            previewImage,
            fileList,
            handleCancel,
            handlePreview,
            handleChange,
            beforeUpload,
            handleRemove,
            handleUpload,
        };
    },
});
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}

.clearfix {
    margin: 150px 0 0;
}
</style>
  