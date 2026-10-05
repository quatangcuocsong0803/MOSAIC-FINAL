"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  createDiscussionGroup,
} from "@/app/actions/discussion-groups";

export default function CreateGroupForm() {
  const [
    name,
    setName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    rules,
    setRules,
  ] = useState("");

  const [
    visibility,
    setVisibility,
  ] = useState<
    "PUBLIC" |
    "PRIVATE"
  >(
    "PUBLIC",
  );

  const [
    joinPolicy,
    setJoinPolicy,
  ] = useState<
    "OPEN" |
    "APPROVAL" |
    "INVITE_ONLY"
  >(
    "OPEN",
  );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const valid =
    useMemo(
      () =>
        name.trim().length >=
          3 &&
        name.trim().length <=
          70 &&
        description.trim()
          .length >=
          30 &&
        description.trim()
          .length <=
          700 &&
        rules.trim().length <=
          3000,
      [
        name,
        description,
        rules,
      ],
    );

  async function submit() {
    if (
      !valid ||
      submitting
    ) {
      return;
    }

    setSubmitting(
      true,
    );

    setError(
      null,
    );

    const result =
      await createDiscussionGroup({
        name,
        description,
        rules,

        visibility,
        joinPolicy,
      });

    if (
      !result.success
    ) {
      setError(
        result.error,
      );

      setSubmitting(
        false,
      );

      return;
    }

    window.location.assign(
      `/discussion/groups/${result.slug}`,
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#DDD3C5] bg-white p-5 md:p-6">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#947B5E]">
          01 · Identity
        </p>

        <label className="mt-4 block">
          <span className="text-xs font-bold text-[#554432]">
            Tên nhóm
          </span>

          <input
            value={name}
            onChange={(
              event,
            ) =>
              setName(
                event
                  .target
                  .value,
              )
            }
            maxLength={70}
            placeholder="Ví dụ: Jungian Primary Sources"
            className="mt-2 w-full rounded-lg border border-[#D8CCBC] bg-[#FCFBF8] px-4 py-3 text-sm text-[#4F4031] outline-none transition focus:border-[#997B57]"
          />

          <span className="mt-1 block text-right text-[9px] text-[#A09280]">
            {
              name.length
            }
            /70
          </span>
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-bold text-[#554432]">
            Mục đích của nhóm
          </span>

          <textarea
            value={
              description
            }
            onChange={(
              event,
            ) =>
              setDescription(
                event
                  .target
                  .value,
              )
            }
            maxLength={700}
            rows={6}
            placeholder="Nhóm thảo luận về chủ đề gì, phạm vi nào, và thành viên nên kỳ vọng điều gì?"
            className="mt-2 w-full resize-y rounded-lg border border-[#D8CCBC] bg-[#FCFBF8] px-4 py-3 text-sm leading-6 text-[#4F4031] outline-none transition focus:border-[#997B57]"
          />

          <div className="mt-1 flex justify-between gap-4 text-[9px] text-[#A09280]">
            <span>
              Tối thiểu 30 ký tự
            </span>

            <span>
              {
                description.length
              }
              /700
            </span>
          </div>
        </label>
      </section>

      <section className="rounded-xl border border-[#DDD3C5] bg-white p-5 md:p-6">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#947B5E]">
          02 · Access
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setVisibility(
                "PUBLIC",
              )
            }
            className={`rounded-lg border p-4 text-left transition ${
              visibility ===
              "PUBLIC"
                ? "border-[#9D7F59] bg-[#F4EEE5]"
                : "border-[#DDD4C8] bg-white"
            }`}
          >
            <strong className="text-xs text-[#554432]">
              Public
            </strong>

            <p className="mt-1 text-[10px] leading-5 text-[#897B69]">
              Nhóm xuất hiện trong Explore Groups và mọi người có thể xem trang nhóm.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setVisibility(
                "PRIVATE",
              )
            }
            className={`rounded-lg border p-4 text-left transition ${
              visibility ===
              "PRIVATE"
                ? "border-[#9D7F59] bg-[#F4EEE5]"
                : "border-[#DDD4C8] bg-white"
            }`}
          >
            <strong className="text-xs text-[#554432]">
              Private
            </strong>

            <p className="mt-1 text-[10px] leading-5 text-[#897B69]">
              Chỉ thành viên mới truy cập được nội dung của nhóm.
            </p>
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold text-[#554432]">
            Cách tham gia
          </p>

          <div className="mt-2 grid gap-2">
            {[
              {
                value:
                  "OPEN" as const,

                title:
                  "Open",

                text:
                  "Bấm Join là trở thành thành viên ngay.",
              },

              {
                value:
                  "APPROVAL" as const,

                title:
                  "Approval required",

                text:
                  "Owner hoặc Moderator phải duyệt yêu cầu.",
              },

              {
                value:
                  "INVITE_ONLY" as const,

                title:
                  "Invite only",

                text:
                  "Không cho tự gửi yêu cầu tham gia.",
              },
            ].map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    setJoinPolicy(
                      option.value,
                    )
                  }
                  className={`rounded-lg border px-4 py-3 text-left ${
                    joinPolicy ===
                    option.value
                      ? "border-[#A08461] bg-[#F8F4ED]"
                      : "border-[#E2D9CD] bg-white"
                  }`}
                >
                  <strong className="text-[10px] text-[#5C4936]">
                    {
                      option.title
                    }
                  </strong>

                  <span className="ml-2 text-[10px] text-[#8D7F6E]">
                    {
                      option.text
                    }
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#DDD3C5] bg-white p-5 md:p-6">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#947B5E]">
          03 · Group rules
        </p>

        <textarea
          value={rules}
          onChange={(
            event,
          ) =>
            setRules(
              event
                .target
                .value,
            )
          }
          maxLength={3000}
          rows={8}
          placeholder={"Ví dụ:\n1. Claim về theory cần nguồn phù hợp.\n2. Không type người khác khi chưa có consent.\n3. Tranh luận luận điểm, không công kích cá nhân."}
          className="mt-4 w-full resize-y rounded-lg border border-[#D8CCBC] bg-[#FCFBF8] px-4 py-3 text-sm leading-6 text-[#4F4031] outline-none transition focus:border-[#997B57]"
        />

        <span className="mt-1 block text-right text-[9px] text-[#A09280]">
          {
            rules.length
          }
          /3000
        </span>
      </section>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={
            !valid ||
            submitting
          }
          onClick={() =>
            void submit()
          }
          className="rounded-lg bg-[#6E5336] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#543E29] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting
            ? "Đang tạo nhóm..."
            : "Tạo nhóm"}
        </button>
      </div>
    </div>
  );
}
