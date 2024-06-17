import { Button } from '@nextui-org/react';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import { signOut } from '../../auth';

const signOutButton = () => (
  <Button
    className="relative rounded-full p-2 ml-auto bg-zinc-100 transition-width duration-300 group min-w-10 hover:min-w-fit hover:bg-red-400 gap-0"
    type="button"
    onPress={async () => { await signOut(); }}
  >
    <span className="text-zinc-100 max-w-0 transition-all duration-300 group-hover:text-white group-hover:max-w-20 group-hover:mr-3">Cerrar sesión</span>
    <SignOut size={16} className="text-red-400 group-hover:text-white" weight="bold" />
  </Button>
);

export default signOutButton;
