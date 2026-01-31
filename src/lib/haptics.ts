
export const hapticLight = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10); // Short, crisp vibration
  }
};

export const hapticMedium = () => {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
};

export const hapticHeavy = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
};

export const hapticError = () => {
    if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
    }
};

export const hapticSuccess = () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 30, 10]);
    }
};
