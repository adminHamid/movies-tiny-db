/* eslint-disable react/prop-types */
import { useState } from "react";

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 1000 }, () => "WORD");
  return (
    <ul>
      {words.map((word, i) => (
        <li key={i}>
          {i}: {word}
        </li>
      ))}
    </ul>
  );
}

function Counter({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Slow counter?!?</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
      {children}
    </div>
  );
}

export default function Test() {
  // const [count, setCount] = useState(0);
  // return (
  //   <div>
  //     <h1>Slow counter?!?</h1>
  //     <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
  //     <SlowComponent />
  //   </div>
  // );

  return (
    <div>
      <Counter>
        <SlowComponent />
      </Counter>
    </div>
  );
}




/**

### The Diffing Algorithm in React

React uses a "diffing" algorithm (often referred to as the reconciliation algorithm) to efficiently update the UI. The basic idea is that when a component's state or props change, React compares the new virtual DOM with the previous virtual DOM to determine which parts of the UI need to be updated.

One of the important optimization rules in this algorithm is:

- **If a component’s props (or children) haven't changed, React will skip re-rendering that component.**

Now, let's apply this concept to your code.

### Key Observations

1. **The `children` Prop:**
   - The `Counter` component is receiving `SlowComponent` as a child through the `children` prop. 
   - React's diffing algorithm uses the **type** of the child (in this case, `SlowComponent`) to decide whether it needs to re-render. If the type doesn't change, React will not re-render the component unless the state or props change.

2. **State Changes in Parent:**
   - The `Counter` component has a state (`count`) that is updated when the button is clicked. This means that every time the button is pressed, the parent (`Counter`) will re-render.
   - However, the child (`SlowComponent`) is not directly affected by the state of the parent. React will only re-render the `SlowComponent` if **its own props or state change**.

3. **No State or Prop Changes in `SlowComponent`:**
   - `SlowComponent` doesn't have any state of its own, and its props (it receives no props) don't change between renders.
   - Since the type of the `children` prop is always the same (`<SlowComponent />`), and its props (if any) haven't changed, React will skip re-rendering it. The `SlowComponent` will effectively be "cached" until something in its props or state changes.

4. **Reconciliation in Action:**
   - When `Counter` re-renders due to the state change (when the `count` changes), React recognizes that the `children` prop has not changed. Therefore, it does not re-render `SlowComponent` because the component type and props remain the same.

### What's Happening in the Code:

1. **The `Counter` Component:**
   - Every time you click the button, the `count` state in `Counter` changes, triggering a re-render of the `Counter` component.
   
2. **The `SlowComponent`:**
   - `SlowComponent` is passed as a child to `Counter` inside the JSX. Since nothing in the `SlowComponent` changes between renders (it doesn't have any state or props), React doesn't re-render it. 
   - Even though `Counter` re-renders, `SlowComponent` doesn't because its props haven't changed, and its internal state hasn't changed either.

### Why `SlowComponent` Doesn't Re-render:

- **Component Type**: The type of `SlowComponent` doesn't change. React compares the element types during reconciliation, and since `SlowComponent` remains the same, it skips re-rendering.
- **No Props or State Changes**: `SlowComponent` doesn't have any props that change, nor does it have state that updates. React only re-renders a component if the props or state have changed.
  
This is why the slow component doesn't re-render, even though the `Counter`'s state updates.

### The Explanation:

Your original explanation is mostly correct but could be clearer in the following areas:

- The key reason that `SlowComponent` doesn't re-render is that **its props and state are unchanged** and its component type remains the same across renders.
- The **diffing algorithm** optimizes re-renders by comparing the **type** of the component and its **props**. If neither changes, React avoids re-rendering that component.

### Conclusion:

The diffing algorithm avoids unnecessary re-renders by checking if the component type and props have changed. Since `SlowComponent` doesn't have any props that change and doesn't manage its own state, it doesn't re-render even when its parent (`Counter`) does. This showcases React's efficient rendering mechanism and how it optimizes performance by skipping unnecessary updates.

 */