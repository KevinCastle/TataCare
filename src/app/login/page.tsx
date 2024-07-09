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
import { authenticate } from '@/app/api/user/actions';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [errorMessage, formAction] = useFormState(authenticate, undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { pending } = useFormStatus();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <main className="flex items-center justify-center md:h-screen overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-700 text-white p-3 md:h-36">
          <div className="flex items-center">
            <div>
              <UsersThree className="h-auto w-8 sm:w-10 mr-2" />
            </div>
            <p className="text-2xl sm:text-3xl font-medium">Tatacare</p>
          </div>
        </div>
        <form action={formAction} className="space-y-3">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className="mb-6 text-2xl">
              Inicia sesión en tu cuenta.
            </h1>
            <div className="w-full flex flex-col gap-4 my-2">
              <Input
                type="email"
                label="Correo electrónico"
                color="primary"
                placeholder="Ingrese su correo electrónico"
                id="email"
                name="email"
                value={email}
                onValueChange={setEmail}
                startContent={(
                  <Envelope size={20} weight="fill" className="text-blue-400 pointer-events-none" />
                )}
                isRequired
              />
              <Input
                label="Contraseña"
                color="primary"
                placeholder="Ingrese su contraseña"
                id="password"
                name="password"
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
            <Button color="primary" type="submit" className="mt-4 w-full" isDisabled={pending}>
              Inicio de sesión
              {' '}
              <ArrowRight size={20} className="ml-auto text-gray-50" />
            </Button>
            <div className="flex justify-center items-center mt-4">
              <span className="text-xs text-gray-600 mr-2">¿No tiene cuenta aún?</span>
              <Button color="primary" variant="light" className="text-xs font-semibold" onPress={() => router.push('/login/signup')}>
                Crear cuenta
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
