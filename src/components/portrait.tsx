import { getImageProps } from "next/image";

/**
 * Art-directed portrait: the full 9:16 photo on desktop, a square crop on phones.
 * Each device downloads only its own version.
 */
export function Portrait() {
  const common = { alt: "Portrait of Aashar CK", sizes: "(max-width: 860px) 100vw, 30rem" };
  const {
    props: { srcSet: tall },
  } = getImageProps({ ...common, src: "/work/aashar-2-tall.jpg", width: 940, height: 1672, quality: 80 });
  const {
    props: { srcSet: square, ...rest },
  } = getImageProps({ ...common, src: "/work/aashar-2-square.jpg", width: 940, height: 940, quality: 80 });
  return (
    <picture>
      <source media="(min-width: 861px)" srcSet={tall} width={940} height={1672} />
      <img {...rest} srcSet={square} alt={common.alt} />
    </picture>
  );
}
