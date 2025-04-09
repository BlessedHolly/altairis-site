export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return `${formattedDate} at ${formattedTime}`;
}

export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        const ratio = Math.min(
          maxWidth / originalWidth,
          maxHeight / originalHeight
        );

        const newWidth = originalWidth * ratio;
        const newHeight = originalHeight * ratio;

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context is not available"));
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: "image/png",
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Failed to resize image"));
          }
        }, "image/png");
      };
    };

    reader.onerror = (error) => reject(error);
  });
};

export const handleDownload = async (post: { image: string }, name: string) => {
  const response = await fetch(post.image);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `ALTAIRIS_${name}`;
  a.click();

  URL.revokeObjectURL(url);
};
