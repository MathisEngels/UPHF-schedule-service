import axios from "axios"

const login = async (password) => {
    try {
        const response = await axios.post("/api/auth", { password: password });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const verify = async (token) => {
    try {
        const response = await axios.post("/api/verify", {}, { headers: { "authorization": token }});
        if (response.status === 200) return true;
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const getCDSI = async (token) => {
    try {
        const response = await axios.get("/api/get/cdsi", { headers: { "authorization": token }});
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getMEEF = async (token) => {
    try {
        const response = await axios.get("/api/get/meef", { headers: { "authorization": token }});
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const updateCDSI = async (token) => {
    try {
        const response = await axios.post("/api/update/cdsi", {}, { headers: { "authorization": token }});
        if (response.status === 200) return true;
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const updateMEEF = async (token) => {
    try {
        const response = await axios.post("/api/update/meef", {}, { headers: { "authorization": token }});
        if (response.status === 200) return true;
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export {
    login,
    verify,
    getCDSI,
    getMEEF,
    updateCDSI,
    updateMEEF,
}