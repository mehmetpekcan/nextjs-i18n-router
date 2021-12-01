import NextLink from "next/link";
import { useRouter } from "next/router";

import { createUrl } from "./helpers";

const Link = ({ name, locale, params, ...props }) => {
  const router = useRouter();
  const translatedUrl = createUrl(name, locale || router.locale, params);

  return (
    <NextLink
      {...props}
      href={translatedUrl}
      as={props.as || translatedUrl}
      locale={false}
    />
  );
};

export default Link;
