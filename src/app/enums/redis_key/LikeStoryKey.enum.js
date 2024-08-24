function createKeyEnum(name) {
  return {
    GET: name + 'get',
  }
}

const LikeStoryKeyEnum = createKeyEnum('likeStories:')

export default LikeStoryKeyEnum
