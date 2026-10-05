import { getCommunityMap } from '@/app/actions/community-map';
import HomeAtlasClient from './HomeAtlasClient';
export default async function HomeAtlas(){const map=await getCommunityMap();return <HomeAtlasClient data={map.countries} available={map.available}/>;}
