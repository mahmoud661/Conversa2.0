import validatePassword from "./passwordvalidation";

export interface PasswordStrengthResult {
  strength: number;
  label: string;
}

export function calculatePasswordStrength(
  password: string
): PasswordStrengthResult {
  if (!password) {
    return { strength: 0, label: "" };
  }

  // Base calculations
  let strength = 0;

  // Length contribution (up to 25%)
  const lengthFactor = Math.min(password.length / 16, 1);
  strength += lengthFactor * 25;

  // Character variety contribution (up to 75%)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;
  strength += (varietyCount / 4) * 75;

  // Clamp to 0-100
  strength = Math.max(0, Math.min(100, Math.round(strength)));

  // Determine label based on strength
  let label = "";
  if (strength < 30) {
    label = "Weak";
  } else if (strength < 60) {
    label = "Medium";
  } else if (strength < 80) {
    label = "Strong";
  } else {
    label = "Very Strong";
  }

  return { strength, label };
}

export function getPasswordFeedback(password: string): string | null {
  if (!password) return null;

  const { isValid, errors } = validatePassword(password);
  if (isValid) return null;

  return errors[0] || null;
}
