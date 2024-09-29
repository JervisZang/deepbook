export function log(...optionalParams: any[]) {
    function getCallerInfo(): string {
        const stack = new Error().stack;
        if (!stack) {
            return '';
        }
        const stackLines = stack.split('\n');
        const callerLine = stackLines[3]; // Adjust index if needed based on your environment
        // const idx = callerLine.lastIndexOf("/", callerLine.lastIndexOf("/") - 1)
        const idx = callerLine.lastIndexOf("/")
        return callerLine.substring(idx);
    }
    console.log(getCallerInfo(), ...optionalParams);
}

log(1);