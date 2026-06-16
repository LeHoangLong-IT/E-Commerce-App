import axiosClient from "./axiosClient";

const categoryApi = {

    getAll() {
        return axiosClient.get("/categories");
    },


    // 🔥 NEW: lấy danh mục con theo parent_id
    getChildren(parentId) {
        return axiosClient.get(`/categories/${parentId}/children`);
    },

    create(data) {
        return axiosClient.post("/categories", data);
    },

    update(id, data) {
        return axiosClient.put(`/categories/${id}`, data);
    },

    delete(id) {
        return axiosClient.delete(`/categories/${id}`);
    }
};

export default categoryApi;