import type { Metadata } from 'next';
import { TerrainStudioView } from '@/components/terrain/TerrainStudioView';

export const metadata: Metadata = {
  title: '3D Terrain Studio — TERRALIGN',
  description:
    'Dual-view 3D terrain comparison studio with synchronized orbital camera and extreme low-angle lunar solar illumination.',
};

export default function TerrainStudioPage() {
  return <TerrainStudioView />;
}
