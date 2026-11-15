import type { Metadata } from 'next';
import { MissionCommandView } from '@/components/discovery/MissionCommandView';

export const metadata: Metadata = {
  title: 'Mission Command — TERRALIGN',
  description:
    'Global 3D Planetary Mission Command and Analog Discovery Environment for Lunar and Martian Surface Exploration.',
};

export default function MissionPage() {
  return <MissionCommandView />;
}

