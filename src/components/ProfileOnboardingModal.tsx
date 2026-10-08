"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import InterestPicker from "@/src/components/InterestPicker";
import TypologyFields from "@/src/components/TypologyFields";
import { typologyFromProfile, type TypologyInput } from "@/lib/typology";
import {
  getUserProfile,
  saveTypology,
  type UserProfileData,
  type UpdateUserProfileInput,
} from "@/app/actions/profile";
import { saveOnboardingStep } from "@/app/actions/onboarding";
import { ONBOARDING_STEPS } from "@/lib/onboarding";
import { birthFacts } from "@/lib/profile-policy";
import { notifyAvatarUpdated } from "@/lib/avatar-events";
const fieldClass =
  "mt-2 w-full rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] p-3 text-[#5C4326]";
export default function ProfileOnboardingModal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileData | null>(null),
    [draft, setDraft] = useState<UpdateUserProfileInput>({}),
    [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [dismissed, setDismissed] = useState(false),
    [country, setCountry] = useState(""),
    [city, setCity] = useState(""),
    [locationMessage, setLocationMessage] = useState("");
  const [typology, setTypology] = useState<TypologyInput>({});
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setProfile(null);
    setDismissed(false);
    if (!isLoaded || !isSignedIn) return;
    let active = true;
    getUserProfile()
      .then((r) => {
        if (active && r.success && r.profile) {
          setProfile(r.profile);
          const parts = (r.profile.location || "")
            .split(",")
            .map((part) => part.trim());
          setCity(parts.length > 1 ? parts.slice(0, -1).join(", ") : "");
          setCountry(
            parts.length > 1 ? parts[parts.length - 1] : parts[0] || "",
          );
          setTypology(typologyFromProfile(r.profile));
          setDraft({
            username: r.profile.username || "",
            displayName: r.profile.displayName || "",
            dateOfBirth: r.profile.dateOfBirth
              ? new Date(r.profile.dateOfBirth).toISOString().slice(0, 10)
              : "",
            bio: r.profile.bio || "",
            location: r.profile.location || "",
            interestCodes: r.profile.interestCodes,
            hobbies: r.profile.hobbies || "",
          });
        }
      })
      .catch(() => {
        if (active) setError("Chưa tải được hồ sơ.");
      });
    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, user?.id]);
  const open = !!profile && !profile.onboardingCompletedAt && !dismissed;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const items = panel.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)",
      );
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [open]);
  if (!open || !profile || typeof document === "undefined") return null;
  const step = profile.onboardingStep;
  function change(field: keyof UpdateUserProfileInput, value: string) {
    setDraft((old) => ({ ...old, [field]: value }));
  }
  async function save(direction: "next" | "back" | "save", tests = false) {
    if (!profile) return;
    setPending(true);
    setError("");
    try {
      if (profile.onboardingStep === 7) {
        const t = await saveTypology(typology);
        if (!t.success) {
          setError(t.error || "Chưa lưu được typology.");
          return;
        }
      }
      const r = await saveOnboardingStep(
        profile.onboardingStep,
        direction,
        draft,
      );
      if (!r.success || !r.profile) {
        setError(r.error || "Chưa lưu được.");
        return;
      }
      setProfile(r.profile);
      if (direction === "save") setDismissed(true);
      if (r.profile.onboardingCompletedAt) {
        router.refresh();
        if (tests) router.push("/test");
      }
    } catch {
      setError("Mất kết nối. Vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    setPending(true);
    setError("");
    try {
      const body = new FormData();
      body.set("avatar", file);
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body,
      });
      const r = await response.json();
      if (!response.ok) throw Error(r.error);
      setProfile((p) => (p ? { ...p, avatarUrl: r.avatarUrl } : p));
      notifyAvatarUpdated(r.avatarUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa tải được ảnh.");
    } finally {
      setPending(false);
    }
  }
  function consentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Thiết bị không hỗ trợ định vị. Bạn có thể chọn quốc gia/thành phố bên dưới.",
      );
      return;
    }
    setPending(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setPending(false);
        setLocationMessage(
          "Đã cho phép định vị. Hãy chọn quốc gia/thành phố bạn muốn chia sẻ; MOSAIC không lưu tọa độ chính xác.",
        );
      },
      () => {
        setPending(false);
        setLocationMessage(
          "Không sử dụng định vị. Bạn có thể chọn quốc gia/thành phố thủ công.",
        );
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
  }
  const text = (
    field: keyof UpdateUserProfileInput,
    label: string,
    type = "text",
    required = false,
  ) => (
    <label className="block">
      {label}
      <input
        name={field}
        type={type}
        value={String(draft[field] || "")}
        onChange={(e) => change(field, e.target.value)}
        maxLength={field === "username" ? 30 : 80}
        required={required}
        max={
          type === "date" ? new Date().toISOString().slice(0, 10) : undefined
        }
        className={fieldClass}
      />
    </label>
  );
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3">
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#E2D4B7] bg-[#FCFBF8] p-6 sm:p-8"
      >
        <p className="text-xs tracking-widest text-[#8B6B4A]">
          MOSAIC · BƯỚC {step + 1} / 8
        </p>
        <h2
          id="onboarding-title"
          className="mt-3 font-serif text-3xl text-[#5C4326]"
        >
          {ONBOARDING_STEPS[step]}
        </h2>
        <progress
          aria-label="Tiến độ onboarding"
          value={step + 1}
          max={8}
          className="my-4 h-2 w-full accent-[#8B6B4A]"
        />
        {error && (
          <p role="alert" className="my-3 text-red-700">
            {error}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save("next");
          }}
        >
          <fieldset disabled={pending} className="space-y-4">
            {step === 0 && (
              <>
                {text("username", "Username duy nhất", "text", true)}
                <p className="text-sm">
                  3–30 chữ cái, số hoặc dấu gạch dưới. MID của bạn:{" "}
                  {profile.mid}.
                </p>
              </>
            )}
            {step === 1 &&
              text(
                "displayName",
                "Tên hiển thị (có thể đổi sau)",
                "text",
                true,
              )}
            {step === 2 && (
              <>
                {profile.avatarUrl && (
                  <img
                    src={profile.avatarUrl}
                    alt="Ảnh đại diện"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                )}
                <label className="block">
                  Chọn ảnh đại diện
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className={fieldClass}
                    onChange={(e) => void upload(e.target.files?.[0])}
                  />
                </label>
                <p className="text-sm">Có thể bỏ qua và bổ sung sau.</p>
              </>
            )}
            {step === 3 && (
              <>
                <p>
                  Chỉ xin quyền khi bạn đồng ý. Bạn có thể nhập nơi sống thủ
                  công hoặc bỏ qua.
                </p>
                <button
                  type="button"
                  onClick={consentLocation}
                  className="rounded-xl border border-[#8B6B4A] p-3"
                >
                  Đồng ý sử dụng vị trí
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocationMessage(
                      "Bạn đã từ chối định vị. Chọn quốc gia/thành phố thủ công bên dưới.",
                    )
                  }
                  className="ml-3"
                >
                  Không sử dụng
                </button>
                <p role="status">{locationMessage}</p>
                <label className="block">
                  Quốc gia
                  <input
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      change(
                        "location",
                        [city, e.target.value].filter(Boolean).join(", "),
                      );
                    }}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  Thành phố
                  <input
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      change(
                        "location",
                        [e.target.value, country].filter(Boolean).join(", "),
                      );
                    }}
                    className={fieldClass}
                  />
                </label>
                {draft.location && <p>Địa điểm đã lưu: {draft.location}</p>}
                <p className="text-sm">
                  Mặc định riêng tư. Có thể đổi quyền xem trong hồ sơ.
                </p>
              </>
            )}
            {step === 4 && (
              <>
                {text("dateOfBirth", "Ngày sinh", "date", true)}
                {draft.dateOfBirth && (
                  <p>
                    {birthFacts(String(draft.dateOfBirth)).age} tuổi ·{" "}
                    {birthFacts(String(draft.dateOfBirth)).zodiacSign}
                  </p>
                )}
                <p className="text-sm">
                  Ngày sinh mặc định riêng tư. Tuổi và cung hoàng đạo tự tính.
                </p>
              </>
            )}
            {step === 5 && (
              <label className="block">
                Giới thiệu (có thể bỏ qua)
                <textarea
                  value={draft.bio || ""}
                  onChange={(e) => change("bio", e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className={fieldClass}
                />
              </label>
            )}
            {step === 6 && (
              <InterestPicker
                value={draft.interestCodes || []}
                onChange={(codes) =>
                  setDraft((old) => ({ ...old, interestCodes: codes }))
                }
              />
            )}

            {step === 7 && (
              <>
                <TypologyFields value={typology} onChange={setTypology} />
                <p>
                  Hoàn tất hồ sơ để khám phá các bài test. Typology đã điền luôn
                  công khai và có thể chỉnh sửa sau.
                </p>
                <button
                  type="button"
                  onClick={() => void save("next", true)}
                  className="text-[#8B6B4A]"
                >
                  Kiểm tra ngay →
                </button>
              </>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2D4B7] pt-5">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => void save("back")}
              >
                ← Quay lại
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#8B6B4A] px-5 py-3 text-white"
              >
                {pending
                  ? "Đang lưu…"
                  : step === 7
                    ? "Hoàn tất"
                    : [2, 3, 5, 6].includes(step)
                      ? "Tiếp tục / Bỏ qua →"
                      : "Tiếp tục →"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => void save("save")}
              className="w-full py-2 text-sm text-[#8B6B4A]"
            >
              Lưu tiến độ và tiếp tục sau
            </button>
          </fieldset>
        </form>
      </div>
    </div>,
    document.body,
  );
}
