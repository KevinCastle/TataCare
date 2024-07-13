'use client';

import {
  Modal, Button, useDisclosure,
  Input,
  ModalHeader,
  ModalBody,
  ModalContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@nextui-org/react';
import { ShareFat } from '@phosphor-icons/react/dist/ssr';
import {
  MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { v4 } from 'uuid';
import { Elder } from '../api/elders/types';
import { useElderStore } from '../store';

type ShareModalProps = {
    elder: Elder,
}

export default function ShareModal({ elder }: ShareModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCopied, setIsCopied] = useState(false);
  const [url, setUrl] = useState('');
  const onCloseRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);

  const { addSharedLink } = useElderStore((state) => ({
    addSharedLink: state.addSharedLink,
  }));

  function handleCopyText() {
    navigator.clipboard.writeText(url);
  }

  useEffect(
    () => {
      if (isOpen) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        const formattedExpirationDate = expirationDate.toISOString().split('T')[0];

        const sharedId = v4();

        const sharedLink = {
          id: sharedId,
          elder_id: elder.id,
          date: formattedExpirationDate,
          used: false,
        };
        addSharedLink(sharedLink);
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setUrl(`${baseUrl}/app/shared?sharedId=${sharedId}`);
      }
    },
    [isOpen],
  );

  return (
    <div>
      {elder && (
        <>
          <Button color="primary" size="sm" type="button" onPress={onOpen} className="px-2 lg:px-3">
            <ShareFat size={20} weight="fill" className="block" />
            <span>Compartir</span>
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            <ModalContent>
              {(onClose) => {
                onCloseRef.current = onClose;
                return (
                  <>
                    <ModalHeader>{`Compartir ficha de ${elder.name}`}</ModalHeader>
                    <ModalBody>
                      <p>Envía el siguiente link a un usuario de Tatacare para compartir la ficha</p>
                      <Input
                        isReadOnly
                        type="text"
                        value={url}
                        onClick={(e) => e.currentTarget.select()}
                        className="my-3"
                      />
                      <Popover isOpen={isCopied} onOpenChange={(copied) => setIsCopied(copied)} placement="bottom" color="success">
                        <PopoverTrigger>
                          <Button color="primary" className=" mb-10" onClick={() => handleCopyText}>
                            Copiar link
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>

                          <div className="text-small font-bold">¡El link ha sido copiado!</div>
                        </PopoverContent>
                      </Popover>
                    </ModalBody>
                  </>
                );
              }}
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
