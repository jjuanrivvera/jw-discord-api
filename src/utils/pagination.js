/**
 * Paginate Mongoose query results
 * @param {Model} model - Mongoose model
 * @param {Object} query - Query filter
 * @param {Object} options - Pagination options
 * @returns {Object} Paginated results
 */
async function paginate(model, query = {}, options = {}) {
    const page = Math.max(1, parseInt(options.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20));
    const skip = (page - 1) * limit;
    const sort = options.sort || { createdAt: -1 };

    const [data, total] = await Promise.all([
        model.find(query).sort(sort).skip(skip).limit(limit),
        model.countDocuments(query)
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
}

module.exports = { paginate };
