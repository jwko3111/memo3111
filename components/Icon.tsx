// 아이콘은 Figma에서 내려받은 SVG 원본(public/icons)을 마스크로 써서 글자색(currentColor)을 따른다.
type IconName =
  | "plus"
  | "note"
  | "pin"
  | "pin-24"
  | "chevron-right"
  | "chevron-left"
  | "share"
  | "more";

type IconProps = {
  name: IconName;
  size: number;
  className?: string;
};

export function Icon({ name, size, className }: IconProps) {
  const url = `url(/icons/icon-${name}.svg)`;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
