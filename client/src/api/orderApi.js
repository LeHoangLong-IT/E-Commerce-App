import axiosClient from "./axiosClient";

const orderApi = {
    createOrder(data) {
        const url = '/orders/create';
        return axiosClient.post(url, data);
    },
    
    getAllOrderDetails() {
        const url = '/orders/my-orders';
        return axiosClient.get(url);
    },

    getDetailsOrder(id) {
        const url = `/orders/details/${id}`;
        return axiosClient.get(url);
    },

    getAllOrder() {
        const url = '/orders/get-all-orders';
        return axiosClient.get(url);
    },

    updateOrderStatus(id, data) {
        const url = `/orders/update-status/${id}`;
        return axiosClient.put(url, data);
    }
};

export default orderApi;
