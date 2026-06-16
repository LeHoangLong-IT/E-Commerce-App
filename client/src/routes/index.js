// Admin
import AdminLayout from "../layouts/Admin/AdminLayout";
import UserPage from "../pages/Admin/AdminUserPage/AdminUserPage";
import ProductPage from "../pages/Admin/ProductPage/ProductPage";
import DashboardPage from "../pages/Admin/DashboardPage/DashboardPage";
import CategoryPage from "../pages/Admin/CategoryPage/CategoryPage";
import AdminOrderPage from "../pages/Admin/AdminOrderPage/AdminOrderPage";

// User
import HomePage from "../pages/User/HomePage/HomePage";
import NotFoundPage from "../pages/User/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/User/OrderPage/OrderPage";
import ProductDetal from "../pages/User/ProductDetal/ProductDetal";
import SignInPage from "../pages/User/SignInPage/SignInPage";
import SignUpPage from "../pages/User/SignUpPage/SignUpPage";
import CartPage from "../pages/User/CartPage/CartPage";
import CheckoutPage from "../pages/User/CheckoutPage/CheckoutPage";
import TestUI from "../pages/TestUI";

export const routes = [
    {
        path: '/test-ui',
        page: TestUI,
        isShowHeader: false,
        hideSidebar: true
    },
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
        path: '/my-orders',
        page: OrderPage,
        isShowHeader: true,
        hideSidebar: true,
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true,
        hideSidebar: true,
    },
    {
        path: '/checkout',
        page: CheckoutPage,
        isShowHeader: true,
        hideSidebar: true,
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
        hideSidebar: true,
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
    {
        path: '/admin/orders',
        page: AdminOrderPage,
        layout: AdminLayout,
    },





    {
        path: '*',
        page: NotFoundPage,
    },
]