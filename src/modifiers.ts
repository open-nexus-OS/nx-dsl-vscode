// Hand-transcribed from docs/dev/dsl/modifiers.md (open-nexus-OS). The compiler's own
// SSOT (userspace/dsl/core/modifiers.toml) doesn't exist yet; once it does, generate
// this from it instead of maintaining it by hand.
export interface ModifierDoc {
  name: string;
  args: string;
  meaning: string;
}

export const MODIFIERS: ModifierDoc[] = [
  { name: 'padding', args: 'n', meaning: 'Padding on all edges (spacing step).' },
  { name: 'paddingX', args: 'n', meaning: 'Horizontal padding (spacing step).' },
  { name: 'paddingY', args: 'n', meaning: 'Vertical padding (spacing step).' },
  { name: 'paddingTop', args: 'n', meaning: 'Top padding (spacing step).' },
  { name: 'paddingBottom', args: 'n', meaning: 'Bottom padding (spacing step).' },
  { name: 'paddingLeading', args: 'n', meaning: 'Leading-edge padding (spacing step).' },
  { name: 'paddingTrailing', args: 'n', meaning: 'Trailing-edge padding (spacing step).' },
  { name: 'gap', args: 'n', meaning: 'Gap between children of a container (spacing step).' },
  { name: 'margin', args: 'n', meaning: 'Outside spacing (spacing step; also has X/Y/edge variants).' },
  { name: 'width', args: 'v', meaning: 'Fixed or full-bleed width (length token | full | Int px).' },
  { name: 'height', args: 'v', meaning: 'Fixed or full-bleed height (length token | full | Int px).' },
  { name: 'minWidth', args: 'v', meaning: 'Minimum width constraint.' },
  { name: 'maxWidth', args: 'v', meaning: 'Maximum width constraint.' },
  { name: 'minHeight', args: 'v', meaning: 'Minimum height constraint.' },
  { name: 'maxHeight', args: 'v', meaning: 'Maximum height constraint.' },
  { name: 'grow', args: 'n', meaning: 'Flex grow weight (Int).' },
  { name: 'shrink', args: 'n', meaning: 'Flex shrink weight (Int).' },
  { name: 'aspect', args: 'w, h', meaning: 'Aspect ratio (Int, Int).' },
  { name: 'align', args: 'a', meaning: 'Cross-axis alignment: start|center|end|stretch.' },
  { name: 'justify', args: 'j', meaning: 'Main-axis distribution: start|center|end|between|around.' },
  { name: 'direction', args: 'd', meaning: 'Stack direction (containers): row|column.' },
  { name: 'wrap', args: 'b', meaning: 'Flex wrap (Bool).' },
  { name: 'overflow', args: 'o', meaning: 'Overflow behavior: visible|clip|scroll.' },
  { name: 'zIndex', args: 't', meaning: 'Stacking layer (z-index token).' },
  { name: 'bg', args: 't', meaning: 'Background (color token).' },
  { name: 'fg', args: 't', meaning: 'Foreground/tint for text and icons (color token).' },
  { name: 'borderColor', args: 't', meaning: 'Border color (color token).' },
  { name: 'opacity', args: 'n', meaning: 'Node opacity (0..100).' },
  { name: 'material', args: 'm', meaning: 'Glass surface: panel|card|subtle|window|overlay.' },
  { name: 'rounded', args: 't', meaning: 'Corner radius: sm|md|lg|xl|full.' },
  { name: 'border', args: 't', meaning: 'Border width (length token).' },
  { name: 'shadow', args: 't', meaning: 'Elevation: sm|md|lg.' },
  { name: 'textSize', args: 't', meaning: 'Font size from the type scale: xs|sm|base|lg|xl|…' },
  { name: 'fontWeight', args: 'w', meaning: 'Font weight: regular|medium|semibold|bold.' },
  { name: 'textAlign', args: 'a', meaning: 'Text alignment: left|center|right.' },
  { name: 'leading', args: 't', meaning: 'Line height (leading token).' },
  { name: 'truncate', args: 'n', meaning: 'Line clamp with ellipsis (Int lines).' },
  { name: 'disabled', args: 'b', meaning: 'Disables input and applies disabled styling (Bool).' },
  { name: 'focusable', args: 'b', meaning: 'Keyboard focus participation (Bool).' },
  { name: 'hitSlop', args: 'n', meaning: 'Extends the touch target (spacing step).' },
  { name: 'label', args: 's', meaning: 'Accessible name; required on unlabeled interactive nodes.' },
  { name: 'role', args: 'r', meaning: 'Semantic role override.' },
  { name: 'hint', args: 's', meaning: 'Accessible hint.' },
  { name: 'animate', args: 't, value: expr', meaning: 'Animate state-driven property changes (motion token).' },
  { name: 'transition', args: 't', meaning: 'Insert/remove/open/close lifecycle motion (motion token).' },
  { name: 'effect', args: 't, trigger: expr', meaning: 'Bounded attention effect on trigger change (motion token).' },
  { name: 'key', args: 'expr', meaning: 'Stable identity for items in collections; required.' },
];
