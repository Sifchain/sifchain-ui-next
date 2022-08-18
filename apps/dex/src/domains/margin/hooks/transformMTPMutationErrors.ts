export function transformMTPMutationErrors(error: string) {
  if (error.includes("unauthorized")) {
    return "Your account has not yet been approved for margin trading.";
  }

  return error;
}
