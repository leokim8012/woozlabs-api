interface MetaProps {
  title: string;
  description: string;
}

export default (item: MetaProps) => {
  const ts: Array<string> = [];
  if (item.title) ts.push(item.title);
  ts.push(process.env.VUE_APP_SITE_TITLE);
  const title = ts.join(" | ");
  const description: string =
    item.description.replace(/(<([^>]+)>)/gi, "") ||
    process.env.VUE_APP_SITE_DESCRIPTION;
  // const image = item.image || process.env.VUE_APP_SITE_IMAGE

  const descriptionNode: Element = document.querySelector(
    'head meta[name="description"]',
  ) as Element;
  const ogTitleNode: Element = document.querySelector(
    'head meta[property="og:title"]',
  ) as Element;
  const ogDescriptionNode: Element = document.querySelector(
    'head meta[property="og:description"]',
  ) as Element;
  // const ogImageNode = document.querySelector('head meta[property="og:image"]')
  document.title = title;
  descriptionNode.setAttribute("content", description);
  ogTitleNode.setAttribute("content", title);
  ogDescriptionNode.setAttribute("content", description);
  // ogImageNode.setAttribute('content', image)
};
