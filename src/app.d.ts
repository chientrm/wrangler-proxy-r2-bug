// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      R2: R2Bucket;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env?: {
        R2: R2Bucket;
      };
    }
  }
}

export {};
