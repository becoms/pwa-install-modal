# PWA Install Modal

`PWA install modal` is a modal that installs a ReactJS PWA on android, and to guide on how to install the ReactJS PWA on iOS.

## Tech Stack

**Client:** React, TypeScript, TailwindCSS, usehooks-ts

## Run Locally

Clone the project

```bash
  git clone https://github.com/becoms/pwa-install-modal
```

Go to the project directory

```bash
  cd pwa-install-modal
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

## Usage/Examples

### Check if the app has not been install to display the modal

```javascript
const [storedStatus, setStoredStatus] = useLocalStorage(
  PWA_INSTALLED_LOCAL_STORAGE,
  inBrowser ? undefined : "installed"
);

const [modalIsOpen, setModalIsOpen] = useState(false);

useEffect(() => {
  if (storedStatus !== "installed") {
    setModalIsOpen(true);
  }
}, [setStoredStatus, inBrowser, storedStatus]);
```

### If the user is not on iOS, we install the app programmatically

If the user is not on iOS, we will be able to trigger the installation programmatically.
We check if the user already dismissed the intallation (with `storedStatus` property) or if he is in the installed app.

```javascript
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
```

Then, we will handle the installation with the BeforeInstallPromptEvent `prompt`:

```javascript
const handleInstall = async () => {
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
```

### If the user is on iOS, we can only guide him to install it itself

Helper to check if the user is on iOS (with the user agent) :

```javascript
export const deviceIosCheck = () => {
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS = navigator.maxTouchPoints && navigator.maxTouchPoints > 1;

  return isiOS && isiPadOS;
};
```

Then, since we can not install programatically, we display the guide on iOS and the install button on android :

```javascript
{
  isIos ? (
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
  );
}
```

## Authors

- [@becoms](https://github.com/becoms)
