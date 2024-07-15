/**
 * Calculate the height of the virtual keyboard.
 * When the virtual keyboard is raised, the height of the visualViewport decreases, so you can calculate the height of the virtual keyboard by subtracting the height value of the visualViewport from the innerHeight value.
 *
 * Calculation formula: initial window.document.innerHeight value - (visualViewport height value)
 *
 * @param initialInnerHeight - The initial innerHeight value of the window.document
 * @returns The height of the virtual keyboard
 */
export const computeKeyboardTopPosition = ({
  initialInnerHeight,
}: {
  initialInnerHeight: number;
}) => {
  const keyboardHeight =
    initialInnerHeight - (window.visualViewport?.height || 0);
  const visualViewportOffsetTop = window.visualViewport?.offsetTop || 0;

  return keyboardHeight - Math.max(visualViewportOffsetTop, window.scrollY);
};

export const isKeyboardAvoidingInputElement = (
  element: Element | null
): element is HTMLInputElement =>
  element?.tagName.toLowerCase() === "input" &&
  element.classList.contains("keyboard-avoiding-input");

export const makeNegativeTranslateY = (value: number) =>
  `translateY(-${value}px)`;

export const checkIsIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

export const getViewPortHeight = () =>
  typeof window === "undefined"
    ? 0
    : window.visualViewport?.height || window.innerHeight;
