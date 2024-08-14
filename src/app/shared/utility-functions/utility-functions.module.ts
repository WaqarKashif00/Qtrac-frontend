export function getCurrentUTCDate(): Date {
    const CurrentDate = new Date();
    return new Date(CurrentDate.getUTCFullYear(),
        CurrentDate.getUTCMonth(),
        CurrentDate.getUTCDate(),
        CurrentDate.getUTCHours(),
        CurrentDate.getUTCMinutes(),
        CurrentDate.getUTCSeconds(),
        CurrentDate.getUTCMilliseconds()
    );
}

export function isDateLiesBetweenTwoDates(from: Date, to: Date, current: Date): boolean {
    
    const CurrentTime = new Date(current).getTime();
    const FromTime = new Date(from).getTime();
    const ToTime = new Date(to).getTime();
    return FromTime <= CurrentTime && ToTime >= CurrentTime;
}
