// Admin
import AdminLayout from "../layouts/Admin/AdminLayout";
import UserPage from "../pages/Admin/AdminUserPage/AdminUserPage";
import ProductPage from "../pages/Admin/ProductPage/ProductPage";
import DashboardPage from "../pages/Admin/DashboardPage/DashboardPage";
import CategoryPage from "../pages/Admin/CategoryPage/CategoryPage";

// User
import HomePage from "../pages/User/HomePage/HomePage";
import NotFoundPage from "../pages/User/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/User/OrderPage/OrderPage";
import ProductDetal from "../pages/User/ProductDetal/ProductDetal";
import SignInPage from "../pages/User/SignInPage/SignInPage";
import SignUpPage from "../pages/User/SignUpPage/SignUpPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/sign-in',
        page: SignInPage,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
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
        path: '/product/:slug',
        page: ProductDetal,
        isShowHeader: true,
    },

    // ADMIN
    {
        path: '/admin',
        page: DashboardPage,
        layout: AdminLayout,
    },
    {
        path: '/admin/dashboard',
        page: DashboardPage,
        layout: AdminLayout,

    },
    {
        path: '/admin/users',
        page: UserPage,
        layout: AdminLayout,
    },
    {
        path: '/admin/categories',
        page: CategoryPage,
        layout: AdminLayout,
    },
    {
        path: '/admin/products',
        page: ProductPage,
        layout: AdminLayout,
    },
    // {
    //     path: '/admin/orders',
    //     page: AdminOrderPage,
    // },





    {
        path: '*',
        page: NotFoundPage,
    },
]