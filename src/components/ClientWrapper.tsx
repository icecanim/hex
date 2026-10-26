"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    // Animasyon 4 saniyeden fazla sürerse zorla kapat
    const timeout = setTimeout(() => {
      setYukleniyor(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const animasyonBitir = () => {
    setYukleniyor(false);
  };

  return (
    <>
      {yukleniyor && <LoadingScreen onFinish={animasyonBitir} />}
      <div
        className={`transition-opacity duration-500 ${
          yukleniyor ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}