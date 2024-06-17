'use client';

import { Button } from '@nextui-org/react';
import { Pencil, Star, Trash } from '@phosphor-icons/react/dist/ssr';

interface ActionButtonProps {
  action: 'edit' | 'erase' | 'like';
  type: 'user' | 'medicine' | 'taste' | 'contact' | 'comment' | undefined;
}

function ActionButton({ action, type }: ActionButtonProps) {
  console.log(type);
  return (
    <Button className="text-tiny h-8 w-8 flex justify-center items-center text-white hover:bg-zinc-300/60 transition-colors duration-150 rounded-full ps-1">
      {action === 'edit' && <Pencil size={24} weight="fill" color="#002E62" />}
      {action === 'erase' && <Trash size={24} color="#F31260" />}
      {action === 'like' && <Star size={24} color="#F5A524" />}
    </Button>
  );
}

export default ActionButton;
