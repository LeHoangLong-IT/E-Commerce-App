import axiosClient from "./axiosClient.js";

const userApi = {
    getAll() {
        return axiosClient.get("/users");
    },

    getDetail(id) {
        return axiosClient.get(`/users/${id}`);
    },

    create(data) {
        return axiosClient.post("/users", data);
    },

    update(id, data) {
        return axiosClient.put(`/users/${id}`, data);
    },

    delete(id) {
        return axiosClient.delete(`/users/${id}`);
    },

    login(data) {
        return axiosClient.post("/users/sign-in", data);
    },

    register(data) {
        return axiosClient.post("/users/sign-up", data);
    },
};

export default userApi;