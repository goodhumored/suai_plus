export default function getPageName(): string {
  const pathname_splitted = document.location.pathname.split("/");
  return pathname_splitted[pathname_splitted.length - 2];
}
