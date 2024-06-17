import { UsersThree } from '@phosphor-icons/react/dist/ssr';

export default function Logo({ textWhite = false, iconColor = '006FEE' }) {
  return (
    <div
      className="flex items-center"
    >
      <div>
        <UsersThree color={iconColor} size={40} className="h-auto w-8 sm:w-10 mr-2" />
      </div>
      <p className={`text-2xl sm:text-4xl font-medium ${textWhite ? 'text-white' : 'text-zinc-900'}`}>Tatacare</p>
    </div>
  );
}
