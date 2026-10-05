"use client";

import { createPortal } from "react-dom";
import React, { useState, useEffect } from "react";
import { ZODIAC_SIGNS, ZODIAC_ICONS, type ZodiacSign } from "@/lib/zodiac";
import { updateUserProfile, type UserProfileData } from "@/app/actions/profile";
import { AlertCircle, X, Camera } from "@/src/components/ui/Icons";
import { supabase } from "@/lib/supabase";
import { notifyAvatarUpdated } from "@/lib/avatar-events";

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    dateOfBirth?: string | Date | null;
    zodiacSign?: string | null;
    hobbies?: string | null;
    location?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  };
  onSuccess?: (profile: UserProfileData) => void;
  title?: string;
  description?: string;
  showSkipButton?: boolean;
  onSkip?: () => void;
}

function toDateInputValue(dob: string | Date | null | undefined): string {
  if (!dob) return "";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export default function ProfileFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  title = "Chỉnh sửa hồ sơ cá nhân",
  description = "Cập nhật thông tin ngày sinh, cung hoàng đạo, địa chỉ và sở thích của bạn.",
  showSkipButton = false,
  onSkip,
}: ProfileFormModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [zodiacSign, setZodiacSign] = useState<string>("");
  const [hobbies, setHobbies] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      setAvatarUrl(initialData?.avatarUrl || "");
      setDateOfBirth(toDateInputValue(initialData?.dateOfBirth));
      setZodiacSign(initialData?.zodiacSign || "");
      setHobbies(initialData?.hobbies || "");
      setLocation(initialData?.location || "");
      setBio(initialData?.bio || "");
      setErrorMsg(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen || !mounted) return null;

  async function handleUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("Chưa nhận được file từ input!");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP...).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Dung lượng file tối đa là 5MB.");
      return;
    }

    setUploadingAvatar(true);
    setErrorMsg(null);

    // Trích xuất đuôi file một cách an toàn (mặc định png nếu lỗi)
    const rawExt = file.name.split('.').pop() || 'png';
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';

    // Tạo tên file mới hoàn toàn ngẫu nhiên và sạch sẽ (vd: avatar_1728000000_abc123.png)
    const cleanFilePath = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    console.log("Đường dẫn file chuẩn bị upload:", cleanFilePath);

    try {
      const { data, error } = await supabase.storage
        .from('mosaic-media') // Đảm bảo đúng tên bucket
        .upload(cleanFilePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error("Lỗi từ máy chủ Supabase:", error);
        throw new Error(error.message);
      }

      // Lấy link hiển thị
      const { data: publicUrlData } = supabase.storage
        .from('mosaic-media')
        .getPublicUrl(cleanFilePath);

      console.log("Upload thành công, Link ảnh:", publicUrlData.publicUrl);
      setAvatarUrl(publicUrlData.publicUrl);

    } catch (err: any) {
      console.error("Lỗi trong quá trình upload:", err);
      const msg = String(err?.message || "");
      setErrorMsg(
        /row-level security|policy|unauthorized|403/i.test(msg)
          ? "Supabase từ chối upload: bucket 'mosaic-media' chưa có policy cho phép INSERT. Hãy thêm Storage Policy."
          : msg || "Tải ảnh thất bại. Xem chi tiết trong F12 Console."
      );
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await updateUserProfile({
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        zodiacSign: zodiacSign || null,
        hobbies: hobbies || null,
        location: location || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      });

      if (!res.success || !res.profile) {
        setErrorMsg(res.error || "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
        return;
      }

      if (onSuccess) {
        onSuccess(res.profile);
      }
      notifyAvatarUpdated(res.profile.avatarUrl ?? null);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div
      className="mosaic-profile-dialog fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-[0_10px_40px_-5px_rgba(139,107,74,0.25)] border border-[#E2D4B7] max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden transition-all transform scale-100 text-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2D4B7]/70 flex items-start justify-between bg-[#FAF8F5] shrink-0">
          <div>
            <h2 id="profile-modal-title" className="text-xl font-serif font-bold text-[#5C4326]">
              {title}
            </h2>
            <p className="text-sm font-sans text-gray-500 mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={showSkipButton && onSkip ? onSkip : onClose}
            className="text-gray-400 hover:text-[#5C4326] p-1.5 rounded-lg hover:bg-[#E2D4B7]/30 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-current" strokeWidth={1.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" strokeWidth={1.5} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 0. Ảnh đại diện (Avatar) */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2D4B7]/70 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#8B6B4A]/50 bg-white shrink-0 shadow-sm">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-serif font-bold text-[#5C4326]">
                  M
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-sans font-semibold text-[#5C4326] mb-1">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#C49A6C] hover:bg-[#FAF8F5] text-[#8B6B4A] hover:text-[#5C4326] text-xs font-sans font-semibold rounded-lg cursor-pointer transition-colors shadow-xs">
                  <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{uploadingAvatar ? "Đang tải ảnh lên..." : "Tải ảnh từ máy"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingAvatar}
                    onChange={handleUploadAvatar}
                    className="hidden"
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="text-xs text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Gỡ ảnh
                  </button>
                )}
              </div>
              <p className="text-[11px] font-sans text-gray-500 mt-1">
                Lưu vào Supabase Storage (mosaic-media). Tối đa 5MB.
              </p>
            </div>
          </div>

          {/* 1. Ngày sinh */}
          <div>
            <label
              htmlFor="profile-dob"
              className="block text-sm font-sans font-semibold text-[#5C4326] mb-1.5"
            >
              Ngày sinh
            </label>
            <input
              id="profile-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E2D4B7] rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C] transition-all"
            />
            <p className="text-xs font-sans text-gray-500 mt-1">
              Định dạng sẽ được hiển thị theo chuẩn dd/mm/yyyy.
            </p>
          </div>

          {/* 2. Cung hoàng đạo - BẮT BUỘC DROPDOWN VỚI 12 CUNG CỐ ĐỊNH */}
          <div>
            <label
              htmlFor="profile-zodiac"
              className="block text-sm font-sans font-semibold text-[#5C4326] mb-1.5"
            >
              Cung hoàng đạo <span className="text-gray-400 font-normal">(12 Cung hoàng đạo)</span>
            </label>
            <div className="relative">
              <select
                id="profile-zodiac"
                value={zodiacSign}
                onChange={(e) => setZodiacSign(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E2D4B7] rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C] appearance-none transition-all pr-10 cursor-pointer"
              >
                <option value="" className="text-gray-400">-- Chọn cung hoàng đạo của bạn --</option>
                {ZODIAC_SIGNS.map((sign) => (
                  <option key={sign} value={sign} className="text-gray-800">
                    {ZODIAC_ICONS[sign] || ""} {sign}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8B6B4A]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs font-sans text-gray-500 mt-1">
              Lựa chọn đúng cung hoàng đạo để đồng bộ dữ liệu chuẩn với hệ thống.
            </p>
          </div>

          {/* 3. Địa chỉ sống */}
          <div>
            <label
              htmlFor="profile-location"
              className="block text-sm font-semibold text-[#8B7355] mb-1 font-sans"
            >
              Địa chỉ sống
            </label>
            <input
              id="profile-location"
              type="text"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Hà Nội, Việt Nam"
              className="w-full p-2 border border-[#8B7355]/30 rounded-lg focus:outline-none focus:border-[#8B7355] bg-white/50 text-gray-800 text-sm font-sans"
            />
          </div>

          {/* 4. Mô tả bản thân */}
          <div>
            <label
              htmlFor="profile-bio"
              className="block text-sm font-semibold text-[#8B7355] mb-1 font-sans"
            >
              Mô tả bản thân
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ví dụ: Sinh viên năm 3 Kinh tế Quốc tế - FTU. Đam mê nghiên cứu học thuật và khám phá bản thân qua MBTI..."
              className="w-full p-2 border border-[#8B7355]/30 rounded-lg focus:outline-none focus:border-[#8B7355] bg-white/50 text-gray-800 text-sm font-sans resize-none"
            />
          </div>

          {/* 5. Sở thích */}
          <div>
            <label
              htmlFor="profile-hobbies"
              className="block text-sm font-semibold text-[#8B7355] mb-1 font-sans"
            >
              Sở thích & Quan tâm
            </label>
            <textarea
              id="profile-hobbies"
              rows={3}
              name="hobbies"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              placeholder="Ví dụ: Đọc sách triết học, cờ vua, viết blog, leo núi, chiêm tinh học..."
              className="w-full p-2 border border-[#8B7355]/30 rounded-lg focus:outline-none focus:border-[#8B7355] bg-white/50 text-gray-800 text-sm font-sans placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs font-sans text-gray-500 mt-1">
              Bạn có thể nhập các sở thích phân cách nhau bởi dấu phẩy.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#E2D4B7]/70 flex items-center justify-end gap-3">
            {showSkipButton ? (
              <button
                type="button"
                onClick={onSkip}
                disabled={loading}
                className="px-4 py-2 text-sm font-sans font-medium text-gray-500 hover:text-gray-800 hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
              >
                Bỏ qua (Skip for now)
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-sans font-medium text-gray-500 hover:text-gray-800 hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-sans font-semibold text-white bg-[#8B6B4A] border border-[#C49A6C] hover:bg-[#5C4326] active:scale-[0.98] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>, document.body
  );
}
