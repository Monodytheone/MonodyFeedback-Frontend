import COS from 'cos-js-sdk-v5';
import showOfflineModalAndJump from '@/common/showOfflineModalAndJump';
import showErrorModal from '@/common/showErrorModal';

/** submitter提交Paragraph图片的cos实例 */
const cosSubmitIntance = new COS({
    /** @param options 获取临时密钥需要的参数对象 */
    getAuthorization: function (options, callback) {
        var url = `${process.env.VUE_APP_SUBMIT_SERVICE_URL}/api/Submitter/AskPutPictureTempCredentialOfSubmitter`;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('authorization', `Bearer ${localStorage.getItem('jwt')}`)
        xhr.onload = function (e: any) {
            try {
                var data = JSON.parse(e.target.responseText);
                var credentials = data.credentials;
            }
            catch (e) {
                if (xhr.status == 403) {
                    showErrorModal('403：您的账号不允许提交反馈哦')
                }
                else {
                    showOfflineModalAndJump();  // 若获取临时密钥失败就是401了，跳转至登录界面
                }
            }
            if (!data || !credentials) {
                return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
            }

            callback({
                TmpSecretId: credentials.tmpSecretId,
                TmpSecretKey: credentials.tmpSecretKey,
                SecurityToken: credentials.sessionToken,
                // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
            })
        }
        xhr.send();
    }
})

export default cosSubmitIntance