import { create } from 'zustand'
import { persist } from 'zustand/middleware'




const store = (set, get) => ({
    cart: [],
    addToCart: (pizza) => set((state) => {
        const productInCart = state.cart.find((item) => item.id === pizza.id)
        if (productInCart) {
            return {
                cart: state.cart.map((item) =>
                    item.id === pizza.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            }
        } else {
            return { cart: [...state.cart, { ...pizza, quantity: 1 }] }
        }
    }),
    increaseQuantity: (id) => set((state) => ({
        cart: state.cart.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ),
    })),
    decreaseQuantity: (id) => set((state) => ({
        cart: state.cart.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ),
    })),
    removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
    })),
    clearCart: () => set({ cart: [] }),
})


export const useCart = create(
    persist(store, { name: 'cart-storage' })
)
