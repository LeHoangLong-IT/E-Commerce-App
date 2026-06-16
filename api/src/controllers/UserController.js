const { UserService } = require('../services');

exports.getAll = async (req, res) => {
    const data = await UserService.getAll();

    res.status(200).json(data);
};

exports.getById = async (req, res) => {
    const data = await UserService.getById(req.params.id);

    res.status(200).json(data);
};

exports.create = async (req, res) => {
    const data = await UserService.create(req.body);

    res.status(201).json(data);
};

exports.update = async (req, res) => {
    const data = await UserService.update(
        req.params.id,
        req.body
    );

    res.status(200).json(data);
};

exports.delete = async (req, res) => {
    await UserService.delete(req.params.id);

    res.status(200).json({
        success: true,
    });
};

exports.signIn = async (req, res) => {
    try {
        const data = await UserService.signIn(req.body);

        return res.status(200).json({
            status: 'OK',
            data
        });

    } catch (error) {
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
};