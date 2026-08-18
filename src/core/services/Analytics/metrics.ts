export function reachGoal(name: string) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const myTrackerId = process.env.NEXT_PUBLIC_MY_TRACKER_ID;

  if (yandexMetrikaId && typeof window.ym === 'function') {
    window.ym(yandexMetrikaId, 'reachGoal', name);
  }

  if (myTrackerId && window._tmr) {
    window._tmr.push({
      id: myTrackerId,
      type: 'reachGoal',
      goal: name,
    });
  }
}
