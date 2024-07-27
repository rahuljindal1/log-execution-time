# `Log Method Execution Time Decorator`

A simple TypeScript decorator for logging the execution time of methods. This package helps in measuring and logging the time taken by methods to execute, useful for performance monitoring and debugging.

## Installation

To install the package, run:

```sh
npm install log-execution-time-new
```

## Basic Example

Use the decorator on a synchronous method:

```typescript
import LogExecutionTime from 'log-execution-time-new';

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
import LogExecutionTime from 'log-execution-time-new';

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

1. **Options**: Provide options that will be used while logging the execution time:

```typescript
import LogExecutionTime from 'log-execution-time-new';

class ExampleClass {
  @LogExecutionTime({ keyName: "CustomKeyMethod" })
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

### Available Options

```bash
1. keyName: Set custom key for the logged entity.
2. disable: Conditionally disable logging.
3. showExecutionCount: Add a count for how many times a function being called.
```


## Contributing
Feel free to submit issues or pull requests if you have suggestions for improvements or find bugs.

## License
This package is licensed under the MIT License
