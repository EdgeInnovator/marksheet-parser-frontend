import { toast } from "react-toastify";

export const setCokie = (name,value,days)=>{
    const date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()}`;
}

export const getCokie = (name)=>{
    const cookies = document.cookie.split(";");
    for (let cookie of cookies ){
        cookie = cookie.trim();
        const [key,value] = cookie.split("=");
        if(key===name)
            return value;
    }
    return null;
}

export const deleteCookie = (name)=>{
    document.cookie = `${name}=; expires=Thu, 1 Jan 1970 00:00:00 UTC`;
}

export const errorHandler = (e)=>{
    if(e.response && e.response.status ===400){
        toast.error(e.response.data.data);
    }
}