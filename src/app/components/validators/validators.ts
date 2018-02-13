export function matchingFileds(passwordKey: string, confirmPasswordKey: string) {
  return (group): {
      [key: string]: any
  } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
          return {
              mismatchedPasswords: true
          };
      }
  }
}
