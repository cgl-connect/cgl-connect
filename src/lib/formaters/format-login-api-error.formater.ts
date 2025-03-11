export function formatLoginApiError(result: any) {
  switch (result?.error) {
    case "CredentialsSignin":
      return "Invalid email or password";

    default:
      return result?.error || "An error occurred while logging in.";
  }
}
