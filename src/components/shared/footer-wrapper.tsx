import { getSettings } from "@/lib/settings-actions";
import Footer from "./footer";

const FooterWrapper = async () => {
  const settings = await getSettings();

  return <Footer settings={settings} />;
};

export default FooterWrapper;
