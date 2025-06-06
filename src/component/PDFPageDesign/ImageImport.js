import { useState, useEffect } from "react";

const ImageImport = ({ url }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [error, setError] = useState(null);

  const fetchImage = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (url) {
        const fetchedUrl = await fetchImage(url);
        if (fetchedUrl) {
          setImageSrc(fetchedUrl);
        }
      }
    };

    fetchData();
  }, [url]);

  if (error) {
    console.error("Error fetching image:", error);
    return null;
  }

  return imageSrc;
};

export default ImageImport;
