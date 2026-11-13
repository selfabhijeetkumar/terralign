import type { Metadata } from 'next';
import { MissionCommandView } from '@/components/discovery/MissionCommandView';

export const metadata: Metadata = {
  title: 'Mission Command — TERRALIGN',
  description:
    'Global Mission Command and Planetary Activity Selector for Lunar and Martian Analog Discovery.',
};

export default function Home() {
  return <MissionCommandView />;
}
