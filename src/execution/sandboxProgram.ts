import type { ExecuteRequest } from './messages'

export function buildSandboxProgram(request: ExecuteRequest): string {
  const inputJson = JSON.stringify(request.input)
  const encodedInput = JSON.stringify(inputJson)
  const maxEvents = Math.max(0, Math.floor(request.maxEvents))
  const collectTrace = request.mode === 'run'

  return `(() => {
    "use strict";
    const __labStringify = JSON.stringify.bind(JSON);
    const __labParse = JSON.parse.bind(JSON);
    const __labInput = __labParse(${encodedInput});
    const __labLogs = [];
    const __labFormat = (value) => {
      if (typeof value === "string") return value;
      try {
        const text = __labStringify(value);
        return text === undefined ? String(value) : text;
      } catch (_) {
        return String(value);
      }
    };
    globalThis.console = Object.freeze({
      log: (...values) => { if (__labLogs.length < 200) __labLogs.push(values.map(__labFormat).join(" ")); },
      info: (...values) => { if (__labLogs.length < 200) __labLogs.push(values.map(__labFormat).join(" ")); },
      warn: (...values) => { if (__labLogs.length < 200) __labLogs.push("Warning: " + values.map(__labFormat).join(" ")); },
      error: (...values) => { if (__labLogs.length < 200) __labLogs.push("Error: " + values.map(__labFormat).join(" ")); }
    });

    ${request.code}

    if (typeof solve !== "function") {
      throw new TypeError("Define a solve(input) function before running your code.");
    }

    const __labResult = solve(__labInput);
    if (__labResult && typeof __labResult.then === "function") {
      throw new TypeError("Async solutions are not supported. Return a synchronous value from solve().");
    }

    const __labEvents = [];
    let __labTruncated = false;
    if (${String(collectTrace)} && typeof trace === "function") {
      const __labTrace = trace(__labInput);
      if (__labTrace && typeof __labTrace.next === "function") {
        for (let __labIndex = 0; __labIndex < ${maxEvents}; __labIndex += 1) {
          const __labNext = __labTrace.next();
          if (__labNext.done) break;
          __labEvents.push(__labNext.value);
          if (__labIndex === ${Math.max(0, maxEvents - 1)}) __labTruncated = true;
        }
      } else if (Array.isArray(__labTrace)) {
        __labTruncated = __labTrace.length > ${maxEvents};
        __labEvents.push(...__labTrace.slice(0, ${maxEvents}));
      } else if (__labTrace !== undefined) {
        throw new TypeError("trace(input) must return a generator or an array of events.");
      }
    }

    const __labClone = (value) => {
      const text = __labStringify(value);
      return text === undefined ? null : __labParse(text);
    };
    return {
      result: __labClone(__labResult),
      events: __labClone(__labEvents),
      logs: __labClone(__labLogs),
      truncated: __labTruncated
    };
  })()`
}
