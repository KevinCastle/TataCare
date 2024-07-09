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
    <div className="bg-white flex flex-col px-3 py-1 lg:py-4 lg:px-2 lg:h-full">
      <div className="flex justify-between items-center lg:justify-start order-1">
        <Link
          className="mb-2 flex border-b border-solid border-zinc-100 py-4 px-3"
          href="/"
        >
          <Logo />
        </Link>
        <div className="lg:hidden">
          <SignOutButton />
        </div>
      </div>
      <div className="flex grow flex-row justify-between space-x-0 lg:flex-col lg:justify-start lg:space-y-4 overflow-x-auto order-3 lg:order-2">
        <NavLinks />
      </div>
      <div className="mt-auto border-b border-solid border-zinc-200 mb-2 lg:pb-2 order-2 lg:order-3">
        <Link isBlock href="/" color="foreground" className="font-medium flex h-[48px] grow items-center justify-center lg:flex-none lg:justify-start p-3 lg:p-2">
          <ArrowUUpLeft color="#71717A" size={24} className="mr-2" />
          Elegir otro abuelito
        </Link>
      </div>
      <div className="hidden lg:flex items-center gap-x-3 p-2 pt-4 order-4">
        {user && (
          <>
            <Avatar showFallback src={user.avatar} />
            <p className="font-medium">
              {user.name}
              {' '}
              {user.surname}
            </p>
          </>
        )}
        <SignOutButton />
      </div>
    </div>
  );
}
