# Changelog

## **v0.6.3** (Bug Fix Release)

### **Bug Fixes & Improvements**

- **Fixed an import bug**
  - Submodule paths were not added in package.json
  - Updated tsconfig to build the module and support webpack v5

## **v0.6.2** (Bug Fix Release)

### **Bug Fixes & Improvements**

- **Added support for package-specific imports**
  - Now, components can be imported directly using **specific paths**, making tree-shaking and optimized bundling more effective.

### **How It Helps?**

- **Improved modular imports**: Instead of importing the entire package, you can now import only what you need.
- **Better Tree-Shaking**: Helps reduce bundle size by avoiding unnecessary imports.
- **More Intuitive Usage**: Aligns with modern best practices in package structuring.

### **Example Usage**

**Before (0.6.1 & earlier):**

```js
import { Dashboard } from 'mui-spfx-controls';
```

**Issue**: This imports all components, increasing bundle size.

**Now (0.6.2+):**

```js
import Dashboard from 'mui-spfx-controls/Dashboard';
```

**Benefit**: Imports only the required module, improving performance.
