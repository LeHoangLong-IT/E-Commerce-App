const prisma = require("../config/prisma");

exports.getAll = async () => {
    return await prisma.category.findMany({
        orderBy: { id: "desc" }
    });
};

/**
 * GET CHILDREN BY PARENT ID
 */
exports.getChildren = async (parentId) => {
    return await prisma.category.findMany({
        where: {
            parent_id: Number(parentId)
        },
        orderBy: { id: "desc" }
    });
};

exports.create = async (data) => {
    return await prisma.category.create({
        data: {
            name: data.name,
            parent_id: data.parent_id || null
        }
    });
};

exports.update = async (id, data) => {
    return await prisma.category.update({
        where: { id: Number(id) },
        data: {
            name: data.name,
            parent_id: data.parent_id || null
        }
    });
};

exports.remove = async (id) => {
    return await prisma.category.delete({
        where: { id: Number(id) }
    });
};