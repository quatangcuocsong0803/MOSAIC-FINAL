"use client";
import { useEffect, useState, useId } from "react";
type Country = { code: string; name: string };
export default function LocationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const [countries, setCountries] = useState<Country[]>([]),
    [cities, setCities] = useState<string[]>([]),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const parts = value.split(",").map((s) => s.trim());
  const country = parts.length > 1 ? parts.at(-1) || "" : value,
    city = parts.length > 1 ? parts.slice(0, -1).join(", ") : "";
  const selected = countries.find((c) => c.name === country);
  useEffect(() => {
    let active = true;
    fetch("/locations/countries.json")
      .then((r) => r.json())
      .then((data) => {
        if (active) setCountries(data);
      })
      .catch(() => setMessage("Chưa tải được danh sách. Vui lòng thử lại."));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setCities([]);
    if (selected)
      fetch(`/locations/${selected.code}.json`)
        .then((r) => r.json())
        .then((data) => {
          if (active) setCities(data);
        })
        .catch(() => setMessage("Chưa tải được danh sách thành phố."));
    return () => {
      active = false;
    };
  }, [selected]);
  function locate() {
    if (!navigator.geolocation) {
      setMessage("Thiết bị không hỗ trợ định vị. Bạn có thể chọn bên dưới.");
      return;
    }
    setBusy(true);
    setMessage("Đang xác định nơi sống…");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const query = new URLSearchParams({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
            localityLanguage: "en",
          });
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?${query}`,
            {
              signal: AbortSignal.timeout(10000),
              credentials: "omit",
              referrerPolicy: "no-referrer",
            },
          );
          if (!res.ok) throw Error();
          const data = await res.json();
          const name =
            countries.find((c) => c.code === data.countryCode)?.name ||
            data.countryName;
          if (!name) throw Error();
          onChange(
            [data.city || data.locality || data.principalSubdivision, name]
              .filter(Boolean)
              .join(", "),
          );
          setMessage(
            "Đã điền nơi sống. Bạn có thể thay đổi lựa chọn bên dưới.",
          );
        } catch {
          setMessage("Chưa xác định được địa danh. Bạn có thể chọn bên dưới.");
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setMessage("Không dùng định vị. Chọn nơi sống bên dưới hoặc bỏ qua.");
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
  }
  const field =
    "mt-2 w-full rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] p-3";
  return (
    <div className="space-y-4">
      <p className="text-sm">
        Nếu đồng ý, thiết bị sẽ gửi vị trí hiện tại tới BigDataCloud để điền tên
        địa danh. MOSAIC chỉ lưu quốc gia/thành phố, không lưu tọa độ.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || !countries.length}
          onClick={locate}
          className="rounded-xl bg-[#8B6B4A] px-4 py-3 text-white"
        >
          {busy ? "Đang định vị…" : "Đồng ý sử dụng vị trí"}
        </button>
        <button
          type="button"
          onClick={() =>
            setMessage("Chọn quốc gia/thành phố bên dưới hoặc bỏ qua.")
          }
          className="rounded-xl border px-4 py-3"
        >
          Không sử dụng
        </button>
      </div>
      <p role="status" className="text-sm">
        {message}
      </p>
      <label className="block" htmlFor={`${id}-country`}>
        Quốc gia
      </label>
      <select
        id={`${id}-country`}
        className={field}
        value={country}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Chọn quốc gia</option>
        {country && !selected && <option>{country}</option>}
        {countries.map((c) => (
          <option key={c.code}>{c.name}</option>
        ))}
      </select>
      <label className="block" htmlFor={`${id}-city`}>
        Thành phố
      </label>
      <select
        id={`${id}-city`}
        className={field}
        value={city}
        disabled={!country}
        onChange={(e) =>
          onChange([e.target.value, country].filter(Boolean).join(", "))
        }
      >
        <option value="">Chọn thành phố</option>
        {city && !cities.includes(city) && <option>{city}</option>}
        {cities.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
