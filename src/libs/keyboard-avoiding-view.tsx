import {
  CSSProperties,
  ComponentProps,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";

import {
  useDebouncedCallback,
  useMountEffect,
  useUnmountEffect,
} from "@react-hookz/web";
import {
  checkIsIOS,
  computeKeyboardTopPosition,
  isKeyboardAvoidingInputElement,
  makeNegativeTranslateY,
} from "./keyboard-avoiding-view.util";

export interface KeyboardAvoidingViewProps extends ComponentProps<"div"> {
  keyboardVisibleBottomMargin?: number;
  keyboardInvisibleBottomMargin?: number;
  changeChildTranslateTriggerEventDebounceDelay?: number;
  onChangeVirtualKeyboardShown?: (draftIsVirtualKeyboardShown: boolean) => void;
}

/**
 * This component is a component that automatically adjusts the view so that the fixed element is not covered by the keyboard when the keyboard appears on iOS devices.
 */
export const KeyboardAvoidingView = forwardRef<
  HTMLDivElement,
  KeyboardAvoidingViewProps
>(
  (
    {
      keyboardVisibleBottomMargin = 0,
      keyboardInvisibleBottomMargin = 0,
      children,
      style,
      changeChildTranslateTriggerEventDebounceDelay = 200,
      onChangeVirtualKeyboardShown,
      ...props
    },
    ref
  ) => {
    const [isVirtualKeyboardShown, setVirtualKeyboardShown] =
      useState<boolean>(false);
    const [adjustedTranslateY, setAdjustedTranslateY] = useState<number>(0);
    const initialInnerHeight = useRef<number>(window.innerHeight).current;

    /**
     * Why use debounce?
     * If the scroll event is triggered multiple times, the performance may be degraded.
     */
    const handleChangeChildTranslateTriggerEvent = useDebouncedCallback(
      () => {
        const keyboardTopPosition = computeKeyboardTopPosition({
          initialInnerHeight,
        });
        if (keyboardTopPosition <= 0) {
          return;
        }

        setAdjustedTranslateY(keyboardTopPosition);
      },
      [],
      changeChildTranslateTriggerEventDebounceDelay
    );

    const handleFocusIn = useCallback(() => {
      const focusedElement = document.activeElement;

      if (!isKeyboardAvoidingInputElement(focusedElement)) {
        return;
      }

      if (onChangeVirtualKeyboardShown) {
        onChangeVirtualKeyboardShown(true);
      }
      setVirtualKeyboardShown(true);
      handleChangeChildTranslateTriggerEvent();
    }, [onChangeVirtualKeyboardShown, handleChangeChildTranslateTriggerEvent]);

    const resetVirtualKeyboardShownState = useCallback(() => {
      if (onChangeVirtualKeyboardShown) {
        onChangeVirtualKeyboardShown(false);
      }
      setVirtualKeyboardShown(false);
      setAdjustedTranslateY(keyboardInvisibleBottomMargin);
    }, [keyboardInvisibleBottomMargin, onChangeVirtualKeyboardShown]);

    const setupListeners = useCallback(() => {
      // The resize event is used to check if the virtual keyboard has been raised, but there may be cases where the resize event does not occur due to input focus, so the focusin and focusout events are used to limit the case where the virtual keyboard is exposed when the input is focused.
      // For example, we do not handle cases where the keyboard is raised when the browser's built-in address input is touched.
      document.addEventListener("focusin", handleFocusIn);
      document.addEventListener("focusout", resetVirtualKeyboardShownState);
      document.addEventListener(
        "scroll",
        handleChangeChildTranslateTriggerEvent
      );
      window.visualViewport?.addEventListener(
        "resize",
        handleChangeChildTranslateTriggerEvent
      );
    }, [
      handleChangeChildTranslateTriggerEvent,
      handleFocusIn,
      resetVirtualKeyboardShownState,
    ]);

    const cleanupListeners = useCallback(() => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", resetVirtualKeyboardShownState);
      window.visualViewport?.removeEventListener(
        "resize",
        handleChangeChildTranslateTriggerEvent
      );
      document.body.removeEventListener(
        "scroll",
        handleChangeChildTranslateTriggerEvent
      );
    }, [
      handleChangeChildTranslateTriggerEvent,
      handleFocusIn,
      resetVirtualKeyboardShownState,
    ]);

    useMountEffect(() => {
      /**
       * Only for iOS, when the virtual keyboard is raised,
       * the logic to raise the button above the virtual keyboard is executed, so return if it is not iOS
       *
       * Android devices do not need to adjust the view when the virtual keyboard is raised.
       */
      if (!checkIsIOS()) {
        return;
      }

      setupListeners();
    });

    useUnmountEffect(() => {
      cleanupListeners();
    });

    const baseStyle: CSSProperties = {
      position: "fixed",
      width: "100%",
    };
    const positionStyle: CSSProperties = isVirtualKeyboardShown
      ? {
          bottom: 0,
          transform: makeNegativeTranslateY(
            adjustedTranslateY + keyboardVisibleBottomMargin
          ),
        }
      : { bottom: keyboardInvisibleBottomMargin };

    return (
      <div
        ref={ref}
        style={{
          ...baseStyle,
          ...positionStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KeyboardAvoidingView.displayName = "KeyboardAvoidingView";
