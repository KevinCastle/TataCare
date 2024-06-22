import { Button } from '@nextui-org/react';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import { signOut } from '../../auth';

const signOutButton = () => (
  <Button
    className="relative rounded-full p-2 ml-auto bg-zinc-100 lg:transition-width lg:duration-300 lg:group lg:min-w-10 lg:hover:min-w-fit lg:hover:bg-red-400 gap-0"
    type="button"
    onPress={async () => { await signOut(); }}
  >
    <span className="text-red-400 lg:text-zinc-100 lg:max-w-0 lg:transition-all lg:duration-300 lg:group-hover:text-white lg:group-hover:max-w-20 mr-3 lg:mr-0 lg:group-hover:mr-3">Cerrar sesión</span>
    <SignOut size={16} className="text-red-400 lg:group-hover:text-white" weight="bold" />
  </Button>
);

export default signOutButton;
