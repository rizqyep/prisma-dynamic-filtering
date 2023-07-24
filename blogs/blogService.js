const { prisma } = require("../prisma-instance");
const { buildFilterQuery } = require("./buildQuery");

const getAll = async(filters) => {

    const usedFilter = buildFilterQuery(filters);

    const blogs = await prisma.blogs.findMany({
        ...usedFilter,
        include: {
            writer: true
        }
    })

    return blogs
}


module.exports = {
    getAll
}