export function getRemainingTime(timeLimit) {
  try {
    const now = new Date();
    const endTime = new Date(timeLimit);

    if (isNaN(endTime.getTime())) {
      throw new Error("Invalid time limit provided.");
    }

    const timeDifference = endTime - now;

    if (timeDifference <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
    };
  } catch (error) {
    return {
      hours: 0,
      minutes: 5,
      seconds: 0,
    };
  }
}
