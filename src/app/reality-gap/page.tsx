import type { Metadata } from 'next';
import { RealityGapView } from '@/components/reality-gap/RealityGapView';

export const metadata: Metadata = {
  title: 'Reality Gap Diagnostic — TERRALIGN',
  description:
    'Analog Reality Gap (ARG) 6-axis quantification engine comparing gravity, atmosphere, thermal, radiation, regolith, and illumination boundary deltas.',
};

export default function RealityGapPage() {
  return <RealityGapView />;
}
