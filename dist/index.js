"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogExecutionTime = LogExecutionTime;
function LogExecutionTime(keyName) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const key = keyName || propertyKey;
        if (isAsyncFunction(originalMethod)) {
            descriptor.value = function (...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const label = `${new Date().toISOString()} ${key}`;
                    try {
                        console.time(label);
                        const result = yield originalMethod.apply(this, args);
                        console.timeEnd(label);
                        return result;
                    }
                    catch (error) {
                        console.timeEnd(label);
                        throw error;
                    }
                });
            };
        }
        else {
            descriptor.value = function (...args) {
                const label = `${new Date().toISOString()} ${key}`;
                try {
                    console.time(label);
                    const result = originalMethod.apply(this, args);
                    console.timeEnd(label);
                    return result;
                }
                catch (error) {
                    console.timeEnd(label);
                    throw error;
                }
            };
        }
        return descriptor;
    };
}
function isAsyncFunction(fn) {
    return fn.constructor.name === "AsyncFunction";
}
