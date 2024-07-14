# react-keyboard-avoiding-view

[![npm version](https://badge.fury.io/js/react-keyboard-avoiding-view.svg)](https://badge.fury.io/js/react-keyboard-avoiding-view)
[![npm downloads](https://img.shields.io/npm/dt/react-keyboard-avoiding-view.svg)](https://www.npmjs.com/package/react-keyboard-avoiding-view)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-keyboard-avoiding-view)](https://bundlephobia.com/result?p=react-keyboard-avoiding-view)

react-keyboard-avoiding-view is a simple and easy to use package that allows you to avoid the keyboard when it pops up on your screen. It is a simple wrapper around the KeyboardAvoidingView component.

In iOS, the keyboard will cover the input field when it pops up. This package will help you to avoid this issue.

## Installation

```bash
npm install @fe-eule/react-keyboard-avoiding-view
```

## Usage

```jsx
// in react not react-native
import React from "react";
import KeyboardAvoidingView from "@fe-eule/react-keyboard-avoiding-view";

const App = () => {
  return (
    <div>
      <input type="text" />
      <KeyboardAvoidingView>
        <button type="button">Next</button>
      </KeyboardAvoidingView>
    </div>
  );
};
```

## Inspiration

- [react-native KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)
