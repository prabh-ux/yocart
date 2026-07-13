'use client'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyUser } from "@/lib/features/user/authSlice";

const AuthInit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(verifyUser());
    }, [dispatch]);

    return null;
};

export default AuthInit;