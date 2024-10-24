import { Dialog } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import tw from "twin.macro";
import { Transition } from "./Transition";

export const ModalButton = tw.button`inline-flex flex-1 justify-center items-center rounded-xl bg-blue-700 p-3 text-xl font-semibold text-white shadow-sm disabled:opacity-50`;

export type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export const Modal = ({
  children,
  open,
  onClose,
  ...props
}: BaseModalProps) => (
  <Transition show={open} as={Fragment}>
    <Dialog as="div" tw="relative z-10" onClose={onClose}>
      {/* Backdrop */}
      <Transition.Child
        as={"div"}
        aria-hidden="true"
        enter={tw`ease-out duration-300`}
        enterFrom={tw`opacity-0`}
        enterTo={tw`opacity-100`}
        leave={tw`ease-in duration-200`}
        leaveFrom={tw`opacity-100`}
        leaveTo={tw`opacity-0`}
        tw="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
      />

      {/* Panel */}
      <Transition.Child
        as={Dialog.Panel}
        enter={tw`ease-out duration-300`}
        enterFrom={tw`opacity-0`}
        enterTo={tw`opacity-100 `}
        leave={tw`ease-in duration-200`}
        leaveFrom={tw`opacity-100 `}
        leaveTo={tw`opacity-0`}
        tw="fixed w-fit left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 overflow-y-auto rounded-xl flex flex-col items-center justify-center gap-10 bg-white text-black p-6"
        {...props}
      >
        {children}
      </Transition.Child>
    </Dialog>
  </Transition>
);
