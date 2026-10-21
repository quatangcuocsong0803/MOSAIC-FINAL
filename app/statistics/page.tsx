import { getConfirmedIdentityStatistics } from "@/app/actions/identity-consent";
import MapShortcut from "@/src/components/home/MapShortcut";
import type { Metadata } from "next";
import { getStatisticsData } from "@/app/actions/statistics";
import StatisticsDashboard from "@/src/components/statistics/StatisticsDashboard";
export const metadata: Metadata = {
  title: "Thống kê cộng đồng | MOSAIC",
  description:
    "Khám phá phân bố MBTI, Enneagram, độ tuổi và đối chiếu các chỉ số được cộng đồng đồng ý chia sẻ.",
};
export const dynamic = "force-dynamic";
export default async function StatisticsPage() {
  const confirmed = await getConfirmedIdentityStatistics();
  return (
    <>
      <div className="mx-auto max-w-[1180px] px-6 pt-8 max-sm:px-4">
      <section className="mosaic-profile-card">
        <h2 className="font-serif text-3xl">Kết quả đã xác nhận</h2>
        <p className="my-3 text-sm">
          Dữ liệu người dùng xác nhận trên hồ sơ và đồng ý chia sẻ riêng. Mỗi
          người tối đa một kết quả cho mỗi hệ; không cộng vào thống kê lần test
          bên dưới.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries({
            MBTI: confirmed.mbti,
            Enneagram: confirmed.enneagram,
          }).map(([name, counts]) => (
            <div key={name}>
              <h3 className="font-serif text-xl">{name}</h3>
              {!Object.keys(counts).length && (
                <p className="mt-2 text-sm">
                  Chưa có kết quả được đồng ý chia sẻ.
                </p>
              )}
              {Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="my-2 flex justify-between rounded-lg bg-[#F8F5EE] px-4 py-2"
                  >
                    <span>{type}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>
      </div>
      <StatisticsDashboard stats={await getStatisticsData()} />
      <MapShortcut />
    </>
  );
}
