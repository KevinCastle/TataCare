'use client';

import {
  ArrowRight,
  Envelope,
  Eye,
  EyeSlash,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react/dist/ssr';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { v4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/userStore';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { addUser } = useUserStore((state) => ({
    addUser: state.add,
  }));

  function validateForm() {
    if (!userName.trim()) {
      setErrorMessage('El nombre es requerido.');
      return false;
    }
    if (!userSurname.trim()) {
      setErrorMessage('El apellido es requerido.');
      return false;
    }
    if (!email.trim()) {
      setErrorMessage('El correo electrónico es requerido.');
      return false;
    }
    if (!password.trim()) {
      setErrorMessage('La contraseña es requerida.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    setErrorMessage(null);
    return true;
  }

  const submitForm = () => {
    if (!validateForm()) {
      return;
    }
    const user = {
      id: v4(),
      name: userName,
      surname: userSurname,
      email,
      password,
      avatar: '',
    };
    addUser(user).then((response) => {
      if (response.success) {
        router.push('/login');
      } else {
        setErrorMessage(response.errorMessage);
      }
    });
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <main className="flex items-center justify-center md:h-screen overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-700 text-white p-3 md:h-36">
          <div className="flex items-center">
            <div>
              <UsersThree size={40} className="h-auto w-8 sm:w-10 mr-2" />
            </div>
            <p className="text-2xl sm:text-3xl font-medium">Tatacare</p>
          </div>
        </div>
        <form action={submitForm} className="space-y-3">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className="mb-6 text-2xl">
              Cree una cuenta.
            </h1>
            <div className="w-full flex flex-col gap-4 my-2">
              <p className="text-sm text-gray-600">Ingresando los siguientes datos podrá tener su cuenta en segundos:</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  label="Nombre"
                  color="primary"
                  placeholder="Ingrese su nombre"
                  className="col-span-1"
                  value={userName}
                  onValueChange={setUserName}
                  isRequired
                />
                <Input
                  type="text"
                  label="Apellido"
                  color="primary"
                  placeholder="Ingrese su apellido"
                  className="col-span-1"
                  value={userSurname}
                  onValueChange={setUserSurname}
                  isRequired
                />
              </div>
              <Input
                type="email"
                label="Correo electrónico"
                color="primary"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onValueChange={setEmail}
                startContent={(
                  <Envelope size={24} weight="fill" className="text-blue-400 pointer-events-none" />
                                )}
                isRequired
              />
              <Input
                label="Contraseña"
                color="primary"
                placeholder="Ingrese su contraseña"
                value={password}
                onValueChange={setPassword}
                endContent={(
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeSlash size={24} className="text-blue-400 pointer-events-none" />
                    ) : (
                      <Eye size={24} className=" text-blue-400 pointer-events-none" />
                    )}
                  </button>
                                )}
                type={isVisible ? 'text' : 'password'}
                isRequired
              />
            </div>
            {errorMessage && (
              <div className="flex items-center">
                <WarningCircle size={20} className="text-red-500" />
                <p className="text-sm text-red-500 ml-2">{errorMessage}</p>
              </div>
            )}
            <Button color="primary" type="submit" className="mt-4 w-full">
              Registrarse
              {' '}
              <ArrowRight size={20} className="ml-auto text-gray-50" />
            </Button>
            <div className="flex justify-center items-center mt-4">
              <span className="text-xs text-gray-600 mr-2">¿Ya tiene una cuenta?</span>
              <Button color="primary" variant="light" className="text-xs font-semibold" onPress={() => router.push('/login')}>
                Iniciar sesión
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
