# Changelog

## **v0.8.2** (Feature & Improvement Release)

- Updated SPFx version to 1.21

## **v0.8.1** (Feature & Improvement Release)

- Deletion feature with `Explorer` component.

## **v0.8.0** (Feature & Improvement Release)

- Added `Explorer` component with for navigating document libraries.
- Introduced various props to control the component.

## **v0.7.1** (Bug Fix Release)

- Fixed an export problem with the library for CodeEditor

## **v0.7.0** (Feature & Improvement Release)

- Added `CodeEditor` component with support for Monaco Editor.
- Introduced props for customizing word wrap, line numbers, minimap, and font size dynamically.
- Updated all component examples to use functional components with React hooks.

### Enhancements

- Added SonarQube integration with GitHub Actions.
- Enhanced Jest coverage reporting and integration with SonarQube.

### Bug Fixes

- Fixed an issue where font size in `CodeEditor` was not updating dynamically.
- Resolved an endless loop in `SiteService` when fetching breadcrumb data.

## **v0.6.6** (Bug Fix Release)

### **Bug Fixes & Improvements**

- Removed caching from requests for complete breadcrumb data generation
- Improved props and service comments
- SiteBreadcrumb Webpart can now have separator element props

## **v0.6.5** (Bug Fix Release)

### **Bug Fixes & Improvements**

- Handled breadcrumb traversal

## **v0.6.4** (Bug Fix Release)

### **Bug Fixes & Improvements**

- Fixed issue with Breadcrumb
- New ListForm props added

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
