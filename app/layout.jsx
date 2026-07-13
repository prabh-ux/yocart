import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import AuthInit from "@/components/user/AuthInit";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "YoCart. - Shop smarter",
    description: "YoCart. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <AuthInit />
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}