function createKeyEnum(name) {
  return {
    ALL: name + 'all',
    GET: name + 'get',
  }
}

const AuthorKeyEnum = createKeyEnum('authors:')

export default AuthorKeyEnum
