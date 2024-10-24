import "twin.macro";
import { Dialog } from "@headlessui/react";
import { PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { Modal, ModalButton } from "./Modals";
import { deviceIosCheck } from "@/helpers/deviceHelper";

const PWA_INSTALLED_LOCAL_STORAGE = "pwa_install_status";

type UserChoice = Promise<{
  outcome: "accepted" | "dismissed";
  platform: string;
}>;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: UserChoice;
  prompt(): Promise<UserChoice>;
}

function isBeforeInstallPromptEvent(e: Event): e is BeforeInstallPromptEvent {
  return "prompt" in e;
}

export const InstallModal = () => {
  const inBrowser = !window.matchMedia("(display-mode: standalone)").matches;
  const [storedStatus, setStoredStatus] = useLocalStorage(
    PWA_INSTALLED_LOCAL_STORAGE,
    inBrowser ? undefined : "installed"
  ); // installed

  const isIos = deviceIosCheck();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const iosShareGuideToast = () =>
    toast.info(
      "You will find it in the bottom bar on Safari, in the top bar on Chrome, and in the page menu on other browsers.",
      {
        duration: 10000,
      }
    );

  const iosAddToHomeScreenGuideToast = () =>
    toast.info("You will find it in the Share menu, by scrolling to bottom.", {
      duration: 8000,
    });

  useEffect(() => {
    if (storedStatus !== "installed") {
      setModalIsOpen(true);
    }
  }, [setStoredStatus, inBrowser, storedStatus]);

  return (
    <Modal tw="w-max" open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
      <div tw="flex flex-col w-full justify-center items-center gap-5 h-full">
        {/* <img
          src="/apple-touch-icon-72x72.png"
          tw="rounded-md h-14"
          aria-hidden="true"
        /> */}
        <Dialog.Title as="h3" tw="text-xl font-bold tracking-tight">
          Add to your home screen
        </Dialog.Title>

        {isIos ? (
          <ul tw="space-y-3 text-base flex flex-col w-full">
            <li>To install the app :</li>
            <li tw="py-3 inline-flex gap-2" onClick={iosShareGuideToast}>
              <span tw="inline shrink-0">1. Tap on “Share”</span>
              <img
                src="/share-ios.svg"
                tw="inline h-7 w-auto bg-stone-500 rounded-md"
              />
            </li>
            <li tw="py-3" onClick={iosAddToHomeScreenGuideToast}>
              2. Select
              <div tw="px-1 mx-2 rounded-md bg-white text-gray-800 inline-flex items-center gap-2 w-fit ">
                Add to Home Screen
                <PlusSquare tw="inline text-gray-600 h-5 w-auto" />
              </div>
            </li>
          </ul>
        ) : (
          <InstallButton
            alreadyStoredStatus={storedStatus}
            inBrowser={inBrowser}
            onClose={() => setModalIsOpen(false)}
            onOpen={() => setModalIsOpen(true)}
          />
        )}
      </div>
    </Modal>
  );
};

const InstallButton = ({
  alreadyStoredStatus,
  inBrowser,
  onClose,
  onOpen,
}: {
  alreadyStoredStatus?: string;
  inBrowser: boolean;
  onClose: () => void;
  onOpen: () => void;
}) => {
  const [storedStatus, setStoredStatus] = useLocalStorage(
    PWA_INSTALLED_LOCAL_STORAGE,
    alreadyStoredStatus
  );
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const beforeInstallHandler = (e: Event) => {
      if (!isBeforeInstallPromptEvent(e)) {
        return;
      }
      console.debug("beforeinstallprompt");
      e.preventDefault();
      setInstallEvent(e);
      if (inBrowser && storedStatus !== "dismissed") {
        onOpen();
      }
    };
    const appInstalledHandler = (e: Event) => {
      if (!isBeforeInstallPromptEvent(e)) {
        return;
      }
      console.debug("appinstalled");
      e.preventDefault();
      setInstallEvent(e);
      onClose();
      setStoredStatus("installed");
    };
    window.addEventListener("beforeinstallprompt", beforeInstallHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, [setStoredStatus, inBrowser, storedStatus]);

  const handleInstall = async () => {
    console.debug("handleInstall");
    if (!installEvent) {
      return;
    }
    try {
      await installEvent.prompt();
      await installEvent.userChoice.then((choiceResult) => {
        console.debug("choiceResult.outcome", choiceResult.outcome);
        if (choiceResult.outcome !== "accepted") {
          onClose();
        }
      });
    } catch (e) {
      console.debug(e);
    }
  };
  return (
    <ModalButton onClick={() => void handleInstall()}>Install</ModalButton>
  );
};
