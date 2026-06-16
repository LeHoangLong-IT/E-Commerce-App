exports.uploadImage = async (req, res) => {
    

        console.log("req-log ", req);
        
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const imageUrl =
            `${req.protocol}://${req.get("host")}` +
            `/uploads/products/${req.file.filename}`;

        return res.json({
            data: {
                filename: req.file.filename,
                url: imageUrl
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};