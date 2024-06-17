'use client';

import { Avatar, Link } from '@nextui-org/react';
import { ArrowUUpLeft } from '@phosphor-icons/react/dist/ssr';
import { useEffect } from 'react';
import NavLinks from './navLinks';
import Logo from './logo';
import SignOutButton from './signOutButton';
import { useUserStore } from '../store/userStore';

export default function Navbar() {
  const { getUser, user } = useUserStore((state) => ({
    getUser: state.get,
    user: state.user,
  }));

  useEffect(() => {
    if (!user) getUser();
  }, [getUser, user]);

  return (
    <div className="flex flex-col px-3 py-4 md:px-2 md:h-svh">
      <Link
        className="mb-2 flex border-b border-solid border-zinc-100 py-4 px-3"
        href="/"
      >
        <Logo />
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:justify-start md:space-x-0 md:space-y-4">
        <NavLinks id="1" />
      </div>
      <div className="mt-auto border-b border-solid border-zinc-200 pb-2">
        <Link isBlock href="/" color="foreground" className="font-medium flex h-[48px] grow items-center justify-center md:flex-none md:justify-start p-3 md:p-2">
          <ArrowUUpLeft color="#D4D4D8" size={24} className="mr-2" />
          Elegir otro abuelito
        </Link>
      </div>
      <div className="flex items-center gap-x-3 p-2 pt-4">
        <Avatar showFallback src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <p className="font-medium">{user?.name}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
