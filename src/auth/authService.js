import apiClient from "../services/apiClient";

export async function loginUser(email,password){

    const res = await apiClient.post(
        "/login",
        null,
        {
            params:{
                email,
                password
            }
        }
    );

    const {
        access_token,
        role,
        user_id
    } = res.data;

    localStorage.setItem(
        "access_token",
        access_token
    );

    localStorage.setItem(
        "user_role",
        role
    );

    localStorage.setItem(
        "user_id",
        user_id
    );

    return res.data;
}


export async function registerUser(payload){

    const res = await apiClient.post(
        "/register",
        null,
        {
            params:payload
        }
    );

    return res.data;
}


export function logoutUser(){

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");

    window.location.href="/login";
}


export function getToken(){
    return localStorage.getItem(
        "access_token"
    );
}


export function getUserRole(){
    return localStorage.getItem(
        "user_role"
    );
}


export function getUserId(){
    return localStorage.getItem(
        "user_id"
    );
}