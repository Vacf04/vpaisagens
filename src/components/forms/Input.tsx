"use client";
import styles from "./Input.module.css";
import { ComponentProps } from "react";

type InputType = ComponentProps<"input">;

export default function Input({ ...props }: InputType) {
  return <input {...props} className={styles.input} />;
}
