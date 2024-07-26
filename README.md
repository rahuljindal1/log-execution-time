# `log-execution-time`

A simple TypeScript decorator for logging the execution time of methods. This package helps in measuring and logging the time taken by methods to execute, useful for performance monitoring and debugging.

## Installation

To install the package, run:

```sh
npm install log-execution-time
```

## Basic Example

Use the decorator on a synchronous method:

```typescript
import LogExecutionTime from 'log-execution-time';

class ExampleClass {
  @LogExecutionTime()
  myMethod() {
    // Simulate a time-consuming task
    for (let i = 0; i < 1e6; i++) {}
  }
}

const instance = new ExampleClass();
instance.myMethod();
```

```typescript
Expected Output: 2024-07-26T14:28:00.000Z myMethod: 123ms
```

Use the decorator on an asynchronous method:

```typescript
import LogExecutionTime from 'log-execution-time';

class ExampleClass {
  @LogExecutionTime()
  async myAsyncMethod() {
    // Simulate a time-consuming task
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}

const instance = new ExampleClass();
instance.myMethod();
```

```typescript
Expected Output: 2024-07-26T14:29:00.000Z myAsyncMethod: 1000ms
```

## Additional Parameters

1. **Custom Key**: Provide a custom key name to be included in the log output:

```typescript
import LogExecutionTime from 'log-execution-time';

class ExampleClass {
  @LogExecutionTime('CustomKeyMethod')
  myCustomKeyMethod() {
    // Simulate a time-consuming task
    for (let i = 0; i < 1e6; i++) {}
  }
}

const instance = new ExampleClass();
instance.myCustomKeyMethod();
``` 

```typescript
Expected Output: 2024-07-26T14:30:00.000Z CustomKeyMethod: 200ms
```

## Contributing
Feel free to submit issues or pull requests if you have suggestions for improvements or find bugs.