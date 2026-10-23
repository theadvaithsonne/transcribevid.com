/** Lets a spec read a plain file next to the project (public/sitemap.xml) with `import x from '...' with { loader: 'text' }`. */
declare module '*.xml' {
  const content: string;
  export default content;
}
declare module '*.txt' {
  const content: string;
  export default content;
}
