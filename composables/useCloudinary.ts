

type CloudinaryWidgetOptions = {
  cloudName?: string;
  uploadPreset?: string;
  multiple?: boolean;
  maximumFiles?: number;
  [key: string]: any;
};

type CloudinaryWidgetResult = {
  event: string;
  info: {
    secure_url: string;
    [key: string]: any;
  };
};

type CloudinaryCallbacks = {
  onSuccess?: (result: CloudinaryWidgetResult) => void;
  onClose?: () => void;
  onOpen?: () => void;
  onError?: (error: any) => void;
  onEvent?: (result: CloudinaryWidgetResult) => void;
};

export function useCloudinary() {
  const config = useRuntimeConfig();

  const cloudName = config.public.cloudinaryCloudName;
  const uploadPreset = config.public.uploadPreset;

  function createWidget(
    options: CloudinaryWidgetOptions = {},
    callbacks: CloudinaryCallbacks = {}
  ) {
    const defaultOptions: CloudinaryWidgetOptions = {
      cloudName,
      uploadPreset,
      multiple: false,
      maximumFiles: 1,
    };

    const finalOptions = { ...defaultOptions, ...options };
    // @ts-ignore
    const myWidget = cloudinary.createUploadWidget(
      finalOptions,
      (error: any, result: any) => {
        console.log("ERROR", error);
        console.log("RESULT", result);

        if (!error && result && result.event === "success") {
          callbacks.onSuccess?.(result);
        } else {
          if (result.info == "shown") {
            callbacks.onClose?.();
          }
          if (result.info == "hidden") {
            callbacks.onOpen?.();
          }

          return null;
        }
      }
    );

    return myWidget;
  }

  function openWidget(
    options: CloudinaryWidgetOptions = {},
    callbacks: CloudinaryCallbacks = {}
  ) {
    const widget = createWidget(options, callbacks);
    widget.open();
  }

  async function deleteImage(secure_url: string) {
    // cloudinary.
  }

  return { openWidget };
}
