let isRunning = false;
let timerId = null;

self.onmessage = function (event) {
  const state = event.data;

  // Validação: Se não for um objeto com activeTask, ignore ou trate como comando
  if (!state || !state.activeTask) {
    console.warn('Worker: Dados inválidos ou comando não reconhecido', state);
    return;
  }

  // Se já houver um timer rodando, para o antigo antes de começar o novo
  if (timerId) clearTimeout(timerId);

  const { activeTask, secondsRemaining } = state;
  const endDate = activeTask.startDate + secondsRemaining * 1000;

  function tick() {
    const now = Date.now();
    const countDownSeconds = Math.max(0, Math.floor((endDate - now) / 1000));

    self.postMessage(countDownSeconds);

    if (countDownSeconds <= 0) {
      return;
    }

    timerId = setTimeout(tick, 1000);
  }

  tick();
};