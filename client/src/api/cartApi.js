import axiosClient from './axiosClient';

const cartApi = {
    addToCart(data) {
        return axiosClient.post('/cart/add', data);
    },
    getCart() {
        return axiosClient.get('/cart');
    },
    updateQuantity(id, data) {
        return axiosClient.put(`/cart/update/${id}`, data);
    },
    removeCartItem(id) {
        return axiosClient.delete(`/cart/remove/${id}`);
    }
};

export default cartApi;
