"use client";

import { useEffect, useState } from "react";

export default function useUserData() {
  const [userId, setUserId] = useState<string | null>("");
  const [name, setName] = useState<string | null>("");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setName(localStorage.getItem("name"));
  }, []);

  return { userId, name };
}
