import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetal from "../pages/ProductDetal/ProductDetal";
import ProductPage from "../pages/ProductPage/ProductPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/products',
        page: ProductPage,
        isShowHeader: true,
    },
    {
        path: '/productDetal',
        page: ProductDetal,
        isShowHeader: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    },
]