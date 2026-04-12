// src/utils/cropNormalizer.js

/*
=====================================================
SUPPORTED CROPS
=====================================================
*/

export const SUPPORTED_CROPS = [
  "maize",
  "beans",
  "rice",
  "cassava",
  "sorghum",
  "millet",
  "groundnuts",
  "soybeans"
];

/*
=====================================================
Normalize crop input

=====================================================
*/
export const normalizeCrop = (crop) => {
  if (!crop) return "";
  return crop.trim().toLowerCase();
};


/*
=====================================================
Validate crop against backend supported list
=====================================================
*/
export const isSupportedCrop = (crop) => {
  const normalized = normalizeCrop(crop);
  return SUPPORTED_CROPS.includes(normalized);
};

/*
=====================================================
Validate before sending to backend
=====================================================
*/
export const validateCrop = (crop) => {
  const normalized = normalizeCrop(crop);

  if (!normalized) {
    throw new Error("Crop is required");
  }

  if (!isSupportedCrop(normalized)) {
    throw new Error(`Unsupported crop: ${crop}`);
  }

  return normalized;
};
