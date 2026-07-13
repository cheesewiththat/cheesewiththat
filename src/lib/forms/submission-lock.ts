export type SubmissionLock = { current: boolean };

export async function runWithSubmissionLock<T>(
  lock: SubmissionLock,
  submit: () => Promise<T>,
): Promise<T | undefined> {
  if (lock.current) return undefined;
  lock.current = true;
  try {
    return await submit();
  } finally {
    lock.current = false;
  }
}
