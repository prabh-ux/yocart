'use client'
import { addToCartLocal, removeFromCartLocal, syncCartUpdate } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const timerRef = useRef(null);

    const scheduleSync = () => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            dispatch((_, getState) => {
                const qty = getState().cart.cartItems[productId] || 0
                dispatch(syncCartUpdate({ productId, quantity: qty }))
            })
        }, 600)
    }

    const addToCartHandler = () => {
        dispatch(addToCartLocal({ productId }))
        scheduleSync()
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCartLocal({ productId }))
        scheduleSync()
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{cartItems[productId]}</p>
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter