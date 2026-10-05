import CommunityMap from '@/src/components/statistics/CommunityMap';
import { getCommunityMap, getMyMapShare } from '@/app/actions/community-map';
export const dynamic='force-dynamic';
export const metadata={title:'Bản đồ cộng đồng | MOSAIC'};
export default async function Page(){const [map,share]=await Promise.all([getCommunityMap(),getMyMapShare()]);return <CommunityMap data={map.countries} available={map.available} initialShare={share}/>;}
