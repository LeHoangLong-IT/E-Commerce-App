const UserRoutes = require('./UserRoutes');
const ProductRoutes = require('./ProductRoutes');
const CategoryRoutes = require('./CategoryRoutes');
const UploadRoutes = require('./UploadRoutes');
const CartRoutes = require('./CartRoutes');
const OrderRoutes = require('./OrderRoutes');

module.exports = (app) => {
    app.use('/api/users', UserRoutes);
    app.use('/api/products', ProductRoutes);
    app.use('/api/categories', CategoryRoutes);
    app.use('/api/uploads', UploadRoutes);
    app.use('/api/cart', CartRoutes);
    app.use('/api/orders', OrderRoutes);
};