import {
  Transition as HeadlessUiTransition,
  TransitionEvents,
} from "@headlessui/react";
import { ReactNode } from "react";
import { TwStyle } from "twin.macro";

/**
 * HeadlessUI "Transition"
 * Customized for twin.macro + typescript
 * https://headlessui.dev/react/transition
 * https://github.com/ben-rogerson/twin.examples/tree/master/headlessui-typescript
 */

type TransitionProps = TransitionEvents & {
  enter?: TwStyle;
  enterFrom?: TwStyle;
  enterTo?: TwStyle;
  entered?: TwStyle;
  leave?: TwStyle;
  leaveFrom?: TwStyle;
  leaveTo?: TwStyle;
  show?: boolean;
  as?: React.ElementType;
  appear?: boolean;
  unmount?: boolean;
  children?: ReactNode;
};

/**
 * It seems we can't use `twin.macro` and `as={Fragment}` on this component
 * @see `CancelModal` component for an example of how to use it
 */
export function Transition(props: TransitionProps) {
  return <HeadlessUiTransition {...getProps(props)} />;
}

Transition.Child = function TransitionChild(props: TransitionProps) {
  return <HeadlessUiTransition.Child {...getProps(props)} />;
};

function getProps(props: TransitionProps) {
  return {
    ...props,
    enter: "enter",
    enterFrom: "enter-from",
    enterTo: "enter-to",
    entered: "entered",
    leave: "leave",
    leaveFrom: "leave-from",
    leaveTo: "leave-to",
    css: {
      "&.enter": props.enter,
      "&.enter-from": props.enterFrom,
      "&.enter-to": props.enterTo,
      "&.entered": props.entered,
      "&.leave": props.leave,
      "&.leave-from": props.leaveFrom,
      "&.leave-to": props.leaveTo,
    },
    beforeEnter: () => props.beforeEnter?.(),
    afterEnter: () => props.afterEnter?.(),
    beforeLeave: () => props.beforeLeave?.(),
    afterLeave: () => props.afterLeave?.(),
  };
}
