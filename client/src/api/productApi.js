import axiosClient from "./axiosClient";

const productApi = {
    getAll() {
        return axiosClient.get("/products");
    },

    getById(id) {
        return axiosClient.get(`/products/${id}`);
    },

    getBySlug(slug) {
        return axiosClient.get(`/products/slug/${slug}`);
    },

    create(data) {
        return axiosClient.post("/products", data);
    },

    update(id, data) {
        return axiosClient.put(`/products/${id}`, data);
    },

    delete(id) {
        return axiosClient.delete(`/products/${id}`);
    }
};

export default productApi;