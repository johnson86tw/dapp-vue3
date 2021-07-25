declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Shims for dependencies which don't support TypeScript, so we use these to avoid `Could not find a declaration
// file for module 'moduleName'` errors
// example:
// declare module '@heroicons/*';
// declare module 'nightwind/helper';
