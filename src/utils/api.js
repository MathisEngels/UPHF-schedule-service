import axios from "axios";

const login = async (password) => {
    try {
        const response = await axios.post("/api/auth", { password: password });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const verify = async (token) => {
    try {
        const response = await axios.post("/api/verify", {}, { headers: { authorization: token } });
        if (response.status === 200) return true;
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const getStatus = async (token) => {
    try {
        const response = await axios.get("/api/status", { headers: { authorization: token } });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const getSchedule = async (token, classname) => {
    try {
        const response = await axios.get(`/api/get/${classname}`, { headers: { authorization: token } });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const updateSchedule = async (token, classname) => {
    try {
        const response = await axios.post(`/api/update/${classname}`, {}, { headers: { authorization: token } });
        if (response.status === 200) return true;
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export { login, verify, getStatus, getSchedule, updateSchedule };
