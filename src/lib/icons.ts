// The 27 line icons from design/assets/icons (copied to src/icons).
export const iconNames = [
  'arrow', 'book', 'calendar', 'check', 'chevron', 'chevronR', 'clock', 'close', 'code', 'deal', 'doc', 'globe', 'help',
  'linkedin', 'list', 'mail', 'megaphone', 'menu', 'pen', 'people', 'phone', 'pin', 'plus', 'search', 'shield', 'ticket', 'whatsapp',
] as const;
export type IconName = (typeof iconNames)[number];
