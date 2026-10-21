"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./ProfileOnboardingWizard.module.css";
import { OnboardingFrameOrnaments, OnboardingSceneDecorations } from "./OnboardingDecorations";
import { useRouter } from "next/navigation";
import InterestPicker from "@/src/components/InterestPicker";
import TypologyFields from "@/src/components/TypologyFields";
import { typologyFromProfile, type TypologyInput } from "@/lib/typology";
import {
  saveTypology,
  type UserProfileData,
  type UpdateUserProfileInput,
} from "@/app/actions/profile";
import { saveOnboardingStep } from "@/app/actions/onboarding";
import { ONBOARDING_STEPS, onboardingPath, onboardingPauseKey } from "@/lib/onboarding";
import { birthFacts } from "@/lib/profile-policy";
import { notifyAvatarUpdated } from "@/lib/avatar-events";
const fieldClass =
  "mt-2 w-full rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] p-3 text-[#5C4326]";
const descriptions = [
  "Chọn một tên riêng để mọi người tìm thấy bạn trên MOSAIC.",
  "Bạn muốn mọi người gọi mình là gì?",
  "Thêm một hình ảnh để hồ sơ mang dấu ấn của bạn.",
  "Chia sẻ nơi bạn sống, theo mức độ bạn thấy thoải mái.",
  "MOSAIC sẽ tự tính tuổi và cung hoàng đạo từ ngày sinh của bạn.",
  "Một vài dòng nhỏ để mọi người hiểu bạn hơn.",
  "Những điều khiến bạn tò mò, say mê và muốn sẻ chia.",
  "Điền những hệ tính cách bạn đã biết, hoặc khám phá sau bằng bài test.",
];

export default function ProfileOnboardingWizard({ initialProfile, returnTo = "/profile" }: {
  initialProfile: UserProfileData;
  returnTo?: string;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState<UpdateUserProfileInput>(() => ({
    username: initialProfile.username || "",
    displayName: initialProfile.displayName || "",
    dateOfBirth: initialProfile.dateOfBirth ? new Date(initialProfile.dateOfBirth).toISOString().slice(0, 10) : "",
    bio: initialProfile.bio || "",
    location: initialProfile.location || "",
    interestCodes: initialProfile.interestCodes,
    hobbies: initialProfile.hobbies || "",
  }));
  const parts = (initialProfile.location || "").split(",").map((part) => part.trim());
  const [country, setCountry] = useState(parts.length > 1 ? parts[parts.length - 1] : parts[0] || "");
  const [city, setCity] = useState(parts.length > 1 ? parts.slice(0, -1).join(", ") : "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [typology, setTypology] = useState<TypologyInput>(() => typologyFromProfile(initialProfile));
  const heading = useRef<HTMLHeadingElement>(null);
  const step = profile.onboardingStep;
  useEffect(() => {
    heading.current?.focus();
    try { sessionStorage.removeItem(onboardingPauseKey(initialProfile.clerkId)); } catch {}
  }, [initialProfile.clerkId]);
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
      if (direction === "save") {
        try { sessionStorage.setItem(onboardingPauseKey(profile.clerkId), "1"); } catch {}
        router.push(returnTo);
      } else if (r.profile.onboardingCompletedAt) {
        router.push(tests ? "/test" : returnTo);
      } else {
        router.push(onboardingPath(r.profile.onboardingStep, returnTo));
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
  return (
    <div className={styles.page}>
      <OnboardingSceneDecorations step={step} />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="MOSAIC — trang chủ">MOSAIC</Link>
        <span className={styles.headerNote}>Mảnh ghép đầu tiên của bạn</span>
      </header>
      <div className={styles.layout}>
        <OnboardingFrameOrnaments />
        <aside className={styles.intro} aria-label="Các bước thiết lập">
          <p className={styles.eyebrow}>CHÀO MỪNG ĐẾN VỚI MOSAIC</p>
          <h2 className={styles.welcome}>Bắt đầu bằng<br />câu chuyện của bạn.</h2>
          <p className={styles.introText}>Từng mảnh ghép nhỏ sẽ tạo nên một hồ sơ rất riêng. Bạn luôn có thể chỉnh sửa sau.</p>
          <ol className={styles.steps}>
            {ONBOARDING_STEPS.map((label, index) => (
              <li key={label} aria-current={index === step ? "step" : undefined} data-done={index < step}>
                <span aria-hidden="true">{index < step ? "✓" : String(index + 1).padStart(2, "0")}</span>
                {label}
              </li>
            ))}
          </ol>
        </aside>
        <section className={styles.panel} aria-labelledby="onboarding-title" aria-busy={pending}>
          <div className={styles.stepHeading}>
            <p className={styles.eyebrow}>THIẾT LẬP HỒ SƠ</p>
            <span>Bước {step + 1} / {ONBOARDING_STEPS.length}</span>
          </div>
          <progress aria-label="Tiến độ thiết lập hồ sơ" value={step + 1} max={ONBOARDING_STEPS.length} className={styles.progress} />
          <h1 ref={heading} tabIndex={-1} id="onboarding-title" className={styles.title}>{ONBOARDING_STEPS[step]}</h1>
          <p className={styles.description}>{descriptions[step]}</p>
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
          <fieldset disabled={pending} className={styles.fields}>
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
            <div className={styles.actions}>
              <button
                type="button"
                disabled={step === 0}
                onClick={() => void save("back")}
              >
                ← Quay lại
              </button>
              <button
                type="submit"
                className={styles.next}
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
              className={styles.saveLater}
            >
              Lưu tiến độ và tiếp tục sau
            </button>
          </fieldset>
        </form>
        </section>
      </div>
    </div>
  );
}
