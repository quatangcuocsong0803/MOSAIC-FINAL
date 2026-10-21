"use client";
import { useState } from "react";
import { INTEREST_GROUPS, interestSearch } from "@/lib/interests";
export default function InterestPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (codes: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const term = interestSearch(query);
  return (
    <div>
      <label className="block">
        Tìm sở thích
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên hoặc nhóm…"
          className="my-2 w-full rounded-xl border border-[#E2D4B7] p-3"
        />
      </label>
      <p className="text-sm" aria-live="polite">
        Đã chọn {value.length} / 50 · Có thể chọn nhiều
      </p>
      <div className="max-h-72 overflow-y-auto">
        {INTEREST_GROUPS.map((group) => {
          const items = group.items.filter(([, label]) =>
            interestSearch(`${label} ${group.name}`).includes(term),
          );
          return items.length ? (
            <fieldset key={group.name} className="my-4">
              <legend className="font-serif font-semibold text-[#5C4326]">
                {group.name}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {items.map(([code, label]) => (
                  <label
                    key={code}
                    className={`cursor-pointer rounded-full border px-3 py-2 text-sm ${value.includes(code) ? "border-[#8B6B4A] bg-[#E2D4B7]" : "border-[#E2D4B7] bg-white"}`}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(code)}
                      disabled={value.length >= 50 && !value.includes(code)}
                      onChange={(e) =>
                        onChange(
                          e.target.checked
                            ? [...value, code]
                            : value.filter((v) => v !== code),
                        )
                      }
                      className="mr-2 accent-[#8B6B4A]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null;
        })}
      </div>
    </div>
  );
}
