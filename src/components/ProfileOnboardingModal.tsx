"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserProfile, type UserProfileData } from "@/app/actions/profile";
import ProfileFormModal from "./ProfileFormModal";

const ONBOARDING_SKIPPED_KEY = "mosaic_onboarding_skipped";

export default function ProfileOnboardingModal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    // Chỉ chạy ở phía client khi người dùng đã đăng nhập thành công
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    // Kiểm tra cờ đã bỏ qua trong sessionStorage hoặc localStorage
    try {
      const sessionSkipped = sessionStorage.getItem(ONBOARDING_SKIPPED_KEY);
      const localSkipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY);
      if (sessionSkipped === "true" || localSkipped === "true") {
        return;
      }
    } catch {
      // Bỏ qua lỗi truy cập storage nếu trình duyệt chặn
    }

    // Lấy dữ liệu profile hiện tại từ server
    async function checkProfileCompleteness() {
      try {
        const res = await getUserProfile();
        if (res.success && res.profile) {
          setProfileData(res.profile);

          // Kiểm tra xem 1 trong 3 trường mới (dateOfBirth, zodiacSign, hobbies) có bị trống (null hoặc rỗng) không
          const isMissingDob = !res.profile.dateOfBirth;
          const isMissingZodiac = !res.profile.zodiacSign || res.profile.zodiacSign.trim() === "";
          const isMissingHobbies = !res.profile.hobbies || res.profile.hobbies.trim() === "";

          if (isMissingDob || isMissingZodiac || isMissingHobbies) {
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra onboarding profile:", err);
      }
    }

    checkProfileCompleteness();
  }, [isLoaded, isSignedIn, user]);

  function handleSkip() {
    try {
      // Lưu cờ vào cả sessionStorage và localStorage theo yêu cầu
      // để Modal không tự động nhảy ra làm phiền họ trong suốt phiên làm việc đó nữa
      sessionStorage.setItem(ONBOARDING_SKIPPED_KEY, "true");
      localStorage.setItem(ONBOARDING_SKIPPED_KEY, "true");
    } catch (e) {
      console.error(e);
    }
    setIsOpen(false);
  }

  function handleSuccess(updated: UserProfileData) {
    setProfileData(updated);
    try {
      sessionStorage.setItem(ONBOARDING_SKIPPED_KEY, "true");
    } catch {
      // ignore
    }
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <ProfileFormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialData={
        profileData
          ? {
              dateOfBirth: profileData.dateOfBirth,
              zodiacSign: profileData.zodiacSign,
              hobbies: profileData.hobbies,
              location: profileData.location,
              bio: profileData.bio,
              avatarUrl: profileData.avatarUrl,
            }
          : undefined
      }
      title="Hoàn thiện hồ sơ cá nhân"
      description="Chào mừng bạn đến với MOSAIC! Hãy bổ sung ngày sinh, cung hoàng đạo và sở thích để kết nối chính xác và thú vị hơn với các thành viên khác."
      showSkipButton={true}
      onSkip={handleSkip}
      onSuccess={handleSuccess}
    />
  );
}
