const prisma = require('../config/prisma');

exports.getAll = async () => {
    return await prisma.product.findMany({
    include: {

        primary_category: true,

        product_categories: {
            include: {
                category: true
            }
        }
    }
});
};

exports.getBySlug = async (slug) => {
    return await prisma.product.findUnique({
        where: { slug: slug },
        include: {
            primary_category: true,
            product_categories: {
                include: {
                    category: true
                }
            }
        }
    });
};

function generateSlug(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

exports.create = async (data) => {

    const {
        secondary_categories = [],
        ...productData
    } = data;

    // Automatically generate slug from name
    if (productData.name) {
        productData.slug = generateSlug(productData.name);
    }

    return await prisma.product.create({
        data: {
            ...productData,

            product_categories: {
                create: secondary_categories.map(
                    categoryId => ({
                        category: {
                            connect: {
                                id: categoryId
                            }
                        }
                    })
                )
            }
        },
        include: {
            primary_category: true,
            product_categories: {
                include: {
                    category: true
                }
            }
        }
    });
};
exports.update = async (id, data) => {

    const {
        secondary_categories = [],
        ...productData
    } = data;

    // Automatically update slug if name is changed
    if (productData.name) {
        productData.slug = generateSlug(productData.name);
    }

    await prisma.product_category.deleteMany({
        where: {
            product_id: Number(id)
        }
    });

    return await prisma.product.update({
        where: {
            id: Number(id)
        },
        data: {
            ...productData,

            product_categories: {
                create: secondary_categories.map(
                    categoryId => ({
                        category: {
                            connect: {
                                id: categoryId
                            }
                        }
                    })
                )
            }
        },
        include: {
            primary_category: true,
            product_categories: {
                include: {
                    category: true
                }
            }
        }
    });
};

exports.delete = async (id) => {
    return await prisma.product.delete({
        where: { id: Number(id) }
    });
};