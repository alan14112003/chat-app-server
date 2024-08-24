function createCodeEnum(prefix) {
  return {
    pleaseUpload: prefix + 'please_upload',
    pathRequired: prefix + 'path_required',
  }
}

const UploadCodeEnum = createCodeEnum('upload.')

export default UploadCodeEnum
