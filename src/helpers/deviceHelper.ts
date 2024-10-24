export const deviceIosCheck = () => {
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS = navigator.maxTouchPoints && navigator.maxTouchPoints > 1;

  return isiOS && isiPadOS;
};
