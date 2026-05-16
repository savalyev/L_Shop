export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  text: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
}

/**
 * Создаёт стандартизированный элемент кнопки.
 * @param {ButtonProps} props Свойства кнопки.
 * @returns {HTMLButtonElement} DOM-элемент кнопки.
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
  const { text, variant = 'primary', onClick, className = '' } = props;
  const btn = document.createElement('button');
  btn.className = `btn btn-${variant} ${className}`.trim();
  btn.textContent = text;
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
}