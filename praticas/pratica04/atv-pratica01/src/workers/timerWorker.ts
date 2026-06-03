let timerInterval: any = null;

self.onmessage = (e: MessageEvent) => {
  const state = e.data;
  let secondsRemaining = state.secondsRemaining ?? 0;
  console.log('WORKER RECEBEU:', secondsRemaining); // 👈

  if (timerInterval) return; 

  timerInterval = setInterval(() => {
    secondsRemaining -= 1;
    (self as any).postMessage(secondsRemaining);

    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 1000);
};