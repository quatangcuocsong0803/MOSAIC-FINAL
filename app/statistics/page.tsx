import MapShortcut from '@/src/components/home/MapShortcut';
import type { Metadata } from "next";
import { getStatisticsData } from "@/app/actions/statistics";
import StatisticsDashboard from "@/src/components/statistics/StatisticsDashboard";
export const metadata: Metadata = {
  title: "Thống kê cộng đồng | MOSAIC",
  description: "Khám phá phân bố MBTI, Enneagram, độ tuổi và đối chiếu các chỉ số được cộng đồng đồng ý chia sẻ.",
};
export const dynamic = "force-dynamic";
export default async function StatisticsPage() {
  return <><StatisticsDashboard stats={await getStatisticsData()} /><MapShortcut /></>;
}
