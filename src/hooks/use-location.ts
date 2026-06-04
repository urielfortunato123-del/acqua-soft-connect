import { useState } from "react";
import { toast } from "sonner";

export function useLocation(setValue: any) {
  const [loading, setLoading] = useState(false);

  const captureLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setValue("maps_link", mapsLink);
        toast.success("Localização capturada!");
        setLoading(false);
      },
      () => {
        toast.error("Não foi possível obter a localização.");
        setLoading(false);
      }
    );
  };

  return { captureLocation, loading };
}
