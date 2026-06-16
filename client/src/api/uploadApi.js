import axiosClient from "./axiosClient";

const uploadApi = {
    upload(file) {

        return axiosClient.post(
            "/uploads",
            file,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
    }
};

export default uploadApi;