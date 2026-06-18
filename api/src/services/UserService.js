const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAll = async () => {
    return await prisma.users.findMany();
}

exports.getById = async (id) => {
    return await prisma.users.findUnique({
        where: {
            id: Number(id),
        },
    });
};


exports.create = async (data) => {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.users.create({
        data: {
            ...data,
            password: hashedPassword
        }
    });
};

exports.update = async (id, data) => {
    return await prisma.users.update({
        where: {
            id: Number(id),
        },
        data,
    });
};

exports.delete = async (id) => {
    return await prisma.users.delete({
        where: {
            id: Number(id),
        },
    });
};



exports.signIn = async ({ username, password }) => {

    const user = await prisma.users.findUnique({
        where: {
            email: username
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Wrong password');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        access_token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar,
            gender: user.gender,
            date_of_birth: user.date_of_birth
        }
    };
};