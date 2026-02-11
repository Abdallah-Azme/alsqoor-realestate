import { getSettings } from "@/lib/settings-actions";
import Navbar from "./navbar";

const NavbarWrapper = async ({ topnavColor }) => {
  const settings = await getSettings();

  return <Navbar topnavColor={topnavColor} settings={settings} />;
};

export default NavbarWrapper;
