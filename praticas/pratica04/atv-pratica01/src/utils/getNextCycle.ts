export function getNextCycle(currentCycle: number) {
  // Se for o estado inicial (0) ou se finalizou o último ciclo (8), volta para 1.
  // Caso contrário, apenas soma + 1 ao ciclo atual.
  return currentCycle === 0 || currentCycle === 8 ? 1 : currentCycle + 1;
}