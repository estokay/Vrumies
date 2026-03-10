export const CLOUDINARY_CONFIG = {
  preset: 'vrumies_preset',
  cloudName: 'dmjvngk3o'
};

export const GOOGLE_API_KEY = 'AIzaSyAF-Y9M2YTMmMBu6RU7sDh4vRM9gFdC5MI';

export const DISTANCE_MATRIX_API_KEY = 'AIzaSyAnfsiGM1qhmERiAzHBm0pN7UjrydylDag';

export const ENV = {
  stripeMode: "test"
};

export const STRIPE_PUBLIC_KEYS = {
  test: 'pk_test_51JN8mDDR30hjV6c2f6WkKbqaLIJ91qsbyfK9Ho1Ge3hCwL2b3aZnWim7Ew9RhfprRoiInPWDRsXC8gqcdW6v4ST700vBUAakpE',
  live: 'pk_live_51JN8mDDR30hjV6c21Ni6BomHMySk86EywjrEhOiNg50zMCTOrOMUP6hPapaoco6ROfs0OqhAHWb8u1Pu8C9LlMFV00XLvfzaLK'
};

export const STRIPE_API_KEY = STRIPE_PUBLIC_KEYS[ENV.stripeMode];