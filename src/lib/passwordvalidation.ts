enum PasswordValidationError {
  Length = "Password must be at least 8 characters long",
  Uppercase = "Password must contain at least one uppercase letter",
  Lowercase = "Password must contain at least one lowercase letter",
  Number = "Password must contain at least one number",
  SpecialCharacter = "Password must contain at least one special character",
}

enum validationStatus {
  weak = "weak",
  medium = "medium",
  strong = "strong",
  veryStrong = "very strong",
}
interface PasswordValidationResult {
  isValid: boolean;
  status: validationStatus;
  errors: PasswordValidationError[];
  message: string;
}

export default function validatePassword(
  password: string
): PasswordValidationResult {
  const errors: PasswordValidationError[] = [];

  if (password.length < 8) {
    errors.push(PasswordValidationError.Length);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(PasswordValidationError.Uppercase);
  }
  if (!/[a-z]/.test(password)) {
    errors.push(PasswordValidationError.Lowercase);
  }
  if (!/[0-9]/.test(password)) {
    errors.push(PasswordValidationError.Number);
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push(PasswordValidationError.SpecialCharacter);
  }

  const isValid = errors.length === 0;
  let status: validationStatus = validationStatus.weak;

  if (isValid) {
    status = validationStatus.veryStrong;
  } else if (errors.length <= 2) {
    status = validationStatus.medium;
  } else {
    status = validationStatus.weak;
  }

  return {
    isValid,
    status,
    errors,
    message: isValid ? "Password is valid" : "Password is invalid",
  };
}
