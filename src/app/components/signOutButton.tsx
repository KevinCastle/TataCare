import { Button } from '@nextui-org/react';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import { signOut } from '../../auth';

const signOutButton = () => (
  <Button
    className="absolute top-2 right-2"
    color="primary"
    radius="lg"
    size="md"
    type="button"
    onPress={async () => { await signOut(); }}
  >
    <SignOut size={32} />
    Cerrar sesión
  </Button>
);

export default signOutButton;
