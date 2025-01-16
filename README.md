# react-basic-utils

A collection of basic utilities for react

## useIsMobile

Returns true if the viewport width is smaller or equal than 1023px. A minimal required width can be passed in as an argument.

```typescript
const isMobile = useIsMobile(); // useIsMobile(desiredMinWidth)
```

## useScroll

Get the scroll position within a `HTMLElement` or the window.

```typescript
const scrollPositionX = useScroll(targetEl, SCROLL_DIRECTION.X);
const scrollPositionY = useScroll(targetEl, SCROLL_DIRECTION.Y);
```

## scrollTo

Scroll to the position of an `HTMLElement`.

```typescript
scrollTo(targetEl);
```

## concatClassNames

Concatenate class names optionally.

```typescript
const activateCssClass = true;
<div
  className={concatClassNames([
    "some-basic-class",
    ["optional-class", activateCssClass],
  ])}
/>;
```
