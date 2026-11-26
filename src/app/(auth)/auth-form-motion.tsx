import type { ReactNode } from "react";
import { Reveal } from "@/app/(website)/_components/website-motion";
import styles from "./auth-form-motion.module.css";

export default function AuthFormMotion({ children }: { children: ReactNode }) {
  return (
    <Reveal className={styles.frame}>
      {children}
    </Reveal>
  );
}
