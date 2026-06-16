const { ProductService } = require('../services');

exports.getAll = async (req, res) => {
    const data = await ProductService.getAll();

    res.status(200).json({
        status: "OK",
        data
    });
};

exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await ProductService.getBySlug(slug);

        if (!data) {
            return res.status(404).json({ status: "ERR", message: "Product not found" });
        }

        res.status(200).json({
            status: "OK",
            data
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {

        const product =
            await ProductService.create(
                req.body
            );

        res.json({
            status: "OK",
            data: product
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

exports.update = async (req, res) => {
    const data = await ProductService.update(req.params.id, req.body);

    res.status(200).json({
        status: "OK",
        data
    });
};

exports.delete = async (req, res) => {
    await ProductService.delete(req.params.id);

    res.status(200).json({
        status: "OK"
    });
};