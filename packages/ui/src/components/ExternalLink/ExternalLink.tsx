import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

type ExternalLinkProps = AnchorHTMLAttributes<Record<string, never>>;
export function ExternalLink({ href, rel, className, target, children }: PropsWithChildren<ExternalLinkProps>) {
  return (
    <a href={href} rel={rel} className={className} target={target}>
      {children}
    </a>
  );
}
ExternalLink.defaultProps = {
  rel: "noopener noreferrer",
  target: "_blank",
};
