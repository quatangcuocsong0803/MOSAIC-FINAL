"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ResetPage() {
    const { signOut } = useClerk();
    const router = useRouter();
    const [status, setStatus] = useState("Đang dọn dẹp bộ nhớ đăng nhập và đồng bộ lại hệ thống...");

    useEffect(() => {
        let isMounted = true;

        const performReset = async () => {
            try {
                // Đăng xuất và xóa session/cookie Clerk
                await signOut();
                if (isMounted) {
                    setStatus("Đã dọn dẹp thành công! Đang chuyển hướng về trang chủ...");
                    router.push("/");
                }
            } catch (error) {
                console.error("Lỗi khi dọn dẹp phiên đăng nhập:", error);
                if (isMounted) {
                    // Ngay cả khi có lỗi, vẫn chuyển hướng về trang chủ
                    router.push("/");
                }
            }
        };

        performReset();

        return () => {
            isMounted = false;
        };
    }, [signOut, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
            <div className="flex flex-col items-center max-w-md w-full rounded-2xl border border-border bg-card p-8 shadow-lg text-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <h1 className="text-xl font-semibold tracking-tight">Khôi phục phiên làm việc</h1>
                <p className="text-sm text-muted-foreground">{status}</p>
            </div>
        </div>
    );
}
