import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "YoCart. - Admin",
    description: "YoCart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
