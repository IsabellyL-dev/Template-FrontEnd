export function formatSecondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesFormatted = String(minutes).padStart(2, '0');
  const secondsFormatted = String(remainingSeconds).padStart(2, '0');

  return `${minutesFormatted}:${secondsFormatted}`;
}