
export const hapticLight = () => {
  if (navigator.vibrate) {
    navigator.vibrate(25); // Stronger tick
  }
};

export const hapticMedium = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
};

export const hapticHeavy = () => {
    if (navigator.vibrate) {
      navigator.vibrate(60);
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

export const hapticBuilding = () => {
    if (navigator.vibrate) {
        const pattern = [
            25, 250, 30, 220, 35, 200, 40, 180, 45, 160, 50, 140, 55, 120, 60, 100,
            65, 90, 70, 80, 75, 70, 300, 120,
        ];
        navigator.vibrate(pattern);
    }
};
