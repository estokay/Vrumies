const PostRoutes = {
  video: "/videopost/",
  blog: "/blogpost/",
  event: "/eventpost/",
  request: "/requestpost/",
  market: "/marketpost/",
  directory: "/directorypost/",
  trucks: "/truckpost/",
  vehicle: "/vehiclepost/",
  loads: "/loadpost/",
  offer: "/offerpost/",
};

const GetPostRoute = (type) => {
  if (!type) return null;

  const normalizedType = type.toLowerCase().trim();

  return PostRoutes[normalizedType] || `/${normalizedType}post/`;
};

export default GetPostRoute;