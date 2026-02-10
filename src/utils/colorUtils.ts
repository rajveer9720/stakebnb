export const colors = {
  primary: import.meta.env.VITE_APP_PRIMARY_COLOR,
  secondary: import.meta.env.VITE_APP_SECONDARY_COLOR,
  success: import.meta.env.VITE_APP_SUCCESS_COLOR,
  warning: import.meta.env.VITE_APP_WARNING_COLOR,
  
  textPrimary: import.meta.env.VITE_APP_TEXT_PRIMARY,
  textSecondary: import.meta.env.VITE_APP_TEXT_SECONDARY,
  textMuted: import.meta.env.VITE_APP_TEXT_MUTED,
  
  cardBg: import.meta.env.VITE_APP_CARD_BG,
  cardBorder: import.meta.env.VITE_APP_CARD_BORDER,
  cardHoverBg: import.meta.env.VITE_APP_CARD_HOVER_BG,
  cardHoverBorder: import.meta.env.VITE_APP_CARD_HOVER_BORDER,
  
  buttonBg: import.meta.env.VITE_APP_BUTTON_BG,
  buttonText: import.meta.env.VITE_APP_BUTTON_TEXT,
  buttonHover: import.meta.env.VITE_APP_BUTTON_HOVER,
  
  shadowDefault: import.meta.env.VITE_APP_SHADOW_DEFAULT,
  shadowLight: import.meta.env.VITE_APP_SHADOW_LIGHT,
  shadowPrimary: import.meta.env.VITE_APP_SHADOW_PRIMARY,
  shadowSecondary: import.meta.env.VITE_APP_SHADOW_SECONDARY,
  
  navbarBg: import.meta.env.VITE_APP_NAVBAR_BG_COLOR,
  navbarButtonBg: import.meta.env.VITE_APP_NAVBAR_BUTTON_BG_COLOR,
  navbarButtonText: import.meta.env.VITE_APP_NAVBAR_BUTTON_TEXT_COLOR,
  
  heroBg: import.meta.env.VITE_APP_HERO_BG_GRADIENT,
  heroText: import.meta.env.VITE_APP_HERO_TEXT_COLOR,
  heroAccent: import.meta.env.VITE_APP_HERO_ACCENT_COLOR,
  heroStatBg: import.meta.env.VITE_APP_HERO_STAT_CARD_BG,
  heroStatText: import.meta.env.VITE_APP_HERO_STAT_TEXT_COLOR,
  
  depositInputBg: import.meta.env.VITE_APP_DEPOSIT_INPUT_BG_COLOR,
  depositWarningBg: import.meta.env.VITE_APP_DEPOSIT_WARNING_BG_COLOR,

  headingColor: import.meta.env.VITE_APP_HEADING_COLOR,
  headingSubtitleColor: import.meta.env.VITE_APP_HEADING_SUBTITLE_COLOR,
  
  appBgGradient: import.meta.env.VITE_APP_BG_GRADIENT,
  fontFamily: import.meta.env.VITE_APP_FONT_FAMILY,
};

export const cssVars = {
  "--color-primary": colors.primary,
  "--color-secondary": colors.secondary,
  "--color-success": colors.success,
  "--color-warning": colors.warning,
  "--text-primary": colors.textPrimary,
  "--text-secondary": colors.textSecondary,
  "--text-muted": colors.textMuted,
  "--card-bg": colors.cardBg,
  "--card-border": colors.cardBorder,
  "--card-hover-bg": colors.cardHoverBg,
  "--card-hover-border": colors.cardHoverBorder,
  "--btn-bg": colors.buttonBg,
  "--btn-text": colors.buttonText,
  "--btn-hover": colors.buttonHover,
  "--shadow-default": colors.shadowDefault,
  "--shadow-light": colors.shadowLight,
  "--shadow-primary": colors.shadowPrimary,
  "--shadow-secondary": colors.shadowSecondary,
  "--navbar-bg": colors.navbarBg,
  "--navbar-btn-bg": colors.navbarButtonBg,
  "--navbar-btn-text": colors.navbarButtonText,
  "--hero-bg": colors.heroBg,
  "--hero-text": colors.heroText,
  "--hero-accent": colors.heroAccent,
  "--hero-stat-bg": colors.heroStatBg,
  "--hero-stat-text": colors.heroStatText,
  "--deposit-input-bg": colors.depositInputBg,
  "--deposit-warning-bg": colors.depositWarningBg,
  "--heading-color": colors.headingColor,
  "--heading-subtitle-color": colors.headingSubtitleColor,
  "--app-bg-gradient": colors.appBgGradient,
};

export const applyTheme = () => {
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([property, value]) => {
    if (value) {
      root.style.setProperty(property, value);
    }
  });
  
  document.body.style.background = colors.appBgGradient || '';
  document.body.style.fontFamily = colors.fontFamily || '';
  document.body.style.color = colors.textPrimary || '';
};

export const getColor = (colorName: keyof typeof colors): string => {
  return colors[colorName] || '';
};

export const getCSSVar = (varName: keyof typeof cssVars): string => {
  return cssVars[varName] || '';
};