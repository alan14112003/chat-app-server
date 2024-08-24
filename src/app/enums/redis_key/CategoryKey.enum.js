function createKeyEnum(name) {
  return {
    ALL: name + 'all',
    GET: name + 'get',
  }
}

const CategoryKeyEnum = createKeyEnum('categories:')

export default CategoryKeyEnum
