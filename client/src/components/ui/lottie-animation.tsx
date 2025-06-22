
import { useLottie } from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottieAnimation({ 
  animationData, 
  loop = true, 
  autoplay = true,
  className 
}: LottieAnimationProps) {
  const { View } = useLottie({
    animationData,
    loop,
    autoplay,
  });

  return <div className={className}>{View}</div>;
}
