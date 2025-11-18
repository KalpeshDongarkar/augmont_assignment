export const Environment = {
  PROD: true,
  ENCRYPT_KEY: 'b6b0aa1ea5ae90ec',
  ENCRYPT_IV: 'b6b0aa1ea5ae90ec',
  IMGBASE_URL: 'http://localhost:3000',
  BASE_URL: 'http://localhost:3000/api',
  SRV_APISET: [
    {
      type: 'userauth',
      srv: '/userauth/v1',
    },
    {
      type: 'product',
      srv: '/product/v1',
    },
  ],
  ORCH_VERSION: 'v1.0.0',
};

export type EnvironmentType = (typeof Environment)[keyof typeof Environment];
