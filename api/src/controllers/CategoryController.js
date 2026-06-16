const { CategoryService } = require("../services");

exports.getAll = async (req, res) => {
    try {
        const data = await CategoryService.getAll();
        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getChildren = async (req, res) => {
    try {
        const data = await CategoryService.getChildren(req.params.id);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    const data = await CategoryService.create(req.body);
    res.json({ data });
};

exports.update = async (req, res) => {
    const data = await CategoryService.update(req.params.id, req.body);
    res.json({ data });
};

exports.remove = async (req, res) => {
    await CategoryService.remove(req.params.id);
    res.json({ message: "Deleted" });
};