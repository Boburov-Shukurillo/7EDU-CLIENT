import axios from 'axios';
import apiEndpoins from '../api.endpoin';

const api = axios.create({
    baseURL: 'http://localhost:3000/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (process.env.NODE_ENV === 'production') {

            const data = { ...error.response?.data };
            if (data?.pin) data.pin = "***";
            if (data?.token) data.token = "***";
            if (data?.password) data.password = "***";

            console.error("API Error:", data?.message || error.message || "Noma'lum xatolik yuz berdi.");
        } else {

            console.error(error);
        }

        return Promise.reject(
            error.response?.data?.message ||
            error.message ||
            "Noma'lum xatolik yuz berdi."
        );
    }
);


export const updateUserProfilePic = async (userId: string, formData: FormData) => {
    const response = await api.post(apiEndpoins.updateUserProfilePic(userId), formData);
    return response.data;
};

export const register = async (data: object) => {
    const res = await api.post(apiEndpoins.registerUser, data);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const verifyCode = async (data: object) => {
    const res = await api.post(apiEndpoins.verifyCode, data);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const login = async (data: object) => {
    const res = await api.post(apiEndpoins.loginUser, data);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const getMe = async () => {
    const res = await api.get(apiEndpoins.getMe);
    return res.data;
};

export const checkEmail = async (email: string) => {
    try {
        const res = await api.get(`user/check?email=${encodeURIComponent(email)}`);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 400) {
                return { exists: true };
            }
        }
        throw new Error('Email tekshirishda xatolik');
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const res = await api.get(`/user/by-email`, {
            params: { email }
        });
        if (res.status === 404) return null;
        return res.data;
    } catch {
        return null;
    }
};

export const updateUser = async (id: string, data: object) => {
    const res = await api.patch(apiEndpoins.updateUser(id), data);
    return res.data.user;
};

export const deleteUserProfilePic = async (userId: string) => {
    const response = await api.delete(`/user/deleteProfilePic/${userId}`);
    return response.data;
};

export const markNotificationAsRead = async (notificationRecipientId: string) => {
    const res = await api.put(`/notifications/${notificationRecipientId}`, { isRead: true });
    return res.data;
};

export const forgotPassword = async (email: string) => {
    try {
        const res = await api.post('/auth/forgot-password', { email });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Foydalanuvchi topilmadi');
            }
        }
        throw error;
    }

};

// Courses
export const allCourse = async () => {
    const allCourse = await api.get(apiEndpoins.allCourse);
    return allCourse.data;
};

export const GetCourseById = async (id: string) => {
    const res = await api.get(apiEndpoins.getCategory(id));
    return res.data;
};

export const GetLessonsById = async (id: string) => {
    const res = await api.get(apiEndpoins.getLessonById(id))
    return res.data
}


// ai usage

export const sendrequestForAI = async (lessonId: string, message: string) => {
    const res = await api.post("/user/chat", {
        lessonId,
        message,
    });

    return res.data
}


export default api;