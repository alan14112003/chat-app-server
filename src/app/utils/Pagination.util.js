const PaginationUtil = {
  /**
   * @param { import("sequelize").FindOptions } options
   */
  paginate: async (model, page, limit, options = {}) => {
    limit = limit ? +limit : 10
    page = page ? +page : 1

    let offset = 0 + (page - 1) * limit
    const [total, data] = await Promise.all([
      model.count({
        distinct: ['id'],
        ...options,
      }),

      model.findAll({
        offset: offset,
        limit: limit,
        ...options,
      }),
    ])

    return {
      total: total,
      data: data,
      curPage: page,
      perPage: limit,
    }
  },
}

export default PaginationUtil
