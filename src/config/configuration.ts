export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  reservoirApiEndpoint: process.env.RESERVOIR_BASE_API,
});
