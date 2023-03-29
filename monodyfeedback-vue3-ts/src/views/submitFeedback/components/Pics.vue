<!-- Vant照片墙 -->
<template>
    <div class="clearfix">
        <a-upload accept=".png,.jpg,.jpeg,.webp" list-type="picture-card" :before-upload="beforeUpload"
            v-model:file-list="fileList" @preview="handlePreview" @remove="handleRemove">
            <div v-if="fileList.length < 10">
                <plus-outlined />
                <div class="ant-upload-text">选择图片</div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, watch } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import cosSubmitIntance from '@/api/instances/cosSubmitIntance';
import { PictureInfo } from '@/api/submitAPIs/postSubmit';
import { message } from 'ant-design-vue';

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
    setup(props, { expose }) {
        const previewVisible = ref<boolean>(false);
        const previewImage = ref<string | undefined>('');

        const fileList = ref<FileItem[]>([]);

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


            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!isLt2M) {
                message.error('你不能上传大于10MB的图片');
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

        let uploadedPictureInfos: PictureInfo[] = []
        let completedUploadNumber = ref(0)  // 已完成上传的数量（不论成功还是失败）
        watch(completedUploadNumber, () => {  // 全部上传完毕后执行下一步动作，向后端提交Submission
            if (completedUploadNumber.value === fileList.value.length) {
                props.continueSubmit(uploadedPictureInfos)
            }
        })

        /** 上传fileList中的全部图片 */
        const handleUpload = () => {
            if (fileList.value.length === 0) {  // 若没有图片则直接执行下一步动作，向后端提交Submission
                props.continueSubmit(uploadedPictureInfos)
            }

            const checkFileType = (fileName: string) => {
                if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')) {
                    return true
                }
                else return false
            }
            for (let index = 0; index < fileList.value.length; index++) {
                let file = fileList.value[index]
                if (checkFileType(file.name as string) == false) {
                    console.error(`图 ${index + 1} 错误：只允许上传图片`)
                    completedUploadNumber.value += 1
                    continue
                }
                // 禁止大于10MB的图片上传
                if (file.originFileObj.size / 1024 / 1024 > 10) {
                    console.error(`图 ${index + 1} 大于10MB`)
                    completedUploadNumber.value += 1
                    continue
                }
                let bucket = process.env.VUE_APP_COS_PICTURE_BUCKET;
                let region = process.env.VUE_APP_COS_PICTURE_REGION;
                let fullObjectKey = `${process.env.VUE_APP_COS_PICTURE_FOLDER}/${localStorage.getItem('submitterId')}/${file.uid}.png`;  // id记得用小写字母
                cosSubmitIntance.putObject({
                    Bucket: bucket,
                    Region: region,
                    Key: fullObjectKey,  // id记得用小写字母
                    Body: file.originFileObj,
                    onProgress: function (progressData) {
                    }
                }, function (err, data) {
                    completedUploadNumber.value += 1
                    console.log(err || data);
                    if (data.statusCode as number < 400) {
                        console.log('push')
                        uploadedPictureInfos.push(new PictureInfo(bucket, region, fullObjectKey))
                    }
                })
            }
        };

        expose({ handleUpload })  // 暴露出去，供父级组件调用来上传图片

        return {
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
</style>
  