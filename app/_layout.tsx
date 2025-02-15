import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";

export default function Layout() {
  return 
  <UserProvider>
    <Slot />
  </UserProvider>
  ;
}
