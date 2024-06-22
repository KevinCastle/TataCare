import { Button } from '@nextui-org/react';
import { Star } from '@phosphor-icons/react/dist/ssr';

interface LikeButtonProps {
    type: 'elder' | 'medication' | 'taste' | 'contact' | 'comment';
}

function LikeButton({ type }: LikeButtonProps) {
  console.log(type);
  return (
    <Button type="button" className="h-8 w-8 min-w-0 flex justify-center items-center bg-zinc-200/60 hover:bg-zinc-300/80 transition-colors duration-150 rounded-full px-1">
      <Star size={24} weight="bold" color="#F5A524" />
    </Button>
  );
}

export default LikeButton;
