"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./ProfileOnboardingWizard.module.css";
import {
  OnboardingFrameOrnaments,
  OnboardingSceneDecorations,
} from "./OnboardingDecorations";
import { useRouter } from "next/navigation";
import InterestPicker from "@/src/components/InterestPicker";
import TypologyFields from "@/src/components/TypologyFields";
import { typologyFromProfile, type TypologyInput } from "@/lib/typology";
import {
  type UserProfileData,
  type UpdateUserProfileInput,
} from "@/app/actions/profile";
import { saveOnboardingDraft } from "@/app/actions/onboarding";
import { ONBOARDING_STEPS, onboardingPauseKey } from "@/lib/onboarding";
import LocationPicker from "./LocationPicker";
import { onboardingDraftKey, stepError } from "@/lib/onboarding-draft";
import { notifyAvatarUpdated } from "@/lib/avatar-events";
import { clearSessionBootstrap } from '@/lib/session-bootstrap';
import { prepareAvatar } from '@/lib/avatar/prepare';
import { uploadResponse } from '@/lib/upload-response';
const fieldClass =
  "mt-2 w-full rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] p-3 text-[#5C4326]";
const descriptions = [
  "Chọn một tên riêng để mọi người tìm thấy bạn trên MOSAIC.",
  "Bạn muốn mọi người gọi mình là gì?",
  "Thêm một hình ảnh để hồ sơ mang dấu ấn của bạn.",
  "Chia sẻ nơi bạn sống, theo mức độ bạn thấy thoải mái.",
  "Chọn ngày sinh của bạn.",
  "Một vài dòng nhỏ để mọi người hiểu bạn hơn.",
  "Những điều khiến bạn tò mò, say mê và muốn sẻ chia.",
  "Điền những hệ tính cách bạn đã biết, hoặc khám phá sau bằng bài test.",
];

export default function ProfileOnboardingWizard({
  initialProfile,
  returnTo = "/profile",
}: {
  initialProfile: UserProfileData;
  returnTo?: string;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState<UpdateUserProfileInput>(() => ({
    username: initialProfile.username || "",
    displayName: initialProfile.displayName || "",
    dateOfBirth: initialProfile.dateOfBirth
      ? new Date(initialProfile.dateOfBirth).toISOString().slice(0, 10)
      : "",
    bio: initialProfile.bio || "",
    location: initialProfile.location || "",
    interestCodes: initialProfile.interestCodes,
    hobbies: initialProfile.hobbies || "",
  }));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(initialProfile.onboardingStep);
  const [restored, setRestored] = useState(false);
  const [motion, setMotion] = useState("forward");
  const [typology, setTypology] = useState<TypologyInput>(() =>
    typologyFromProfile(initialProfile),
  );
  const [avatarFile, setAvatarFile] = useState<File>();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(onboardingDraftKey(initialProfile.clerkId)) ||
          "null",
      );
      if (
        saved &&
        Number.isInteger(saved.step) &&
        saved.step >= 0 &&
        saved.step < 8 &&
        saved.fields &&
        saved.typology
      ) {
        setDraft(saved.fields);
        setTypology(saved.typology);
        setStep(saved.step);
      }
    } catch {
    } finally {
      setRestored(true);
    }
  }, [initialProfile.clerkId]);
  useEffect(() => {
    if (restored)
      try {
        localStorage.setItem(
          onboardingDraftKey(initialProfile.clerkId),
          JSON.stringify({ step, fields: draft, typology }),
        );
      } catch {}
  }, [step, draft, typology, restored, initialProfile.clerkId]);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    heading.current?.focus();
    try {
      sessionStorage.removeItem(onboardingPauseKey(initialProfile.clerkId));
    } catch {}
  }, [initialProfile.clerkId]);
  function change(field: keyof UpdateUserProfileInput, value: string) {
    setDraft((old) => ({ ...old, [field]: value }));
  }
  async function save(direction: "next" | "back" | "save", tests = false) {
    setError("");
    if (direction === "back") {
      setMotion("back");
      setStep((s) => Math.max(0, s - 1));
      return;
    }
    if (direction === "next") {
      const message = stepError(step, draft);
      if (message) {
        setError(message);
        return;
      }
      if (step < 7) {
        setMotion("forward");
        setStep((s) => s + 1);
        return;
      }
    }
    setPending(true);
    try {
      if (avatarFile) {
        const body = new FormData();
        body.set("avatar", await prepareAvatar(avatarFile));
        const response = await fetch("/api/profile/avatar", {
          method: "POST",
          body,
        });
        const uploaded = await uploadResponse<{ error?: string; avatarUrl: string }>(response);
        if (!response.ok) throw Error(uploaded.error);
        notifyAvatarUpdated(uploaded.avatarUrl);
        setAvatarFile(undefined);
      }
      const r = await saveOnboardingDraft(
        step,
        direction === "next",
        draft,
        typology,
      );
      if (!r.success || !("profile" in r) || !r.profile) {
        setError(
          r.error || "Chưa lưu được. Bản nháp vẫn còn trên thiết bị này.",
        );
        return;
      }
      try {
        clearSessionBootstrap();
        localStorage.removeItem(onboardingDraftKey(profile.clerkId));
        if (direction === "save")
          sessionStorage.setItem(onboardingPauseKey(profile.clerkId), "1");
      } catch {}
      router.push(tests ? "/test" : returnTo);
      router.refresh();
    } catch {
      setError("Mất kết nối. Bản nháp vẫn còn trên thiết bị này.");
    } finally {
      setPending(false);
    }
  }
  function upload(file: File | undefined) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Ảnh cần nhỏ hơn 3 MB.");
      return;
    }
    setAvatarFile(file);
    setProfile((p) => ({ ...p, avatarUrl: URL.createObjectURL(file) }));
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
        <Link href="/" className={styles.brand} aria-label="MOSAIC — trang chủ">
          <img src="/figma-home/logo-combined.png" alt="MOSAIC" width={1536} height={1024} />
        </Link>
      </header>
      <div className={styles.layout}>
        <OnboardingFrameOrnaments />
        <aside className={styles.intro} aria-label="Các bước thiết lập">
          <p className={styles.eyebrow}>CHÀO MỪNG ĐẾN VỚI MOSAIC</p>
          <h2 className={styles.welcome}>
            Bắt đầu bằng
            <br />
            câu chuyện của bạn.
          </h2>
          <p className={styles.introText}>
            Từng mảnh ghép nhỏ sẽ tạo nên một hồ sơ rất riêng. Các bước được giữ
            nháp trên thiết bị này cho đến khi bạn lưu.
          </p>
          <ol className={styles.steps}>
            {ONBOARDING_STEPS.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? "step" : undefined}
                data-done={index < step}
              >
                <span aria-hidden="true">
                  {index < step ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </aside>
        <section
          className={styles.panel}
          aria-labelledby="onboarding-title"
          aria-busy={pending}
        >
          <div className={styles.stepHeading}>
            <p className={styles.eyebrow}>THIẾT LẬP HỒ SƠ</p>
            <span>
              Bước {step + 1} / {ONBOARDING_STEPS.length}
            </span>
          </div>
          <progress
            aria-label="Tiến độ thiết lập hồ sơ"
            value={step + 1}
            max={ONBOARDING_STEPS.length}
            className={styles.progress}
          />
          <h1
            ref={heading}
            tabIndex={-1}
            id="onboarding-title"
            className={styles.title}
          >
            {ONBOARDING_STEPS[step]}
          </h1>
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
            <fieldset
              key={step}
              data-direction={motion}
              disabled={pending || !restored}
              className={`${styles.fields} ${styles.stepTransition}`}
            >
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
                  <p className="text-sm">
                    Có thể bỏ qua và bổ sung sau. Nếu tải lại trang trước khi
                    lưu, hãy chọn lại ảnh.
                  </p>
                </>
              )}
              {step === 3 && (
                <LocationPicker
                  value={draft.location || ""}
                  onChange={(value) => change("location", value)}
                />
              )}
              {step === 4 && (
                <>{text("dateOfBirth", "Ngày sinh", "date", true)}</>
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
                    Hoàn tất hồ sơ để khám phá các bài test. Typology đã điền
                    luôn công khai và có thể chỉnh sửa sau.
                  </p>
                  <button
                    type="button"
                    onClick={() => void save("next", true)}
                    className="rounded-xl bg-[#8B6B4A] px-6 py-3 font-bold text-white shadow-md"
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
                <button type="submit" className={styles.next}>
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
