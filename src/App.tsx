import { StrictMode } from "react";
import { Toaster } from "sonner";
import { InstallModal } from "./components/InstallModal";
import "twin.macro";

export const App = () => {
  return (
    <StrictMode>
      <div tw="p-4">
        <h1 tw="py-4 text-2xl font-semibold">Welcome home</h1>
        <p>
          Refresh to get the install modal again. If you have installed the app,
          you won't have the modal again.
        </p>
      </div>

      <InstallModal />

      <Toaster position="top-center" richColors />
    </StrictMode>
  );
};
