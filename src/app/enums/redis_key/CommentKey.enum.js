function createKeyEnum(name) {
  return {
    ALL: name + 'all',
    GET: name + 'get',
  }
}

const CommentKeyEnum = createKeyEnum('comments:')

export default CommentKeyEnum
