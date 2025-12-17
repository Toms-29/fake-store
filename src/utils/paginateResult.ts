export const paginateResult = async (model: any, page: number, limit: number, skip: number, sortField: string, sortOrder: number, filter?: object, populate?: object) => {
    const [data, total] = await Promise.all([
        model.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate(populate)
            .lean(),

        model.countDocuments(filter)
    ])

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        }
    }
}