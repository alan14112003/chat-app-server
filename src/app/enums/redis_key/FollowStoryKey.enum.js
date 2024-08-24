function createKeyEnum(name) {
  return {
    GET: name + 'get',
  }
}

const FollowStoryKeyEnum = createKeyEnum('followStories:')

export default FollowStoryKeyEnum
