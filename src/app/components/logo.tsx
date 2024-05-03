import { UsersThree } from '@phosphor-icons/react/dist/ssr';

export default function Logo() {
  return (
    <div
      className="flex items-center"
    >
      <div>
        <UsersThree color="#006FEE" size={40} className="mr-2" />
      </div>
      <p className="text-4xl font-medium text-zinc-900">Tatacare</p>
    </div>
  );
}
